import * as React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";
import axios from "axios";

const Screen7 = () => {
  return (
    <View style={styles.view}>
      <ImageBackground
        style={styles.logoIcon}
        resizeMode="cover"
        source={require("../assets/logo.png")}
      />
      <Text style={styles.recentlyAdded}>오늘의 안전 지키미</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoIcon: {
    width: 399,
    height: 399,
    marginTop: -95,
  },
  recentlyAdded: {
    fontSize: 20,
    letterSpacing: 0,
    textTransform: "uppercase",
    fontWeight: "700",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    color: Color.white,
    textAlign: "left",
    marginTop: -123,
  },
  view: {
    backgroundColor: Color.darkslateblue,
    flex: 1,
    width: "100%",
    paddingLeft: 20,
    paddingTop: 222,
    paddingRight: 0,
    alignItems: "center",
  },
});

export default Screen7;
