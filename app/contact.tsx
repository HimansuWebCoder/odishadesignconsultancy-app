// app/contact.tsx

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
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

// ─── Theme (matches HomeScreen) ───────────────────────────
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

const PHONE = "919438240303";
const EMAIL = "odisha.designconsultancy@gmail.com";

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);

  const openWhatsApp = () => {
    const text = message.trim()
      ? message
      : "Hello, I'd like to connect with your architectural studio.";
    Linking.openURL(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`);
  };

  const callNow = () => Linking.openURL(`tel:+${PHONE}`);
  const sendEmail = () => Linking.openURL(`mailto:${EMAIL}`);

  const quickActions: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    color: string;
  }[] = [
    { label: "Call", icon: "call-outline", onPress: callNow, color: "#4A7C6A" },
    {
      label: "WhatsApp",
      icon: "logo-whatsapp",
      onPress: openWhatsApp,
      color: "#4A7C6A",
    },
    {
      label: "Email",
      icon: "mail-outline",
      onPress: sendEmail,
      color: T.tanDark,
    },
  ];

  const infoRows: { label: string; value: string }[] = [
    {
      label: "Address",
      value:
        "2nd Floor, Chandan Villa, Plot No-1258, Road Number 8, UNIT- 9, Bhubaneswar, Odisha 751022",
    },
    { label: "Phone", value: "+919438240303" },
    { label: "Email", value: EMAIL },
    { label: "Hours", value: "Mon – Sat, 10 am – 6:30 pm" },
  ];

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
            <Text style={s.pageEyebrow}>REACH OUT</Text>
            <Text style={s.pageTitle}>
              Le ts build{"\n"}
              <Text style={s.pageTitleItalic}>something together.</Text>
            </Text>
            <Text style={s.pageSub}>
              Every great building begins with a conversation. We would love to
              hear about your project.
            </Text>
          </View>

          {/* ── Quick action strip ── */}
          <View style={s.actionsRow}>
            {quickActions.map((a) => (
              <TouchableHighlight
                key={a.label}
                onPress={a.onPress}
                underlayColor={T.sand}
                style={s.actionCard}
              >
                <View style={s.actionInner}>
                  <View
                    style={[s.actionIconWrap, { backgroundColor: T.stone }]}
                  >
                    <Ionicons name={a.icon} size={20} color={T.tanDark} />
                  </View>
                  <Text style={s.actionLabel}>{a.label}</Text>
                </View>
              </TouchableHighlight>
            ))}
          </View>

          {/* ── Decorative divider ── */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerDot}>⿻</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ── Office info card ── */}
          <View style={s.infoCard}>
            <View style={s.infoCardHeader}>
              <Text style={s.infoCardEyebrow}>OFFICE INFO</Text>
              <Text style={s.infoCardTitle}>Our Office</Text>
            </View>
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                style={[s.infoRow, i < infoRows.length - 1 && s.infoRowBorder]}
              >
                <Text style={s.infoRowLabel}>{row.label}</Text>
                <Text style={s.infoRowValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* ── Message form ── */}
          <View style={s.formCard}>
            <Text style={s.formEyebrow}>SEND A MESSAGE</Text>
            <Text style={s.formTitle}>We will respond within 24 hours.</Text>

            {/* Name field */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>Your Name</Text>
              <TextInput
                style={[s.input, nameFocused && s.inputFocused]}
                placeholder="e.g. Priya Sharma"
                placeholderTextColor={T.grayLight}
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                returnKeyType="next"
              />
            </View>

            {/* Message field */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>Message</Text>
              <TextInput
                style={[s.textarea, messageFocused && s.inputFocused]}
                placeholder="Tell us about your project — type, location, scale, timeline…"
                placeholderTextColor={T.grayLight}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
                onFocus={() => setMessageFocused(true)}
                onBlur={() => setMessageFocused(false)}
              />
              <Text style={s.charCount}>{message.length} / 500</Text>
            </View>

            {/* Send via WhatsApp */}
            <TouchableOpacity
              style={s.sendBtn}
              onPress={openWhatsApp}
              activeOpacity={0.85}
            >
              <View style={s.sendBtnInner}>
                <Ionicons name="logo-whatsapp" size={18} color={T.white} />
                <Text style={s.sendBtnText}>Send via WhatsApp</Text>
              </View>
              <Text style={s.sendBtnArrow}>→</Text>
            </TouchableOpacity>

            {/* Secondary: email */}
            <TouchableOpacity
              style={s.emailBtn}
              onPress={sendEmail}
              activeOpacity={0.75}
            >
              <Ionicons name="mail-outline" size={16} color={T.tanDark} />
              <Text style={s.emailBtnText}>Or send via Email</Text>
            </TouchableOpacity>
          </View>

          {/* ── Bottom note ── */}
          <Text style={s.bottomNote}>
            Odisha Design Consultancy, Bhubaneswar, Odisha{"\n"}All enquiries
            are confidential.
          </Text>
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
    paddingBottom: 28,
  },
  pageEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "300",
    color: T.ink,
    letterSpacing: -0.8,
    lineHeight: 40,
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

  // Quick actions
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    backgroundColor: T.white,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    overflow: "hidden",
  },
  actionInner: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 10,
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: T.inkSoft,
    letterSpacing: 0.2,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.line,
  },
  dividerDot: { fontSize: 10, color: T.tan },

  // Info card
  infoCard: {
    marginHorizontal: 16,
    backgroundColor: T.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    overflow: "hidden",
    marginBottom: 16,
  },
  infoCardHeader: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
    backgroundColor: T.stone,
  },
  infoCardEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: T.ink,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  infoRowLabel: {
    fontSize: 12,
    color: T.grayLight,
    fontWeight: "500",
    width: 70,
  },
  infoRowValue: {
    fontSize: 13,
    color: T.inkSoft,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },

  // Form card
  formCard: {
    marginHorizontal: 16,
    backgroundColor: T.white,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.line,
    padding: 20,
    marginBottom: 16,
  },
  formEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: T.tan,
    fontWeight: "700",
    marginBottom: 6,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: T.inkSoft,
    marginBottom: 22,
    letterSpacing: -0.2,
  },

  // Fields
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: T.gray,
    letterSpacing: 0.3,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: T.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.line,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: T.ink,
  },
  textarea: {
    backgroundColor: T.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.line,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 36,
    fontSize: 14,
    color: T.ink,
    minHeight: 120,
    textAlignVertical: "top",
  },
  inputFocused: {
    borderColor: T.tan,
    backgroundColor: T.white,
  },
  charCount: {
    fontSize: 10,
    color: T.grayLight,
    textAlign: "right",
    marginTop: 4,
  },

  // Send button
  sendBtn: {
    backgroundColor: T.whatsapp,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 10,
  },
  sendBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sendBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: T.white,
    letterSpacing: 0.1,
  },
  sendBtnArrow: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
  },

  // Email secondary
  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.line,
  },
  emailBtnText: {
    fontSize: 13,
    color: T.tanDark,
    fontWeight: "500",
  },

  // Bottom note
  bottomNote: {
    textAlign: "center",
    fontSize: 11,
    color: T.grayLight,
    lineHeight: 18,
    paddingHorizontal: 32,
  },
});
