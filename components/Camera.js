import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Camera as ExpoCamera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export const Camera = forwardRef((props, ref) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(ExpoCamera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  useImperativeHandle(ref, () => ({
    async takeImageHandler() {
      if (!cameraPermission) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        setCameraPermission(status === "granted");
      }

      if (!cameraPermission) {
        Alert.alert(
          "Insufficient permissions!",
          "You need to grant camera permissions to use this app.",
          [{ text: "OK" }]
        );
        return;
      }

      const options = {
        quality: 0.5,
        allowsEditing: true,
        aspect: [16, 9],
        base64: true,
      };

      const result = await ImagePicker.launchCameraAsync(options);

      if (!result.cancelled) {
        return result;
      }
    },
  }));

  if (cameraPermission === null) {
    return <View />;
  }

  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <ExpoCamera style={styles.camera} type={cameraType} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
});

export default Camera;
