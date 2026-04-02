// app/projects/[id].tsx  — Performance-optimised rewrite
// Mirrors index.tsx patterns: paginated hero, paginated grid, memoised cells,
// capped thumbnails, lazy-mounted Lightbox, tight virtualisation knobs.

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useMemo, useRef, useState } from "react";
// @ts-ignore
import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { projects2 } from "../../data/projects";
const ImageZoom = require("react-native-image-pan-zoom").default;

// HERO_H is now dynamic — computed from current window dimensions, not a constant.
// Keeping these as config values only (not used as fixed pixel heights).
const HERO_PAGE_SIZE = 6;
const GRID_ROWS_PER_PAGE = 4;
const THUMB_CAP = 8;

const T = {
  bg: "#F7F5F2",
  white: "#FFFFFF",
  stone: "#EDE9E3",
  tan: "#C4A882",
  tanDark: "#9C7E5A",
  ink: "#1A1714",
  inkSoft: "#3D3830",
  gray: "#8A857E",
  grayLight: "#B8B3AC",
  line: "#E0DAD2",
  skeleton: "#E8E2DC",
  skeletonShimmer: "#F2EDE8",
};

const CAT_ACCENT: Record<string, string> = {
  Residential: "#9C7E5A",
  Commercial: "#4A7C6A",
  Interior: "#6058A0",
  Hospitality: "#A06050",
  Landscaping: "#3A7050",
  "Amusement Parks": "#B07830",
  "Educational Institution": "#507890",
  Walkthrough: "#506878",
};

type IconName = keyof typeof Ionicons.glyphMap;

// ─────────────────────────────────────────────────────────────────────────────
// LazyImage
// ─────────────────────────────────────────────────────────────────────────────
const LazyImage = memo(function LazyImage({
  uri,
  style,
  resizeMode = "cover",
}: {
  uri: string;
  style: any;
  resizeMode?: "cover" | "contain" | "stretch";
}) {
  const [loaded, setLoaded] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const handleLoad = useCallback(() => {
    setLoaded(true);
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={[style, { overflow: "hidden" }]}>
      {!loaded && (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: T.skeleton }]}
        />
      )}
      <Animated.Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, { opacity: fade }]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
      />
    </View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GridCell
// ─────────────────────────────────────────────────────────────────────────────
const GridCell = memo(function GridCell({
  uri,
  index,
  onPress,
  width,
  height,
}: {
  uri: string;
  index: number;
  onPress: () => void;
  width: number;
  height: number;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.gridCell, { width, height }]}
    >
      <LazyImage uri={uri} style={StyleSheet.absoluteFill} />
      <View style={s.gridVeil} pointerEvents="none" />
      <View style={s.gridBadge} pointerEvents="none">
        <Text style={s.gridBadgeText}>{index + 1}</Text>
      </View>
    </TouchableOpacity>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// LightboxSlide — isolated per-slide zoom component
// FIX: width/height passed as props (already from useWindowDimensions in parent)
//      so they're always current. The blurred bg now uses absoluteFillObject
//      on a flex:1 container so it stretches to whatever size the slide is.
// ─────────────────────────────────────────────────────────────────────────────
const LightboxSlide = memo(function LightboxSlide({
  item,
  width,
  height,
  onZoomChange,
}: {
  item: string;
  width: number;
  height: number;
  onZoomChange: (zoomed: boolean) => void;
}) {
  const scaleRef = useRef(1);

  return (
    // FIX: Use explicit width/height (not flex:1) so pagingEnabled snaps correctly.
    // overflow:hidden clips the blurred bg to exactly this slide's bounds.
    <View style={{ width, height, overflow: "hidden" }}>
      {/* Blurred background — fills the entire slide */}
      <Image
        source={{ uri: item }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={20}
        resizeMode="cover"
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0,0,0,0.4)" },
        ]}
      />

      {/* 
        Main image centred inside the slide.
        FIX: wrap in absoluteFillObject container so it always fills the slide
        regardless of portrait/landscape. resizeMode="contain" keeps aspect ratio.
      */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <LazyImage uri={item} style={{ width, height }} resizeMode="contain" />
      </View>
    </View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox
// FIX: useWindowDimensions is called here so width/height update on rotation.
//      renderItem and getItemLayout both depend on live width/height.
// ─────────────────────────────────────────────────────────────────────────────
const Lightbox = memo(function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // FIX: useWindowDimensions inside Lightbox — re-renders with correct values on rotation
  const { width, height } = useWindowDimensions();

  const handleZoomChange = useCallback((zoomed: boolean) => {
    setScrollEnabled(!zoomed);
  }, []);

  // FIX: renderItem and getItemLayout depend on live width/height (no stale closure)
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <LightboxSlide
        item={item}
        width={width}
        height={height}
        onZoomChange={handleZoomChange}
      />
    ),
    [width, height, handleZoomChange],
  );

  const keyExtractor = useCallback((_: string, i: number) => `lb-${i}`, []);

  // FIX: getItemLayout uses live width so scroll offsets are correct after rotation
  const getItemLayout = useCallback(
    (_: any, i: number) => ({ length: width, offset: width * i, index: i }),
    [width],
  );

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 200,
    useNativeDriver: true,
  }).start();

  const close = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(onClose);
  }, [onClose, fadeAnim]);

  // FIX: on orientation change, scroll to the current image with correct offset
  const handleLayout = useCallback(() => {
    if (flatRef.current && images.length > 0) {
      flatRef.current.scrollToIndex({ index: current, animated: false });
    }
  }, [current, images.length]);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: fadeAnim, backgroundColor: "black" },
        ]}
        // FIX: onLayout fires when the modal resizes (rotation) → re-snap to current slide
        onLayout={handleLayout}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Close button */}
        <TouchableOpacity
          style={[lb.closeBtn, { top: insets.top + 10 }]}
          onPress={close}
          hitSlop={16}
        >
          <Ionicons name="close" size={20} color={T.white} />
        </TouchableOpacity>

        {/* Counter */}
        <View style={[lb.counterWrap, { top: insets.top + 16 }]}>
          <Text style={lb.counterText}>
            {current + 1} / {images.length}
          </Text>
        </View>

        <FlatList
          key={width}
          ref={flatRef}
          data={images}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          horizontal
          pagingEnabled
          scrollEnabled={scrollEnabled}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={startIndex}
          onMomentumScrollEnd={(e) =>
            setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          removeClippedSubviews={false}
        />

        {/* Dot strip */}
        {images.length > 1 && images.length <= 16 && (
          <View style={[lb.dots, { paddingBottom: insets.bottom + 20 }]}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[lb.dot, i === current ? lb.dotActive : lb.dotInactive]}
              />
            ))}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ProjectDetails — main screen
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // FIX: useWindowDimensions at top level — all derived values (HERO_H, CELL_W, etc.)
  // are recomputed on every render triggered by rotation. No stale constants.
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // FIX: HERO_H is now dynamic — shorter in landscape so hero doesn't eat the whole screen
  // const HERO_H = isLandscape ? Math.round(height * 0.7) : 320;
  const HERO_H = Math.round(width * 0.56); // 16:9 ratio

  // FIX: In landscape, use 3-column grid; portrait uses 2-column
  const GRID_COLS = isLandscape ? 3 : 2;
  const GRID_GAP = 6;
  const GRID_PADDING = 12;
  const CELL_W =
    (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
  const CELL_H = CELL_W * 0.72;
  const GRID_ROW_H = CELL_H + GRID_GAP;

  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const [heroPage, setHeroPage] = useState(1);
  const [heroLoadingMore, setHeroLoadingMore] = useState(false);

  const [gridPage, setGridPage] = useState(1);
  const [gridLoadingMore, setGridLoadingMore] = useState(false);

  const heroRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace("/projects");
        return true;
      });
      return () => sub.remove();
    }, [router]),
  );

  const project = projects2.find((p) => p.id === id);
  const accent = project
    ? (CAT_ACCENT[project.category] ?? T.tanDark)
    : T.tanDark;

  const allImages: string[] = useMemo(
    () =>
      project
        ? [
            typeof project.image === "string" ? project.image : "",
            ...(project.gallery ?? []).map((g: any) =>
              typeof g === "string" ? g : "",
            ),
          ].filter(Boolean)
        : [],
    [project],
  );

  const visibleHeroImages = useMemo(
    () => allImages.slice(0, heroPage * HERO_PAGE_SIZE),
    [allImages, heroPage],
  );
  const hasMoreHero = visibleHeroImages.length < allImages.length;

  const loadMoreHero = useCallback(() => {
    if (heroLoadingMore || !hasMoreHero) return;
    setHeroLoadingMore(true);
    setTimeout(() => {
      setHeroPage((p) => p + 1);
      setHeroLoadingMore(false);
    }, 150);
  }, [heroLoadingMore, hasMoreHero]);

  // FIX: Grid rows now use GRID_COLS instead of hardcoded 2
  const allGridRows: string[][] = useMemo(() => {
    const rows: string[][] = [];
    for (let i = 0; i < allImages.length; i += GRID_COLS) {
      rows.push(allImages.slice(i, i + GRID_COLS));
    }
    return rows;
  }, [allImages, GRID_COLS]);

  const visibleGridRows = useMemo(
    () => allGridRows.slice(0, gridPage * GRID_ROWS_PER_PAGE),
    [allGridRows, gridPage],
  );

  const hasMoreGrid = visibleGridRows.length < allGridRows.length;
  const remainingGridImages =
    (allGridRows.length - visibleGridRows.length) * GRID_COLS;

  const loadMoreGrid = useCallback(() => {
    if (gridLoadingMore || !hasMoreGrid) return;
    setGridLoadingMore(true);
    setTimeout(() => {
      setGridPage((p) => p + 1);
      setGridLoadingMore(false);
    }, 300);
  }, [gridLoadingMore, hasMoreGrid]);

  // FIX: heroHeight animation collapses to a reasonable value in both orientations
  const heroHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [HERO_H, isLandscape ? 140 : 220],
    extrapolate: "clamp",
  });
  const navBg = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ["rgba(247,245,242,0)", "rgba(247,245,242,1)"],
    extrapolate: "clamp",
  });
  const navBorder = scrollY.interpolate({
    inputRange: [60, 80],
    outputRange: [0, StyleSheet.hairlineWidth],
    extrapolate: "clamp",
  });

  const goTo = useCallback((index: number) => {
    heroRef.current?.scrollToIndex({ index, animated: true });
    setActiveImg(index);
  }, []);

  const heroKeyExtractor = useCallback(
    (_: string, i: number) => `hero-${i}`,
    [],
  );

  // FIX: heroItemLayout uses live width
  const heroItemLayout = useCallback(
    (_: any, i: number) => ({ length: width, offset: width * i, index: i }),
    [width],
  );

  // FIX: renderHeroItem no longer captures heroHeight stale — it's an Animated.Value
  // so it always tracks current interpolation. But HERO_H used inside must be live too.
  const renderHeroItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <Pressable
        style={{ width }}
        onPress={() => {
          setLightboxStart(index);
          setLightboxOpen(true);
        }}
      >
        {/* FIX: height set via heroHeight (Animated.Value) — always current */}
        <Animated.View
          style={{ width, height: heroHeight, overflow: "hidden" }}
        >
          {/* FIX: inner image uses full HERO_H so it fills the animated container */}
          <LazyImage uri={item} style={{ width, height: HERO_H }} />
        </Animated.View>
        <View style={s.slideVeil} pointerEvents="none" />
        {index === 0 && (
          <View style={s.expandHint} pointerEvents="none">
            <Ionicons name="expand-outline" size={13} color={T.white} />
            <Text style={s.expandHintText}>Tap to expand</Text>
          </View>
        )}
      </Pressable>
    ),
    // HERO_H and width are now live (recomputed each render from useWindowDimensions)
    [heroHeight, width, HERO_H],
  );

  const gridKeyExtractor = useCallback((_: any, i: number) => `row-${i}`, []);

  // FIX: gridItemLayout uses live GRID_ROW_H
  const gridItemLayout = useCallback(
    (_: any, i: number) => ({
      length: GRID_ROW_H,
      offset: GRID_ROW_H * i,
      index: i,
    }),
    [GRID_ROW_H],
  );

  // FIX: renderGridRow supports variable column count (GRID_COLS)
  const renderGridRow = useCallback(
    ({ item, index }: { item: string[]; index: number }) => {
      return (
        <View style={[s.gridRow, { gap: GRID_GAP }]}>
          {Array.from({ length: GRID_COLS }).map((_, col) => {
            const imgIndex = index * GRID_COLS + col;
            const uri = item[col];
            if (!uri) {
              // Empty filler cell to keep grid alignment
              return (
                <View key={col} style={{ width: CELL_W, height: CELL_H }} />
              );
            }
            return (
              <GridCell
                key={col}
                uri={uri}
                index={imgIndex}
                width={CELL_W}
                height={CELL_H}
                onPress={() => {
                  setLightboxStart(imgIndex);
                  setLightboxOpen(true);
                }}
              />
            );
          })}
        </View>
      );
    },
    [CELL_W, CELL_H, GRID_COLS, GRID_GAP],
  );

  const GridFooter = useCallback(
    () =>
      hasMoreGrid ? (
        <TouchableOpacity
          onPress={loadMoreGrid}
          disabled={gridLoadingMore}
          activeOpacity={0.75}
          style={[s.loadMoreBtn, { borderColor: accent }]}
        >
          {gridLoadingMore ? (
            <View style={s.skeletonRows}>
              {[0, 1].map((r) => (
                <View key={r} style={s.skeletonRow}>
                  {Array.from({ length: GRID_COLS }).map((_, c) => (
                    <View
                      key={c}
                      style={[
                        s.skeletonCell,
                        { width: CELL_W, height: CELL_H },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          ) : (
            <View style={s.loadMoreInner}>
              <Text style={[s.loadMoreText, { color: accent }]}>
                Load more photos
              </Text>
              <View
                style={[s.loadMoreBadge, { backgroundColor: accent + "20" }]}
              >
                <Text style={[s.loadMoreBadgeText, { color: accent }]}>
                  {Math.max(0, remainingGridImages)}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={s.allShownRow}>
          <View style={[s.allShownLine, { backgroundColor: accent + "40" }]} />
          <Text style={[s.allShownText, { color: accent }]}>
            All {allImages.length} photos
          </Text>
          <View style={[s.allShownLine, { backgroundColor: accent + "40" }]} />
        </View>
      ),
    [
      hasMoreGrid,
      gridLoadingMore,
      accent,
      remainingGridImages,
      allImages.length,
      loadMoreGrid,
      GRID_COLS,
      CELL_W,
      CELL_H,
    ],
  );

  if (!project) {
    return (
      <SafeAreaView style={s.root}>
        <StatusBar barStyle="dark-content" backgroundColor={T.bg} />
        <View style={s.notFound}>
          <Ionicons name="alert-circle-outline" size={52} color={T.grayLight} />
          <Text style={s.notFoundTitle}>Project not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const META_EMOJI: Record<string, string> = {
    Category: "🏠",
    Area: "📐",
  };
  const metaData: { label: string; value: string; icon: IconName }[] = [
    { label: "Category", value: project.category, icon: "home-outline" },
    { label: "Area", value: project.area ?? "—", icon: "resize-outline" },
  ];

  const thumbImages = allImages.slice(0, THUMB_CAP);
  const thumbOverflow = allImages.length - THUMB_CAP;

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View
        style={[
          s.floatingNav,
          {
            backgroundColor: navBg,
            borderBottomWidth: navBorder,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.replace("/projects")}
          style={s.backBtn}
          hitSlop={14}
        >
          <View style={s.backCircle}>
            <Ionicons name="arrow-back" size={18} color={T.ink} />
          </View>
        </TouchableOpacity>
        <View
          style={[
            s.catBadge,
            { backgroundColor: accent + "22", borderColor: accent + "55" },
          ]}
        >
          <Text style={[s.catBadgeText, { color: accent }]}>
            {project.category.toUpperCase()}
          </Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        {/* ── Hero gallery ── */}
        {/* FIX: heroWrap height is HERO_H (live), not a static constant */}
        <Animated.View style={[s.heroWrap, { height: heroHeight }]}>
          <FlatList
            key={width}
            ref={heroRef}
            data={visibleHeroImages}
            keyExtractor={heroKeyExtractor}
            renderItem={renderHeroItem}
            getItemLayout={heroItemLayout}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) =>
              setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            windowSize={5}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            removeClippedSubviews={false}
            onEndReached={loadMoreHero}
            onEndReachedThreshold={0.5}
          />

          {allImages.length > 1 && (
            <View style={s.counter} pointerEvents="none">
              <Text style={s.counterText}>
                {activeImg + 1} / {allImages.length}
              </Text>
            </View>
          )}

          {allImages.length > 1 && (
            <View style={s.dotsRow} pointerEvents="none">
              {allImages.slice(0, 12).map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    s.dot,
                    i === activeImg
                      ? [s.dotActive, { backgroundColor: accent }]
                      : s.dotInactive,
                  ]}
                />
              ))}
              {allImages.length > 12 && <View style={s.dotInactive} />}
            </View>
          )}

          {allImages.length > 1 && activeImg > 0 && (
            <TouchableOpacity
              style={[s.arrow, s.arrowLeft]}
              onPress={() => goTo(activeImg - 1)}
            >
              <Ionicons name="chevron-back" size={20} color={T.white} />
            </TouchableOpacity>
          )}
          {allImages.length > 1 && activeImg < allImages.length - 1 && (
            <TouchableOpacity
              style={[s.arrow, s.arrowRight]}
              onPress={() => goTo(activeImg + 1)}
            >
              <Ionicons name="chevron-forward" size={20} color={T.white} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Thumbnail strip ── */}
        {allImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.thumbRow}
          >
            {thumbImages.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => goTo(i)}
                activeOpacity={0.75}
                style={[
                  s.thumb,
                  i === activeImg && {
                    borderColor: accent,
                    borderWidth: 2.5,
                    transform: [{ scale: 1.05 }],
                  },
                ]}
              >
                <LazyImage uri={img} style={StyleSheet.absoluteFill} />
                {i === activeImg && (
                  <View
                    style={[s.thumbTint, { backgroundColor: accent + "30" }]}
                  />
                )}
              </TouchableOpacity>
            ))}
            {thumbOverflow > 0 && (
              <View style={[s.thumb, s.thumbMore]}>
                <Text style={s.thumbMoreText}>+{thumbOverflow}</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* ── Title block ── */}
        <View style={s.titleBlock}>
          <View style={[s.accentBar, { backgroundColor: accent }]} />
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{project.title.toUpperCase()}</Text>
          </View>
        </View>

        {/* ── Meta cards ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.metaScroll}
        >
          {metaData.map(({ label, value }, idx) => (
            <View
              key={label}
              style={[
                s.metaCell,
                idx % 2 === 0
                  ? { backgroundColor: "#F9F7F4" }
                  : { backgroundColor: T.white },
              ]}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>
                {META_EMOJI[label] ?? "📌"}
              </Text>
              <Text style={s.metaKey}>{label}</Text>
              <Text style={s.metaVal}>{value}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Description ── */}
        {project.description && (
          <View style={s.descCard}>
            <View style={s.descHeader}>
              <View style={[s.descDot, { backgroundColor: accent }]} />
              <Text style={[s.descEye, { color: accent }]}>OVERVIEW</Text>
            </View>
            <Text style={s.descText}>{project.description}</Text>
          </View>
        )}

        {/* ── All Photos ── */}
        {allImages.length > 0 && (
          <View style={s.gridSection}>
            <View style={s.gridSectionHeader}>
              <View style={[s.gridDot, { backgroundColor: accent }]} />
              <Text style={[s.gridEye, { color: accent }]}>ALL PHOTOS</Text>
              <View
                style={[s.gridCountBadge, { backgroundColor: accent + "18" }]}
              >
                <Text style={[s.gridCountText, { color: accent }]}>
                  {allImages.length}
                </Text>
              </View>
            </View>

            <FlatList
              data={visibleGridRows}
              keyExtractor={gridKeyExtractor}
              renderItem={renderGridRow}
              getItemLayout={gridItemLayout}
              ListFooterComponent={GridFooter}
              scrollEnabled={false}
              windowSize={2}
              initialNumToRender={1}
              maxToRenderPerBatch={1}
              updateCellsBatchingPeriod={60}
              removeClippedSubviews={true}
            />
          </View>
        )}
      </Animated.ScrollView>

      {lightboxOpen && (
        <Lightbox
          images={allImages}
          startIndex={lightboxStart}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },

  floatingNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomColor: T.line,
  },
  backBtn: { padding: 2 },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  catBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  catBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 1.3 },

  heroWrap: { backgroundColor: T.stone, overflow: "hidden" },
  slideVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,23,20,0.15)",
  },
  expandHint: {
    position: "absolute",
    bottom: 54,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.42)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  expandHintText: { fontSize: 11, color: T.white, fontWeight: "600" },

  counter: {
    position: "absolute",
    bottom: 48,
    right: 14,
    backgroundColor: "rgba(26,23,20,0.58)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: { fontSize: 11, color: T.white, fontWeight: "600" },

  dotsRow: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: { height: 4, borderRadius: 2 },
  dotActive: { width: 20 },
  dotInactive: { width: 6, backgroundColor: "rgba(255,255,255,0.45)" },

  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(26,23,20,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowLeft: { left: 12 },
  arrowRight: { right: 12 },

  thumbRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  thumb: {
    width: 76,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: T.line,
  },
  thumbTint: { ...StyleSheet.absoluteFillObject },
  thumbMore: {
    backgroundColor: T.stone,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbMoreText: { fontSize: 13, fontWeight: "700", color: T.gray },

  titleBlock: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 18,
    alignItems: "flex-start",
  },
  accentBar: { width: 3.5, borderRadius: 2, minHeight: 48, marginTop: 4 },
  title: {
    fontSize: 27,
    fontWeight: "300",
    color: T.ink,
    letterSpacing: -0.8,
    lineHeight: 33,
    marginBottom: 6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 12, color: T.gray },

  metaScroll: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 10,
    marginBottom: 20,
  },
  metaCell: {
    minWidth: 120,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EDE8E0",
    gap: 6,
  },
  metaKey: {
    fontSize: 10,
    color: T.grayLight,
    letterSpacing: 1.2,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metaVal: { fontSize: 15, color: T.ink, fontWeight: "700" },

  descCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: T.stone,
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
  },
  descHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },
  descDot: { width: 6, height: 6, borderRadius: 3 },
  descEye: { fontSize: 9, letterSpacing: 2, fontWeight: "700" },
  descText: { fontSize: 14, color: T.gray, lineHeight: 22 },

  gridSection: { paddingHorizontal: 12, marginBottom: 24 },
  gridSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  gridDot: { width: 6, height: 6, borderRadius: 3 },
  gridEye: { fontSize: 9, letterSpacing: 2, fontWeight: "700" },
  gridCountBadge: {
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 2,
  },
  gridCountText: { fontSize: 10, fontWeight: "700" },
  gridRow: { flexDirection: "row", marginBottom: 6 },
  gridCell: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.line,
  },
  gridCellEmpty: {},
  gridVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,23,20,0.06)",
  },
  gridBadge: {
    position: "absolute",
    bottom: 6,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gridBadgeText: { fontSize: 9, color: T.white, fontWeight: "600" },

  skeletonRows: { gap: 6, width: "100%", paddingVertical: 4 },
  skeletonRow: { flexDirection: "row", gap: 6 },
  skeletonCell: {
    borderRadius: 12,
    backgroundColor: T.skeletonShimmer,
    flex: 1,
  },

  loadMoreBtn: {
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: T.white,
    marginTop: 4,
    marginBottom: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadMoreText: { fontSize: 13, fontWeight: "600", letterSpacing: -0.2 },
  loadMoreBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  loadMoreBadgeText: { fontSize: 11, fontWeight: "700" },
  allShownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  allShownLine: { flex: 1, height: 1 },
  allShownText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.4 },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  notFoundTitle: { fontSize: 17, color: T.gray, fontWeight: "500" },
});

const lb = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  counterWrap: { position: "absolute", left: 18, zIndex: 10 },
  counterText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
  },
  dots: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
  },
  dot: { height: 4, borderRadius: 2 },
  dotActive: { width: 20, backgroundColor: T.white },
  dotInactive: { width: 6, backgroundColor: "rgba(255,255,255,0.35)" },
});
