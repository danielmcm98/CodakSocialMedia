import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";

// Import your screen components
import HomeScreen from "./screens/HomeScreen";
import UploadScreen from "./screens/UploadScreen";
import SocialScreen from "./screens/SocialScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LogoHeader from "./components/LogoHeader";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import axios from "axios";

axios.defaults.withCredentials = true;
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };

  const handleSignoutSuccess = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: true }}>
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "Sign up" }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerTitle: () => <LogoHeader />,
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Upload"
            options={{
              headerTitle: () => <LogoHeader />,
              tabBarIcon: ({ color, size }) => (
                <Icon name="camera" color={color} size={size} />
              ),
            }}
          >
            {(props) => <UploadScreen {...props} userId={userId} />}
          </Tab.Screen>
          <Tab.Screen
            name="Friends"
            options={{
              headerTitle: () => <LogoHeader />,
              tabBarIcon: ({ color, size }) => (
                <Icon name="users" color={color} size={size} />
              ),
            }}
            component={SocialScreen}
          />
          <Tab.Screen
            name="Profile"
            options={{
              headerTitle: () => <LogoHeader />,
              tabBarIcon: ({ color, size }) => (
                <Icon name="user" color={color} size={size} />
              ),
            }}
          >
            {(props) => (
              <ProfileScreen
                {...props}
                handleSignoutSuccess={handleSignoutSuccess}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
