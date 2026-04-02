// app/book.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

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

const SERVICES = [
  "Architectural Design",
  "Structural Designing",
  "Interior Design",
  "Landscaping",
  "3D Visualization & Rendering",
  "Site Supervision & Site Visits",
];

const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Architectural Design": "business-outline",
  "Structural Designing": "construct-outline",
  "Interior Design": "color-palette-outline",
  Landscaping: "leaf-outline",
  "3D Visualization & Rendering": "cube-outline",
  "Site Supervision & Site Visits": "eye-outline",
};

export default function Book() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(SERVICES[0]);

  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleWhatsApp = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(
        "Required Fields",
        "Please enter your name and phone number to continue.",
      );
      return;
    }

    const message =
      `Hello, I want to book a consultation.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email || "—"}\n` +
      `Service: ${service}`;

    const url = `https://wa.me/919438240303?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const isReady = name.trim().length > 0 && phone.trim().length > 0;

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Page header ── */}
          <View style={s.pageHeader}>
            <Text style={s.eyebrow}>GET STARTED</Text>
            <Text style={s.pageTitle}>
              Book a{"\n"}
              <Text style={s.pageTitleItalic}>consultation.</Text>
            </Text>
            <Text style={s.pageSub}>
              Fill in your details and we will reach out within 24 hours to
              schedule your session.
            </Text>
          </View>

          {/* ── Progress indicator ── */}
          <View style={s.progressRow}>
            <View style={s.progressStep}>
              <View style={[s.progressDot, s.progressDotActive]} />
              <Text style={s.progressLabel}>Details</Text>
            </View>
            <View style={s.progressLine} />
            <View style={s.progressStep}>
              <View style={[s.progressDot, isReady && s.progressDotActive]} />
              <Text style={s.progressLabel}>Service</Text>
            </View>
            <View style={s.progressLine} />
            <View style={s.progressStep}>
              <View style={s.progressDot} />
              <Text style={s.progressLabel}>Confirm</Text>
            </View>
          </View>

          {/* ── Your details card ── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardEyebrow}>STEP 01</Text>
              <Text style={s.cardTitle}>Your Details</Text>
            </View>

            {/* Name */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>
                Full Name <Text style={s.required}>*</Text>
              </Text>
              <View style={[s.inputWrap, nameFocused && s.inputWrapFocused]}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={nameFocused ? T.tanDark : T.grayLight}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor={T.grayLight}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Phone */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>
                Phone Number <Text style={s.required}>*</Text>
              </Text>
              <View style={[s.inputWrap, phoneFocused && s.inputWrapFocused]}>
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={phoneFocused ? T.tanDark : T.grayLight}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={T.grayLight}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Email */}
            <View style={[s.fieldWrap, { marginBottom: 10 }]}>
              <Text style={s.fieldLabel}>
                Email <Text style={s.optional}>(optional)</Text>
              </Text>
              <View style={[s.inputWrap, emailFocused && s.inputWrapFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={emailFocused ? T.tanDark : T.grayLight}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="studio@example.com"
                  placeholderTextColor={T.grayLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>

          {/* ── Service selection card ── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardEyebrow}>STEP 02</Text>
              <Text style={s.cardTitle}>Select Service</Text>
            </View>

            <View style={s.servicesGrid}>
              {SERVICES.map((svc) => {
                const active = service === svc;
                return (
                  <TouchableHighlight
                    key={svc}
                    onPress={() => setService(svc)}
                    underlayColor={T.sand}
                    style={[s.serviceCard, active && s.serviceCardActive]}
                  >
                    <View style={s.serviceCardInner}>
                      <View
                        style={[
                          s.serviceIconWrap,
                          active && s.serviceIconWrapActive,
                        ]}
                      >
                        <Ionicons
                          name={SERVICE_ICONS[svc]}
                          size={20}
                          color={active ? T.white : T.gray}
                        />
                      </View>
                      <Text
                        style={[
                          s.serviceCardText,
                          active && s.serviceCardTextActive,
                        ]}
                      >
                        {svc}
                      </Text>
                      {active && (
                        <View style={s.serviceCheck}>
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={T.tanDark}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          </View>

          {/* ── Summary card ── */}
          {isReady && (
            <View style={s.summaryCard}>
              <Text style={s.summaryEyebrow}>YOUR BOOKING SUMMARY</Text>
              {[
                { label: "Name", value: name },
                { label: "Phone", value: phone },
                { label: "Email", value: email || "—" },
                { label: "Service", value: service },
              ].map((row, i, arr) => (
                <View
                  key={row.label}
                  style={[
                    s.summaryRow,
                    i < arr.length - 1 && s.summaryRowBorder,
                  ]}
                >
                  <Text style={s.summaryLabel}>{row.label}</Text>
                  <Text style={s.summaryValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ── Submit button ── */}
          <View style={s.submitWrap}>
            <TouchableOpacity
              style={[s.submitBtn, !isReady && s.submitBtnDisabled]}
              onPress={handleWhatsApp}
              activeOpacity={isReady ? 0.85 : 1}
            >
              <View style={s.submitBtnLeft}>
                <Ionicons name="logo-whatsapp" size={20} color={T.white} />
                <Text style={s.submitBtnText}>Send via WhatsApp</Text>
              </View>
              <Text style={s.submitBtnArrow}>→</Text>
            </TouchableOpacity>

            <Text style={s.submitNote}>
              Tapping will open WhatsApp with your details pre-filled.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 48 },

  // Page header
  pageHeader: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "300",
    color: T.ink,
    letterSpacing: -0.8,
    lineHeight: 42,
    marginBottom: 12,
  },
  pageTitleItalic: {
    fontStyle: "italic",
    color: T.tanDark,
    fontWeight: "400",
  },
  pageSub: {
    fontSize: 13,
    color: T.gray,
    lineHeight: 20,
  },

  // Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    marginBottom: 24,
  },
  progressStep: { alignItems: "center", gap: 5 },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: T.line,
    borderWidth: 1.5,
    borderColor: T.grayLight,
  },
  progressDotActive: {
    backgroundColor: T.tan,
    borderColor: T.tanDark,
  },
  progressLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.line,
    marginHorizontal: 6,
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 9,
    color: T.grayLight,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: T.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: T.stone,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  cardEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: T.ink,
    letterSpacing: -0.3,
  },

  // Fields
  fieldWrap: {
    paddingHorizontal: 18,
    paddingTop: 16,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: T.gray,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  required: { color: T.tan },
  optional: {
    fontSize: 10,
    color: T.grayLight,
    fontWeight: "400",
    textTransform: "none",
    letterSpacing: 0,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.line,
    paddingHorizontal: 12,
  },
  inputWrapFocused: {
    borderColor: T.tan,
    backgroundColor: T.white,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: T.ink,
  },

  // Services grid
  servicesGrid: {
    padding: 14,
    gap: 8,
  },
  serviceCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.bg,
    overflow: "hidden",
  },
  serviceCardActive: {
    borderColor: T.tan,
    backgroundColor: "#FBF6EF",
  },
  serviceCardInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 14,
  },
  serviceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: T.stone,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconWrapActive: {
    backgroundColor: T.tanDark,
  },
  serviceCardText: {
    flex: 1,
    fontSize: 14,
    color: T.inkSoft,
    fontWeight: "500",
  },
  serviceCardTextActive: {
    color: T.tanDark,
    fontWeight: "700",
  },
  serviceCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: T.sand,
    alignItems: "center",
    justifyContent: "center",
  },

  // Summary card
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: T.stone,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    overflow: "hidden",
    padding: 18,
  },
  summaryEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  summaryLabel: {
    fontSize: 12,
    color: T.gray,
    fontWeight: "500",
    width: 64,
  },
  summaryValue: {
    fontSize: 13,
    color: T.ink,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },

  // Submit
  submitWrap: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: T.whatsapp,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitBtnDisabled: {
    backgroundColor: T.grayLight,
  },
  submitBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: T.white,
    letterSpacing: 0.1,
  },
  submitBtnArrow: {
    fontSize: 18,
    color: "rgba(255,255,255,0.65)",
  },
  submitNote: {
    textAlign: "center",
    fontSize: 11,
    color: T.grayLight,
    marginTop: 10,
    lineHeight: 16,
  },
});
