import React, { memo } from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Iconnavigationclose24px = memo(({ style }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={[styles.iconnavigationclose24px, style]}
      onPress={() => navigation.goBack()}
    >
      <Image
        style={styles.icon}
        resizeMode="cover"
        source={require("../assets/iconnavigationclose-24px.png")}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  icon: {
    width: "100%",
    height: "100%",
  },
  iconnavigationclose24px: {
    width: 32,
    height: 32,
  },
});

export default Iconnavigationclose24px;
