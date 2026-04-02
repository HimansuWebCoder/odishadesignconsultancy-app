// app/services/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: W } = Dimensions.get("window");

// ─── Theme ────────────────────────────────────────────────
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
  whatsapp: "#248924b8",
};

type Service = {
  title: string;
  number: string;
  tagline: string;
  desc: string;
  accent: string;
  bg: string;
  icon: any;
  image: ImageSourcePropType;
  points: string[];
};

// ─── Data ─────────────────────────────────────────────────
// Replace each `image` value with your actual asset require() path.
// e.g. image: require("../../assets/images/architectural.jpg")
// Using hero.png as a placeholder for all until real images are added.
const SERVICES: Service[] = [
  {
    title: "Architectural Designing",
    number: "01",
    tagline: "Space shaped with purpose.",
    desc: "Full-scope design services from first sketch to construction-ready documentation, calibrated to your brief and site.",
    accent: "#966555",
    bg: "#EDE8DF",
    icon: "business-outline" as const,
    image: {
      uri: "https://odishadesignconsultancy.com/images/service-images/architecture-building.webp",
    },
    points: [
      "Concept Development & Feasibility Studies",
      "Site Analysis & Space Planning",
      "Schematic & Design Development",
      "3D Visualization & Renderings",
      "Working Drawings & Construction Documentation",
      "Building Information Modeling (BIM)",
      "Material & Finishes Selection",
      "Coordination with Structural, MEP & Landscape Teams",
      "Sustainable & Green Building Design",
      "Interior Layout Integration",
      "Adaptive Reuse & Renovation Design",
      "Project Presentation & Client Consultation",
    ],
  },
  {
    title: "Structural Designing",
    number: "02",
    tagline: "Strength beneath the surface.",
    desc: "Engineering solutions that ensure your building performs safely and efficiently across its full lifetime.",
    accent: "#4A7C6A",
    bg: "#E3EBE7",
    icon: "construct-outline" as const,
    image: {
      uri: "https://odishadesignconsultancy.com/images/service-images/reinforcement.webp",
    },
    points: [
      "Structural Concept & Feasibility Studies",
      "Structural Analysis & Design Development",
      "Design of RCC, Steel, and Composite Structures",
      "Foundation Design & Detailing",
      "Seismic & Wind Load Analysis",
      "Retrofitting and Structural Strengthening",
      "Value Engineering & Cost Optimization",
      "Preparation of Structural Drawings & Documentation",
      "Coordination with Architectural and MEP Teams",
      "Construction Supervision & Technical Support",
      "Quality Assurance & Compliance with Building Codes",
      "Structural Audits and Safety Assessments",
    ],
  },
  {
    title: "Landscape Designing",
    number: "03",
    tagline: "Where the building meets the earth.",
    desc: "Landscape design that frames buildings, creates outdoor rooms and connects spaces to their natural context.",
    accent: "#3A7050",
    bg: "#E2EDE6",
    icon: "leaf-outline" as const,
    image: {
      uri: "https://odishadesignconsultancy.com/images/service-images/landscaping-design2.webp",
    },
    points: [
      "Site Analysis & Landscape Concept Development",
      "Master Planning & Layout Design",
      "Hardscape & Softscape Design",
      "Plantation Planning & Species Selection",
      "Water Features & Fountain Design",
      "Outdoor Lighting & Furniture Planning",
      "Landscape Detailing & Working Drawings",
      "Irrigation & Drainage System Design",
      "Rooftop & Terrace Garden Design",
      "Vertical Garden & Green Wall Design",
      "Sustainable & Climate-Responsive Landscaping",
      "Maintenance Planning & Site Supervision",
    ],
  },
  {
    title: "Interior Designing",
    number: "04",
    tagline: "Every detail, deliberately chosen.",
    desc: "Material, light and furniture brought together into spaces that are beautiful to inhabit every day.",
    accent: "#6058A0",
    bg: "#E8E5EF",
    icon: "color-palette-outline" as const,
    image: {
      uri: "https://odishadesignconsultancy.com/images/service-images/interior-design.webp",
    },
    points: [
      "Concept Development & Space Planning",
      "Interior Layout & Furniture Design",
      "Material, Finish & Colour Selection",
      "Lighting Design & Fixture Planning",
      "3D Interior Visualization & Renderings",
      "Custom Furniture & Fixture Detailing",
      "Ceiling, Wall & Flooring Design",
      "Modular Kitchen & Wardrobe Design",
      "Signage & Branding Integration",
      "Sustainable & Smart Interior Solutions",
      "BOQ (Bill of Quantities) & Specification Documentation",
      "On-Site Supervision & Execution Support",
    ],
  },
  {
    title: "3D Visualization & Rendering",
    number: "05",
    tagline: "See it before it's built.",
    desc: "Photorealistic visualisations and immersive walkthroughs that communicate your design with complete clarity.",
    accent: "#7A5C3A",
    bg: "#EDE6DE",
    icon: "cube-outline" as const,
    image: {
      uri: "https://odishadesignconsultancy.com/images/service-images/3dvisualization.webp",
    },
    points: [
      "3D Architectural Modeling (Exterior & Interior)",
      "Photorealistic Rendering & Walkthroughs",
      "Conceptual Visualization & Massing Studies",
      "Virtual Reality (VR) & 360° Interactive Views",
      "Lighting & Material Simulations",
      "Landscape & Environmental Visualization",
      "Interior Design Visualization with Detailing",
      "Product & Furniture Modeling",
      "Animation & Flythrough Videos",
      "Marketing & Presentation Render Packages",
      "High-Resolution Still Renders for Print & Media",
      "Post-Production & Visual Enhancement",
    ],
  },
  {
    title: "Site Supervision & Site Visits",
    number: "06",
    tagline: "On the ground, every step of the way.",
    desc: "Rigorous on-site oversight to ensure construction meets design intent, quality standards and safety requirements.",
    accent: "#506878",
    bg: "#E4ECF0",
    icon: "eye-outline" as const,
    image: {
      uri: "https://odishadesignconsultancy.com/images/service-images/sitevisit.webp",
    },
    points: [
      "Regular Site Inspections & Progress Monitoring",
      "Quality Control & Workmanship Assessment",
      "Verification of Construction Drawings & Specifications",
      "Coordination with Contractors & Consultants",
      "Material Inspection & Approval",
      "Structural, MEP, and Finishing Stage Supervision",
      "Site Measurement & Layout Verification",
      "Health, Safety & Environmental Compliance Checks",
      "On-Site Design Adjustments & Technical Guidance",
      "Reporting of Site Progress & Issue Resolution",
      "Final Inspection & Handover Assistance",
    ],
  },
];

export default function Services() {
  // const [active, setActive] = useState(0);
  const { serviceIndex } = useLocalSearchParams<{ serviceIndex?: string }>();
  const [active, setActive] = useState(
    serviceIndex !== undefined ? Number(serviceIndex) : 0,
  );

  useEffect(() => {
    if (serviceIndex !== undefined) {
      setActive(Number(serviceIndex));
    }
  }, [serviceIndex]);

  const service = SERVICES[active];

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      {/* ── Fixed header ── */}
      <View style={s.navBar}>
        <Text style={s.navTitle}>Services</Text>
        <Text style={s.navCount}>
          {active + 1} / {SERVICES.length}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Hero section ── */}
        <View style={s.hero}>
          {/* Full-bleed image */}
          <Image
            source={service.image}
            style={s.heroImage}
            resizeMode="cover"
          />

          {/* Dual-layer overlay: dark base + accent colour tint at bottom */}
          <View style={s.heroOverlayDark} />
          <View
            style={[s.heroOverlayAccent, { backgroundColor: service.accent }]}
          />

          {/* Subtle grid lines on top */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {[80, 160, 240].map((t) => (
              <View key={`h${t}`} style={s.gridH} />
            ))}
            {[70, 170, 270].map((l) => (
              <View key={`v${l}`} style={[s.gridV, { left: l }]} />
            ))}
          </View>

          {/* Service number badge — top right */}
          <View style={[s.heroBadge, { backgroundColor: service.accent }]}>
            <Text style={s.heroBadgeNum}>{service.number}</Text>
          </View>

          {/* Bottom content */}
          <View style={s.heroContent}>
            {/* Icon + tagline pill */}
            <View style={s.heroPill}>
              <Ionicons name={service.icon} size={12} color={T.white} />
              <Text style={s.heroPillText}>{service.tagline}</Text>
            </View>
            <Text style={s.heroTitle}>{service.title}</Text>
            {/* <View style={[s.heroChip, { borderColor: service.accent + "80" }]}>
              <Text
                style={[
                  s.heroChipText,
                  {
                    color:
                      service.accent === "#9C7E5A" ? T.tan : service.accent,
                  },
                ]}
              >
                {service.points.length} specialisations
              </Text>
            </View> */}
          </View>
        </View>

        {/* ── Tab selector ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsRow}
          decelerationRate="fast"
        >
          {SERVICES.map((svc, i) => {
            const on = active === i;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setActive(i)}
                style={[
                  s.tab,
                  on && { borderColor: svc.accent, backgroundColor: svc.bg },
                ]}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={svc.icon}
                  size={14}
                  color={on ? svc.accent : T.grayLight}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    s.tabText,
                    on && { color: svc.accent, fontWeight: "700" },
                  ]}
                >
                  {svc.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Description card ── */}
        <View style={s.descCard}>
          <View
            style={[s.descAccentBar, { backgroundColor: service.accent }]}
          />
          <View style={s.descCardBody}>
            <View style={[s.descIconWrap, { backgroundColor: service.bg }]}>
              <Ionicons name={service.icon} size={22} color={service.accent} />
            </View>
            <Text style={s.descText}>{service.desc}</Text>
          </View>
        </View>

        {/* ── What's included ── */}
        <View style={s.listCard}>
          <View style={s.listCardHeader}>
            <Text style={[s.listCardEyebrow, { color: service.accent }]}>
              WHAT IS INCLUDED
            </Text>
            <View style={s.listCardCount}>
              <Text style={s.listCardCountText}>
                {service.points.length} services
              </Text>
            </View>
          </View>

          {service.points.map((point, i) => (
            <View
              key={i}
              style={[
                s.listItem,
                i < service.points.length - 1 && s.listItemBorder,
              ]}
            >
              <View
                style={[
                  s.listCheck,
                  { backgroundColor: service.bg, borderColor: service.accent },
                ]}
              >
                <Ionicons name="checkmark" size={11} color={service.accent} />
              </View>
              <Text style={s.listText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* ── Other services ── */}
        <View style={s.otherSection}>
          <Text style={s.otherEyebrow}>OTHER SERVICES</Text>
          <View style={s.otherGrid}>
            {SERVICES.filter((_, i) => i !== active).map((svc, i) => (
              <TouchableHighlight
                key={i}
                onPress={() => setActive(SERVICES.indexOf(svc))}
                underlayColor={svc.bg}
                style={[s.otherCard, { borderColor: T.line }]}
              >
                <View style={s.otherCardInner}>
                  <View style={[s.otherIconWrap, { backgroundColor: svc.bg }]}>
                    <Ionicons name={svc.icon} size={18} color={svc.accent} />
                  </View>
                  <Text style={s.otherCardTitle}>{svc.title}</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={T.grayLight}
                  />
                </View>
              </TouchableHighlight>
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={s.cta}>
          <Text style={s.ctaHead}>
            Interested in{"\n"}
            <Text style={[s.ctaHeadBold, { color: service.accent }]}>
              {service.title}?
            </Text>
          </Text>
          <Text style={s.ctaSub}>
            Book a free consultation and we will walk you through the process.
          </Text>
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: service.accent }]}
            activeOpacity={0.85}
          >
            <Text style={s.ctaBtnText}>Book Consultation</Text>
            <Text style={s.ctaBtnArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 48 },

  navBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
    backgroundColor: T.white,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: T.ink,
    letterSpacing: -0.3,
  },
  navCount: { fontSize: 12, color: T.grayLight, fontWeight: "500" },

  hero: { height: 300, overflow: "hidden", justifyContent: "flex-end" },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroOverlayDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(107, 79, 52, 0.32)",
  },
  heroOverlayAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    opacity: 0.22,
  },
  gridH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  gridV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  heroBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  heroBadgeNum: {
    fontSize: 13,
    fontWeight: "800",
    color: T.white,
    letterSpacing: 1,
  },
  heroContent: {
    padding: 22,
    paddingBottom: 26,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroPillText: {
    fontSize: 11,
    color: T.white,
    fontWeight: "500",
    fontStyle: "italic",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "300",
    color: T.white,
    letterSpacing: -0.8,
    lineHeight: 37,
    marginBottom: 14,
  },
  heroChip: {
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(125, 118, 118, 0.25)",
  },
  heroChipText: { fontSize: 11, fontWeight: "700" },

  tabsRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.white,
  },
  tabText: { fontSize: 12, color: T.gray, fontWeight: "500" },

  descCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: T.white,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    flexDirection: "row",
    overflow: "hidden",
  },
  descAccentBar: { width: 3 },
  descCardBody: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  descIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  descText: { flex: 1, fontSize: 13, color: T.gray, lineHeight: 21 },

  listCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: T.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    overflow: "hidden",
  },
  listCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: T.stone,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  listCardEyebrow: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  listCardCount: {
    backgroundColor: T.sand,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  listCardCountText: { fontSize: 10, color: T.tanDark, fontWeight: "600" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    gap: 13,
  },
  listItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  listCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: T.inkSoft,
    lineHeight: 19,
    fontWeight: "400",
  },

  otherSection: { paddingHorizontal: 16, marginBottom: 14 },
  otherEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 12,
  },
  otherGrid: { gap: 8 },
  otherCard: {
    backgroundColor: T.white,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  otherCardInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  otherIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  otherCardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: T.inkSoft,
  },

  cta: {
    marginHorizontal: 16,
    backgroundColor: T.stone,
    borderRadius: 16,
    padding: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
  },
  ctaHead: {
    fontSize: 22,
    fontWeight: "300",
    color: T.ink,
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  ctaHeadBold: { fontStyle: "italic", fontWeight: "400" },
  ctaSub: { fontSize: 13, color: T.gray, lineHeight: 19, marginBottom: 20 },
  ctaBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaBtnText: { fontSize: 14, fontWeight: "700", color: T.white },
  ctaBtnArrow: { fontSize: 16, color: "rgba(255,255,255,0.6)" },
});
