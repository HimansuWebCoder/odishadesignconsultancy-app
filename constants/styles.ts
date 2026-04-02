import { StyleSheet } from "react-native";
import { COLORS} from "./theme";
import { FONTS } from "./fonts";

export const GLOBAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  title: {
    fontSize: 20,
    fontFamily: FONTS.poppins.semiBold,
    color: COLORS.dark,
  },

  text: {
    fontSize: 14,
    fontFamily: FONTS.poppins.regular,
    color: COLORS.gray,
  },
});
