import React, { memo } from "react";
import { Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const RecentlyAdded3 = memo(({ style }) => {
  return (
    <Text
      style={[styles.recentlyAdded, style]}
    >{`위치 : 경기도 하남시 미사강변한강로
         170 한신휴플러스 아파트`}</Text>
  );
});

const styles = StyleSheet.create({
  recentlyAdded: {
    fontSize: FontSize.size_mini,
    letterSpacing: 0,
    lineHeight: 18,
    fontFamily: FontFamily.hancomMalangMalangRegular,
    color: Color.white,
    textAlign: "left",
  },
});

export default RecentlyAdded3;
