import React, { memo } from "react";
import { Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const RecentlyAdded4 = memo(({ style }) => {
  return <Text style={[styles.recentlyAdded, style]}>사용자</Text>;
});

const styles = StyleSheet.create({
  recentlyAdded: {
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    fontWeight: "700",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    color: Color.gray_300,
    textAlign: "left",
  },
});

export default RecentlyAdded4;
