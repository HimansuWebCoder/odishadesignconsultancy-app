// app/index.tsx  (or app/home.tsx)

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS } from "../constants/fonts";
import { projects2 } from "../data/projects";

const { width: W } = Dimensions.get("window");

const CARD_WIDTH = W * 0.68;
const CARD_SNAP = CARD_WIDTH + 12;

const T = {
  bg: "#F7F5F2",
  white: "#FFFFFF",
  stone: "#a8776742",
  sand: "#f4f2f1",
  tan: "#a4715f",
  tanDark: "#825546",
  ink: "#825546",
  inkSoft: "#3D3830",
  gray: "#352e2b",
  grayLight: "#bbbbb7",
  line: "#E0DAD2",
  whatsapp: "#248924b8",
  heroHeadingText: "#f8d94e",
  consultText: "#ffaa8e",
};

const SERVICES = [
  {
    id: "1",
    title: "Architectural\nDesign",
    icon: "business-outline" as const,
    accent: "#9C7E5A",
    bg: "#EDE8DF",
  },
  {
    id: "2",
    title: "Structural\nDesigning",
    icon: "construct-outline" as const,
    accent: "#4A7C6A",
    bg: "#E3EBE7",
  },
  {
    id: "3",
    title: "Landscaping\nDesigning",
    icon: "leaf-outline" as const,
    accent: "#3A7050",
    bg: "#E2EDE6",
  },
  {
    id: "4",
    title: "Interior\nDesigning",
    icon: "color-palette-outline" as const,
    accent: "#6058A0",
    bg: "#E8E5EF",
  },
  {
    id: "5",
    title: "3D Visualization & Rendering",
    icon: "cube-outline" as const,
    accent: "#364a71",
    bg: "#d3ebe3",
  },
  {
    id: "6",
    title: "Site Supervision & Site Visits",
    icon: "eye-outline" as const,
    accent: "#3A7050",
    bg: "#E2EDE6",
  },
];

const TEAM = [
  {
    name: "Ar. Amrita Swain",
    role: "Architect",
    image: "https://odishadesignconsultancy.com/images/team/amrita_swain.webp",
  },
  {
    name: "Ar. Gunjan Rout",
    role: "Architect",
    image: "https://odishadesignconsultancy.com/images/team/Gunjan.webp",
  },
  {
    name: "Ar. Shatabdi Smaranika",
    role: "Architect",
    image: "https://odishadesignconsultancy.com/images/team/shatabdi.webp",
  },
  {
    name: "Er. Nanak Patra",
    role: "Sr. Structural Engineer",
    image: "https://odishadesignconsultancy.com/images/team/Manas_Sir.webp",
  },
  {
    name: "Sekhar Prusty",
    role: "Lead Interior Designer",
    image: "https://odishadesignconsultancy.com/images/team/teammember1.webp",
  },
  {
    name: "Tabrej Khan",
    role: "Project Execution Manager",
    image: "https://odishadesignconsultancy.com/images/team/Tutu.webp",
  },
  {
    name: "Prabhashi Moharana",
    role: "Sr. 3d Architectural Visualizer",
    image: "https://odishadesignconsultancy.com/images/team/Photo.webp",
  },
  {
    name: "Miranmayee Sundaray",
    role: "3d Architectural Visualizer",
    image: "https://odishadesignconsultancy.com/images/team/miranmayee.webp",
  },
  {
    name: "Binayak Biswal",
    role: "3d Architectural Visualizer",
    image: "https://odishadesignconsultancy.com/images/team/binayak.webp",
  },
  {
    name: "Er. Manjulata Badaoli",
    role: "Civil Engineer",
    image: "https://odishadesignconsultancy.com/images/team/manju.webp",
  },
  {
    name: "Er. Nibedita Jena",
    role: "Civil Engineer",
    image: "https://odishadesignconsultancy.com/images/team/nibedita.webp",
  },
  {
    name: "Er. Dhananjaya Sahoo",
    role: "Civil Engineer",
    image: "https://odishadesignconsultancy.com/images/team/dhananjaya.webp",
  },
];

const PARTNERS = [
  {
    name: "Modern Interio",
    logo: "https://odishadesignconsultancy.com/images/association/modern_interio.webp",
  },
  {
    name: "BB Construction",
    logo: "https://odishadesignconsultancy.com/images/association/bb_construction.webp",
  },
  {
    name: "Austin Plywood",
    logo: "https://odishadesignconsultancy.com/images/association/austin_plywood.webp",
  },
  {
    name: "Infinity Solution",
    logo: "https://odishadesignconsultancy.com/images/association/infinity_solution.webp",
  },
  {
    name: "Subham Enterprises",
    logo: "https://odishadesignconsultancy.com/images/association/subham_enterprises.webp",
  },
  {
    name: "Quantum Cool Technologies",
    logo: "https://odishadesignconsultancy.com/images/association/quantum_cool_technologies.webp",
  },
];

// ── Lazy-loading project card ─────────────────────────────────────────────────
function ProjectCard({
  item,
  onPress,
}: {
  item: (typeof projects2)[0];
  onPress: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const handleLoad = useCallback(() => {
    setLoaded(true);
    Animated.timing(fade, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.projectCard,
        { width: CARD_WIDTH },
        pressed && { opacity: 0.9, transform: [{ scale: 0.975 }] },
      ]}
    >
      {/* Warm placeholder while image loads */}
      {!loaded && (
        <View style={[StyleSheet.absoluteFill, s.projectPlaceholder]} />
      )}

      <Animated.Image
        source={
          typeof item.image === "string" ? { uri: item.image } : item.image
        }
        style={[s.projectImage, { opacity: fade }]}
        resizeMode="cover"
        onLoad={handleLoad}
      />
      <View style={s.projectOverlay} />

      <View style={s.projectBadge}>
        <Text style={s.projectBadgeText}>
          {item.category?.toUpperCase() ?? "PROJECT"}
        </Text>
      </View>

      <View style={s.projectFooter}>
        <View style={{ flex: 1 }}>
          <Text style={s.projectTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.location && (
            <Text style={s.projectLoc} numberOfLines={1}>
              {item.location}
            </Text>
          )}
        </View>
        <View style={s.projectArrow}>
          <Ionicons name="arrow-forward" size={13} color={T.white} />
        </View>
      </View>
    </Pressable>
  );
}

// ─── Home Screen ──────────────────────────────────────────
export default function Home() {
  const router = useRouter();

  // Only slice 6 for the featured strip — no need to load all projects
  // const featured = projects2.slice(0, 6);
  const featured = [
    projects2[10],
    projects2[41],
    projects2[55],
    projects2[97],
    projects2[90],
    projects2[103],
  ];

  const renderProjectCard = useCallback(
    ({ item }: { item: (typeof projects2)[0] }) => (
      <ProjectCard
        item={item}
        onPress={() => router.push(`/projects/${item.id}`)}
        // onPress={() => router.push(`/services?serviceIndex=${svc.id - 1}`)}
      />
    ),
    [router],
  );

  const projectKeyExtractor = useCallback(
    (item: (typeof projects2)[0]) => item.id,
    [],
  );

  // Fixed card width → FlatList can skip layout measurement
  const getProjectItemLayout = useCallback(
    (_: any, index: number) => ({
      length: CARD_SNAP,
      offset: CARD_SNAP * index + 20, // +20 for paddingLeft
      index,
    }),
    [],
  );

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      {/* ── Top bar ── */}
      <View style={s.topBar}>
        <Image
          source={{
            uri: "https://odishadesignconsultancy.com/assets/Logo-DgcQadx4.webp",
          }}
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
        <View>
          <Text style={s.topBarStudio}>Odisha Design Consultancy</Text>
          <Text style={s.topBarSub}>Bhubaneswar · Est. 2007</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Hero ── */}
        <View style={s.hero}>
          <Image
            source={{
              uri: "https://odishadesignconsultancy.com/images/project_images/residential/tukuna_sir/image5.webp",
            }}
            style={s.heroImage}
            resizeMode="cover"
          />
          <View style={s.heroGradient} />
          <View style={s.heroContent}>
            <Text style={s.heroHeading}>
              {"Spaces\nthat "}
              <Text style={s.heroHeadingItalic}>inspire.</Text>
            </Text>
            <Text style={s.heroSub}>
              Designing with intention, material and light.
            </Text>
            <View style={s.heroBtns}>
              <TouchableOpacity
                style={s.heroBtnPrimary}
                onPress={() => router.push("/book")}
                activeOpacity={0.85}
              >
                <Text style={s.heroBtnPrimaryText}>Book Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.heroBtnGhost}
                onPress={() => router.push("/projects")}
                activeOpacity={0.75}
              >
                <Text style={s.heroBtnGhostText}>Our Work →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={s.statsRow}>
          {[
            ["1400+", "Projects"],
            ["18+\u00A0yrs", "Experience"],
            ["6", "Awards"],
          ].map(([n, l], i) => (
            <View key={l} style={[s.statCell, i < 2 && s.statCellBorder]}>
              <Text style={s.statN}>{n}</Text>
              <Text style={s.statL}>{l}</Text>
            </View>
          ))}
        </View>

        {/* ── Featured Projects ── */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionEye}>PORTFOLIO</Text>
            <Text style={s.sectionTitle}>Featured Projects</Text>
          </View>
          <TouchableOpacity hitSlop={10}>
            <Text style={s.sectionMore}>See all →</Text>
          </TouchableOpacity>
        </View>

        {/*
          FlatList in horizontal mode:
          - only renders cards currently visible on screen
          - unmounts off-screen cards from native layer (removeClippedSubviews)
          - getItemLayout skips expensive layout measurement
        */}
        <FlatList
          data={featured}
          keyExtractor={projectKeyExtractor}
          renderItem={renderProjectCard}
          getItemLayout={getProjectItemLayout}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_SNAP}
          snapToAlignment="start"
          contentContainerStyle={s.hScroll}
          // Virtualization
          windowSize={3} // keep only 3 card-widths in memory
          initialNumToRender={2} // paint 2 cards on first frame
          maxToRenderPerBatch={2} // add 2 per JS batch as user scrolls
          removeClippedSubviews={true} // drop off-screen cards from native layer
        />

        {/* Scroll dots */}
        <View style={s.dots}>
          {featured.slice(0, 4).map((_, i) => (
            <View key={i} style={[s.dot, i === 0 && s.dotActive]} />
          ))}
        </View>

        <TouchableOpacity
          style={s.viewMoreBtn}
          onPress={() => router.push("/projects")}
          activeOpacity={0.8}
        >
          <Text style={s.viewMoreText}>View All Projects</Text>
          <Ionicons name="arrow-forward" size={14} color={T.tanDark} />
        </TouchableOpacity>

        {/* ── Services ── */}
        <View style={[s.sectionHeader, { marginTop: 8 }]}>
          <View>
            <Text style={s.sectionEye}>WHAT WE DO</Text>
            <Text style={s.sectionTitle}>Services</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/services")}
            hitSlop={10}
          >
            <Text style={s.sectionMore}>See all →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.hScroll}
          decelerationRate="fast"
          snapToInterval={148 + 10}
        >
          {SERVICES.map((svc) => (
            <Pressable
              key={svc.id}
              // onPress={() => router.push("/services")}
              onPress={() =>
                router.push(`/services?serviceIndex=${Number(svc.id) - 1}`)
              }
              style={({ pressed }) => [
                s.serviceCard,
                { backgroundColor: svc.bg },
                pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
              ]}
            >
              {[30, 60, 90].map((t) => (
                <View
                  key={t}
                  style={[s.svcGrid, { top: t, backgroundColor: svc.accent }]}
                />
              ))}
              <View
                style={[s.svcIconWrap, { backgroundColor: svc.accent + "20" }]}
              >
                <Ionicons name={svc.icon} size={22} color={svc.accent} />
              </View>
              <Text style={[s.svcTitle, { color: svc.accent }]}>
                {svc.title}
              </Text>
              <View style={[s.svcCta, { borderTopColor: svc.accent + "40" }]}>
                <Text style={[s.svcCtaText, { color: svc.accent }]}>
                  Explore →
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={s.viewMoreBtn}
          onPress={() => router.push("/services")}
          activeOpacity={0.8}
        >
          <Text style={s.viewMoreText}>Explore All Services</Text>
          <Ionicons name="arrow-forward" size={14} color={T.tanDark} />
        </TouchableOpacity>

        {/* ── Founder ── */}
        <View style={s.founderCard}>
          <View style={s.founderLeft}>
            <View style={s.founderAvatar}>
              <Image
                source={{
                  uri: "https://odishadesignconsultancy.com/images/team/manoj_sir.webp",
                }}
                style={s.founderImage}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.founderName}>Manoj Kumar Sahoo</Text>
              <Text style={s.founderRole}>Founder & CEO</Text>
            </View>
          </View>
          <View style={s.founderDivider} />
          <Text style={s.founderQuote}>
            {"\u201C"}We design not for the moment of completion, but for the
            decades of life that follow.{"\u201D"}
          </Text>
        </View>

        {/* ── Team ── */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionEye}>THE TEAM</Text>
            <Text style={s.sectionTitle}>Expert Minds</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.hScroll}
        >
          {TEAM.map((m) => (
            <View key={m.name} style={s.teamCard}>
              <View style={s.teamAvatar}>
                <Image
                  source={{ uri: m.image }}
                  style={s.teamImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={s.teamName}>{m.name}</Text>
              <Text style={s.teamRole}>{m.role}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Associated With ── */}
        <View style={s.partnerSection}>
          <Text style={s.partnerEye}>ASSOCIATED WITH</Text>
          <View style={s.partnerRow}>
            {PARTNERS.map((p) => (
              <View key={p.name} style={s.partnerCard}>
                <Image
                  source={{ uri: p.logo }}
                  style={s.partnerLogo}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={s.cta}>
          <View style={s.ctaAccent} />
          <Text style={s.ctaEye}>READY TO BUILD?</Text>
          <Text style={s.ctaHeading}>
            {"Book a free\n"}
            <Text style={s.ctaHeadingItalic}>consultation.</Text>
          </Text>
          <Text style={s.ctaSub}>
            Every great building begins with a conversation. Reach out — we
            would love to hear about your project.
          </Text>
          <TouchableOpacity
            style={s.ctaBtn}
            onPress={() => router.push("/book")}
            activeOpacity={0.85}
          >
            <Text style={s.ctaBtnText}>Book Consultation Today</Text>
            <Ionicons name="arrow-forward" size={16} color={T.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.ctaSecondary}
            onPress={() => router.push("/contact")}
            activeOpacity={0.75}
          >
            <Ionicons name="mail-outline" size={15} color={T.tanDark} />
            <Text style={s.ctaSecondaryText}>Or contact us directly</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 48 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 28,
    paddingVertical: 8,
    backgroundColor: T.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  topBarStudio: {
    fontSize: 12,
    color: T.ink,
    letterSpacing: 2.5,
    fontFamily: FONTS.playfair.bold,
  },
  topBarSub: {
    fontSize: 10,
    color: T.gray,
    marginTop: 1,
    fontFamily: FONTS.poppins.light,
  },

  hero: { height: 460, overflow: "hidden", position: "relative" },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(80, 76, 76, 0.31)",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 26,
    paddingBottom: 32,
  },
  heroHeading: {
    fontSize: 46,
    color: T.white,
    letterSpacing: -1.2,
    lineHeight: 50,
    marginBottom: 10,
    fontFamily: FONTS.playfair.regular,
  },
  heroHeadingItalic: {
    fontStyle: "normal",
    color: T.heroHeadingText,
    fontFamily: FONTS.playfair.regular,
  },
  heroSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.92)",
    lineHeight: 19,
    marginBottom: 24,
    fontFamily: FONTS.poppins.regular,
  },
  heroBtns: { flexDirection: "row", gap: 10 },
  heroBtnPrimary: {
    backgroundColor: T.tanDark,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  heroBtnPrimaryText: {
    color: T.white,
    fontSize: 13,
    fontFamily: FONTS.poppins.bold,
  },
  heroBtnGhost: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  heroBtnGhostText: {
    color: T.white,
    fontSize: 13,
    fontFamily: FONTS.poppins.bold,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: T.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  statCell: { flex: 1, paddingVertical: 18, alignItems: "center" },
  statCellBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: T.line,
  },
  statN: {
    fontSize: 24,
    color: T.tanDark,
    fontWeight: "300",
    letterSpacing: -0.5,
    fontFamily: FONTS.poppins.regular,
  },
  statL: { fontSize: 10, color: T.gray, marginTop: 2, letterSpacing: 0.3 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 14,
  },
  sectionEye: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    marginBottom: 4,
    fontFamily: FONTS.poppins.medium,
  },
  sectionTitle: {
    fontSize: 20,
    color: T.ink,
    letterSpacing: -0.4,
    fontFamily: FONTS.inter.semiBold,
  },
  sectionMore: {
    fontSize: 13,
    color: T.tanDark,
    fontWeight: "600",
    paddingBottom: 2,
    fontFamily: FONTS.poppins.medium,
  },

  hScroll: { paddingLeft: 20, paddingRight: 8, gap: 12 },

  // Project cards
  projectCard: {
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: T.stone,
  },
  projectPlaceholder: {
    backgroundColor: "#E8E2DC",
    borderRadius: 16,
  },
  projectImage: { width: "100%", height: "100%", position: "absolute" },
  projectOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,23,20,0.3)",
  },
  projectBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(156,126,90,0.85)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  projectBadgeText: {
    fontSize: 8,
    color: T.white,
    letterSpacing: 1.2,
    fontFamily: FONTS.poppins.semiBold,
  },
  projectFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "rgba(26,23,20,0.6)",
    gap: 10,
  },
  projectTitle: {
    fontSize: 15,
    color: T.white,
    letterSpacing: -0.2,
    marginBottom: 2,
    fontFamily: FONTS.poppins.semiBold,
  },
  projectLoc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontFamily: FONTS.poppins.regular,
  },
  projectArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.tanDark,
    alignItems: "center",
    justifyContent: "center",
  },

  dots: { flexDirection: "row", gap: 5, paddingHorizontal: 20, marginTop: 12 },
  dot: { width: 6, height: 2, backgroundColor: T.line, borderRadius: 1 },
  dotActive: { width: 18, backgroundColor: T.tan },

  viewMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: T.white,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
  },
  viewMoreText: {
    fontSize: 13,
    color: T.tanDark,
    fontFamily: FONTS.poppins.medium,
  },

  serviceCard: {
    width: 148,
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
  },
  svcGrid: {
    position: "absolute",
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    opacity: 0.2,
  },
  svcIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  svcTitle: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.2,
    fontFamily: FONTS.poppins.semiBold,
  },
  svcCta: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  svcCtaText: { fontSize: 11, fontFamily: FONTS.poppins.regular },

  founderCard: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: T.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    padding: 20,
  },
  founderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  founderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.line,
  },
  founderImage: { width: "100%", aspectRatio: 0.6 },
  founderName: { fontSize: 15, fontFamily: FONTS.poppins.medium, color: T.ink },
  founderRole: {
    fontSize: 11,
    color: T.gray,
    marginTop: 2,
    fontFamily: FONTS.poppins.light,
  },
  founderDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.line,
    marginBottom: 16,
  },
  founderQuote: {
    fontSize: 14,
    color: T.inkSoft,
    lineHeight: 22,
    borderLeftWidth: 3,
    borderLeftColor: T.tan,
    paddingLeft: 14,
    fontFamily: FONTS.poppins.extraLight,
  },

  teamCard: {
    width: 140,
    backgroundColor: T.white,
    borderRadius: 14,
    padding: 8,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
  },
  teamAvatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  teamImage: { width: "100%", aspectRatio: 0.7 },
  teamName: {
    fontSize: 10,
    color: T.ink,
    textAlign: "center",
    lineHeight: 14,
    marginTop: 10,
    fontFamily: FONTS.poppins.medium,
  },
  teamRole: {
    fontSize: 9,
    color: T.gray,
    textAlign: "center",
    fontFamily: FONTS.poppins.regular,
    marginTop: 2,
  },

  partnerSection: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  partnerEye: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
  partnerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  partnerCard: {
    width: 100,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  partnerLogo: { width: "80%", height: "80%" },

  cta: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: T.tanDark,
    borderRadius: 20,
    padding: 26,
  },
  ctaAccent: {
    width: 36,
    height: 2,
    backgroundColor: T.tan,
    borderRadius: 1,
    marginBottom: 18,
  },
  ctaEye: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "700",
    marginBottom: 8,
  },
  ctaHeading: {
    fontSize: 30,
    color: T.white,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 12,
    fontFamily: FONTS.poppins.medium,
  },
  ctaHeadingItalic: {
    fontStyle: "italic",
    fontWeight: "400",
    color: T.consultText,
  },
  ctaSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
    marginBottom: 24,
  },
  ctaBtn: {
    backgroundColor: T.white,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ctaBtnText: {
    fontSize: 14,
    fontFamily: FONTS.poppins.semiBold,
    textAlign: "center",
    color: T.tanDark,
  },
  ctaSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  ctaSecondaryText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
});
