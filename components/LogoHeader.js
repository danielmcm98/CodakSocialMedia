import React from 'react';
import { View, Image } from 'react-native';

function LogoHeader() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../assets/Codak.png")}
        style={{ width: 120, height: 40, resizeMode: "contain" }}
      />
    </View>
  );
}

export default LogoHeader;
