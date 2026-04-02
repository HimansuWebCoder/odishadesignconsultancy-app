// app/projects/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { projects2 } from "../../data/projects";

const { width: W } = Dimensions.get("window");

const PAGE_SIZE = 6;
const CARD_HEIGHT = 220;
const CARD_GAP = 12;

const T = {
  bg: "#F7F5F2",
  white: "#FFFFFF",
  stone: "#a8776742",
  sand: "#f4f2f1",
  tan: "#a4715f",
  tanDark: "#825546",
  ink: "#1A1714",
  inkSoft: "#3D3830",
  gray: "#352e2b",
  grayLight: "#bbbbb7",
  line: "#E0DAD2",
  skeleton: "#E8E2DC",
  skeletonShimmer: "#F0EBE6",
};

type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  gallery?: string[];
  location?: string;
  year?: string;
  area?: string;
  status?: string;
  description?: string;
};

const CAT_ACCENT: Record<string, string> = {
  Residential: "#a4715f",
  Commercial: "#4A7C6A",
  Interior: "#6058A0",
  Hospitality: "#A06050",
  Landscaping: "#3A7050",
  "Amusement Parks": "#B07830",
  "Educational Institution": "#507890",
  Walkthrough: "#506878",
};

const CATEGORIES = [
  "Residential",
  "Commercial",
  "Interior",
  "Hospitality",
  "Landscaping",
  "Amusement Parks",
  "Educational Institution",
  "Walkthrough",
];

// ── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View style={[s.card, s.skeletonCard, { opacity }]}>
      <View style={s.skeletonBadge} />
      <View style={s.skeletonLocation} />
      <View style={s.skeletonFooter}>
        <View style={s.skeletonFooterInner}>
          <View style={s.skeletonTitle} />
          {/* <View style={s.skeletonYear} /> */}
        </View>
        <View style={s.skeletonArrow} />
      </View>
    </Animated.View>
  );
}

// ── Project Card ───────────────────────────────────────────────────────────────
function ProjectCard({
  item,
  accent,
  onPress,
}: {
  item: Project;
  accent: string;
  onPress: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLoad = useCallback(() => {
    setImgLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.card,
        pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
      ]}
    >
      {!imgLoaded && (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: T.skeleton }]}
        />
      )}
      <Animated.Image
        source={{ uri: item.image }}
        style={[s.cardImage, { opacity: fadeAnim }]}
        resizeMode="cover"
        onLoad={handleLoad}
      />
      <View style={s.cardOverlay} />
      <View style={[s.cardBadge, { backgroundColor: accent + "DD" }]}>
        <Text style={s.cardBadgeText}>{item.category.toUpperCase()}</Text>
      </View>
      {/* {item.location && (
        <View style={s.cardLocation}>
          <Ionicons name="location-outline" size={10} color={T.white} />
          <Text style={s.cardLocationText}>{item.location}</Text>
        </View>
      )} */}
      <View style={s.cardFooter}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle} numberOfLines={1}>
            {item.title.toUpperCase()}
          </Text>
          {/* {item.year && <Text style={s.cardYear}>{item.year}</Text>} */}
        </View>
        <View style={[s.cardArrow, { backgroundColor: accent }]}>
          <Ionicons name="arrow-forward" size={12} color={T.white} />
        </View>
      </View>
    </Pressable>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function Projects() {
  const [active, setActive] = useState("Residential");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const accent = CAT_ACCENT[active] ?? T.tanDark;

  const allFiltered = useMemo(
    () => projects2.filter((p) => p.category === active),
    [active],
  );

  // Only the current page slice — FlatList virtualizes these
  const displayed = useMemo(
    () => allFiltered.slice(0, page * PAGE_SIZE),
    [allFiltered, page],
  );

  const hasMore = displayed.length < allFiltered.length;
  const remaining = allFiltered.length - displayed.length;

  const handleCategoryChange = useCallback((cat: string) => {
    setActive(cat);
    setPage(1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 400);
  }, [loadingMore, hasMore]);

  // ── List Header (hero + tabs) ──
  const ListHeader = useMemo(
    () => (
      <>
        <View style={[s.hero, { backgroundColor: CAT_ACCENT[active] + "18" }]}>
          {[30, 60, 90].map((t) => (
            <View
              key={t}
              style={[s.heroGridH, { top: t, backgroundColor: accent }]}
            />
          ))}
          {[50, 120, 200, 280].map((l) => (
            <View
              key={l}
              style={[s.heroGridV, { left: l, backgroundColor: accent }]}
            />
          ))}
          <View style={s.heroContent}>
            <Text style={s.heroEye}>OUR WORK</Text>
            <Text style={s.heroHeading}>
              {active}
              {"\n"}
              <Text style={[s.heroSub, { color: accent }]}>projects</Text>
            </Text>
          </View>
          <View style={[s.heroAccentBar, { backgroundColor: accent }]} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsRow}
          decelerationRate="fast"
        >
          {CATEGORIES.map((cat) => {
            const on = active === cat;
            const ca = CAT_ACCENT[cat];
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategoryChange(cat)}
                style={[
                  s.tab,
                  on && { borderColor: ca, backgroundColor: ca + "15" },
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[s.tabText, on && { color: ca, fontWeight: "700" }]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </>
    ),
    [active, accent, handleCategoryChange],
  );

  // ── List Footer (skeletons + load more) ──
  const ListFooter = useCallback(
    () => (
      <View style={s.footerWrap}>
        {loadingMore &&
          Array.from({ length: Math.min(remaining, PAGE_SIZE) }).map((_, i) => (
            <SkeletonCard key={`skel-${i}`} />
          ))}

        {hasMore && !loadingMore ? (
          <TouchableOpacity
            onPress={handleLoadMore}
            activeOpacity={0.75}
            style={[s.loadMoreBtn, { borderColor: accent }]}
          >
            <Text style={[s.loadMoreText, { color: accent }]}>Load more</Text>
            <View style={[s.loadMoreBadge, { backgroundColor: accent + "20" }]}>
              <Text style={[s.loadMoreBadgeText, { color: accent }]}>
                {remaining}
              </Text>
            </View>
          </TouchableOpacity>
        ) : !hasMore && !loadingMore ? (
          <View style={s.allLoadedRow}>
            <View
              style={[s.allLoadedLine, { backgroundColor: accent + "40" }]}
            />
            <Text style={[s.allLoadedText, { color: accent }]}>
              All {allFiltered.length} projects shown
            </Text>
            <View
              style={[s.allLoadedLine, { backgroundColor: accent + "40" }]}
            />
          </View>
        ) : null}
      </View>
    ),
    [
      loadingMore,
      hasMore,
      remaining,
      accent,
      handleLoadMore,
      allFiltered.length,
    ],
  );

  const ListEmpty = useCallback(
    () => (
      <View style={s.empty}>
        <Ionicons name="albums-outline" size={40} color={T.grayLight} />
        <Text style={s.emptyText}>No projects in this category yet.</Text>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Project }) => (
      <ProjectCard
        item={item}
        accent={accent}
        onPress={() => router.push(`/projects/${item.id}`)}
      />
    ),
    [accent, router],
  );

  const keyExtractor = useCallback((item: Project) => item.id, []);

  // Tells FlatList exact dimensions upfront → skips layout measurement entirely
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: CARD_HEIGHT + CARD_GAP,
      offset: (CARD_HEIGHT + CARD_GAP) * index,
      index,
    }),
    [],
  );

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <View style={s.navBar}>
        <Text style={s.navTitle}>Projects</Text>
        <View style={s.navCount}>
          <Text style={s.navCountText}>{allFiltered.length}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={displayed}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        // ── Virtualization: only renders what's on screen ──
        windowSize={5} // 5 screen-heights in memory max
        maxToRenderPerBatch={3} // 3 items per JS render batch
        initialNumToRender={3} // paint only 3 cards on first frame
        updateCellsBatchingPeriod={60}
        removeClippedSubviews={true} // drop off-screen cards from native layer
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },

  navBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: T.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: T.ink,
    letterSpacing: -0.3,
  },
  navCount: {
    backgroundColor: T.sand,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  navCountText: { fontSize: 12, fontWeight: "700", color: T.tanDark },

  hero: {
    height: 130,
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
  },
  heroGridH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    opacity: 0.15,
  },
  heroGridV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    opacity: 0.15,
  },
  heroContent: { padding: 16, paddingBottom: 20 },
  heroEye: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroHeading: {
    fontSize: 26,
    fontWeight: "300",
    color: T.ink,
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  heroSub: { fontStyle: "italic", fontWeight: "400" },
  heroAccentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.4,
  },

  tabsRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.white,
  },
  tabText: { fontSize: 12, color: T.gray, fontWeight: "500" },

  listContent: { paddingBottom: 48, gap: CARD_GAP },

  card: {
    marginHorizontal: 16,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: T.stone,
  },
  cardImage: { width: "100%", height: "100%", position: "absolute" },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 23, 20, 0.15)",
  },
  cardBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: T.white,
    letterSpacing: 1.2,
  },
  cardFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "rgba(26,23,20,0.55)",
  },
  cardLocation: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(26,23,20,0.45)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  cardLocationText: { fontSize: 9, color: T.white, fontWeight: "500" },
  cardYear: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: "400" },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: T.white,
    letterSpacing: -0.2,
    marginRight: 8,
  },
  cardArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  skeletonCard: {
    backgroundColor: T.skeleton,
    justifyContent: "flex-end",
  },
  skeletonBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 72,
    height: 18,
    borderRadius: 6,
    backgroundColor: T.skeletonShimmer,
  },
  skeletonLocation: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 60,
    height: 18,
    borderRadius: 6,
    backgroundColor: T.skeletonShimmer,
  },
  skeletonFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "rgba(200,190,182,0.55)",
  },
  skeletonFooterInner: { flex: 1, gap: 6 },
  skeletonTitle: {
    width: "60%",
    height: 14,
    borderRadius: 6,
    backgroundColor: T.skeletonShimmer,
  },
  skeletonYear: {
    width: "30%",
    height: 10,
    borderRadius: 4,
    backgroundColor: T.skeletonShimmer,
  },
  skeletonArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.skeletonShimmer,
  },

  footerWrap: { gap: 12, paddingTop: 4, paddingBottom: 8 },
  loadMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: T.white,
  },
  loadMoreText: { fontSize: 14, fontWeight: "600", letterSpacing: -0.2 },
  loadMoreBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  loadMoreBadgeText: { fontSize: 11, fontWeight: "700" },
  allLoadedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  allLoadedLine: { flex: 1, height: 1 },
  allLoadedText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },

  empty: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyText: { fontSize: 14, color: T.grayLight, textAlign: "center" },
});
