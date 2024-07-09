import React, { memo } from "react";
import {
  StyleProp,
  ViewStyle,
  ImageBackground,
  StyleSheet,
} from "react-native";

const Icon1 = memo(({ style }) => {
  return (
    <ImageBackground
      style={[styles.icon, style]}
      resizeMode="cover"
      source={require("../assets/1.png")}
    />
  );
});

const styles = StyleSheet.create({
  icon: {
    width: 94,
    height: 94,
  },
});

export default Icon1;
