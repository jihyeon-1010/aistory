

const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";



import Screen10 from "./screens/Screen10"; 
import Screen9 from "./screens/Screen9";
import Screen7 from "./screens/Screen7";
import Screen8 from "./screens/Screen8";
import Screen6 from "./screens/Screen6";
import Screen5 from "./screens/Screen5";
import Screen4 from "./screens/Screen4";
import Screen3 from "./screens/Screen3";
import Screen2 from "./screens/Screen2";
import Screen1 from "./screens/Screen1";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity, ScrollView, Button } from "react-native";




const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(false);
  
  React.useEffect(() => {
    setTimeout(() => {
      setHideSplashScreen(true);
    }, 1000);
  }, []);

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator
            initialRouteName="Screen6"
            screenOptions={{ headerShown: false }}
            
          >
            <Stack.Screen
              name="Screen"
              component={Screen7}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Screen8"
              component={Screen8}
              options={{ 
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Screen6"
              component={Screen6}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Screen5"
              component={Screen5}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Screen4"
              component={Screen4}
              options={{ 
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Screen3"
              component={Screen3}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Screen2"
              component={Screen2}
              options={{ 
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Screen1"
              component={Screen1}
              options={{ 
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Screen9"
              component={Screen9}
              options={{ 
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Screen10"
              component={Screen10}
              options={{ 
                headerShown: false,
                animation: 'fade',
              }}
            />
          </Stack.Navigator>
        ) : (
          <Screen7 />
        )}
      </NavigationContainer>
    </>
  );
};
export default App;
