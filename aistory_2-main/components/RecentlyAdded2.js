import React, { memo } from "react";
import { StyleProp, ViewStyle, Text, StyleSheet } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const RecentlyAdded2 = memo(({ style }) => {
  return <Text style={[styles.recentlyAdded, style]}>센서 정보 변경</Text>;
});

<Pressable>
        style={[styles.meno]}
        onPress={() => navigation.navigate("Screen8")}
      </Pressable>

const styles = StyleSheet.create({
  recentlyAdded: {
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    fontWeight: "700",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    color: Color.dimgray,
    textAlign: "left",
  },
});

export default RecentlyAdded2;
