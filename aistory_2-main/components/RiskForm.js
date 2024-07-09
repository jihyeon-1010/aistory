import React, { memo } from "react";
import { StyleSheet, View, Image, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontSize, Color, FontFamily } from "../GlobalStyles";

const RiskForm = memo(() => {
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <View style={[styles.barsstatusdefault, styles.backgroundPosition]}>
        <View style={[styles.background, styles.backgroundPosition]} />
        <Image
          style={[styles.containerIcon, styles.iconPosition]}
          resizeMode="cover"
          source={require("../assets/container.png")}
        />
        <View style={styles.time}>
          <View
            style={[
              styles.barsstatusattributestimeWh,
              styles.backgroundPosition,
            ]}
          />
          <Text style={[styles.time1, styles.iconPosition]}>9:41</Text>
        </View>
      </View>
      <View style={[styles.rectangle, styles.rectangleLayout]} />
      <Image
        style={[styles.rectangleIcon, styles.rectangleLayout]}
        resizeMode="cover"
        source={require("../assets/rectangle.png")}
      />
      <View style={[styles.rectangle1, styles.rectangleLayout]} />
      <Text style={[styles.thu, styles.thuTypo]}>주의</Text>
      <Text style={[styles.thu1, styles.thuPosition]}>안전</Text>
      <Text style={[styles.thu2, styles.thuTypo]}>위험</Text>
      <Text style={[styles.thu1, styles.thuPosition]}>안전</Text>
      <Text style={[styles.recentlyAdded, styles.recentlyPosition]}>
        오늘의 위험 확률
      </Text>
      <Text style={[styles.recentlyAdded1, styles.recentlyPosition]}>32%</Text>
      <Text style={[styles.thu4, styles.thuPosition]}>안전</Text>
      <Image
        style={[styles.arrowIcon, styles.iconPosition]}
        resizeMode="cover"
        source={require("../assets/arrow.png")}
      />
      <Image
        style={[styles.icon, styles.iconPosition]}
        resizeMode="cover"
        source={require("../assets/calender.png")}
      />
      <Pressable
        style={[styles.menu, styles.iconPosition]}
        onPress={() => navigation.navigate("Screen6")}
      >
        <Image
          style={styles.icon1}
          resizeMode="cover"
          source={require("../assets/menu.png")}
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  backgroundPosition: {
    left: 0,
    right: 0,
    top: 0,
    position: "absolute",
  },
  iconPosition: {
    top: "50%",
    position: "absolute",
  },
  rectangleLayout: {
    height: 15,
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
    position: "absolute",
  },
  thuTypo: {
    textAlign: "left",
    fontSize: FontSize.size_2xs,
    left: "23.71%",
    color: Color.white,
    fontFamily: FontFamily.robotoRegular,
    top: "50%",
    position: "absolute",
  },
  thuPosition: {
    marginTop: 55.5,
    textAlign: "left",
    fontSize: FontSize.size_2xs,
    left: "23.71%",
    fontFamily: FontFamily.robotoRegular,
    top: "50%",
    position: "absolute",
  },
  recentlyPosition: {
    lineHeight: 41,
    letterSpacing: 1,
    textAlign: "left",
    top: "50%",
    position: "absolute",
  },
  background: {
    backgroundColor: Color.gray_100,
    bottom: 0,
  },
  containerIcon: {
    marginTop: -4.84,
    right: 15,
    width: 67,
    height: 12,
  },
  barsstatusattributestimeWh: {
    bottom: 0,
  },
  time1: {
    marginTop: -11,
    left: 32,
    fontSize: FontSize.size_mini,
    letterSpacing: 0,
    textAlign: "center",
    color: Color.white,
    fontFamily: FontFamily.robotoRegular,
  },
  time: {
    height: "50%",
    width: "47.9%",
    top: "27.27%",
    right: "52.1%",
    bottom: "22.73%",
    left: "0%",
    position: "absolute",
  },
  barsstatusdefault: {
    height: 44,
  },
  rectangle: {
    bottom: 20,
    backgroundColor: Color.khaki,
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
  },
  rectangleIcon: {
    marginTop: 56,
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
    top: "50%",
  },
  rectangle1: {
    backgroundColor: Color.crimson,
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
    width: 40,
    borderRadius: Border.br_12xs,
    left: 51,
    bottom: 0,
  },
  thu: {
    marginTop: 75.5,
  },
  thu1: {
    color: Color.lightgray,
  },
  thu2: {
    marginTop: 95.5,
  },
  recentlyAdded: {
    marginTop: -13,
    left: "22.66%",
    fontSize: FontSize.size_17xl,
    fontWeight: "700",
    fontFamily: FontFamily.hancomMalangMalangRegular,
    color: Color.white,
  },
  recentlyAdded1: {
    marginTop: 62.5,
    left: "66.94%",
    fontSize: FontSize.size_21xl,
    color: Color.lightsteelblue,
    fontFamily: FontFamily.robotoRegular,
  },
  thu4: {
    color: Color.white,
  },
  arrowIcon: {
    marginTop: -55.06,
    left: 33,
    width: 17,
    height: 27,
  },
  icon: {
    marginTop: -51,
    marginLeft: -55,
    left: "50%",
    width: 110,
    height: 18,
  },
  icon1: {
    marginTop: -62,
    width: "100%",
    height: "100%",
  },
  menu: {
    right: 10,
    width: 41,
    height: 41,
  },
  view: {
    width: 428,
    height: 222,
  },
});

export default RiskForm;
