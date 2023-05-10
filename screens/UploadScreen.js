import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Camera } from "../components/Camera";
import { createPost } from "../middleware/api";
import { Ionicons } from "@expo/vector-icons";

const UploadScreen = ({ userId }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const cameraRef = useRef();

  const handleCapture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takeImageHandler();
      setImage(data.assets[0]);
    }
  };

  const handlePost = async () => {
    if (caption && image) {
      try {
        await createPost({
          userId,
          caption,
          image: image.base64,
        });
        setCaption("");
        setImage(null);
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("Missing data!", "Please enter a caption and take a photo.", [
        { text: "OK" },
      ]);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  return (
    <View style={styles.screen}>
      <View style={{ height: 0 }}>
        <Camera ref={cameraRef} />
      </View>
      <View style={styles.imagePreview}>
        {!image ? (
          <TouchableOpacity
            onPress={handleCapture}
            style={styles.captureButton}
          >
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: image ? `data:image/jpeg;base64,${image.base64}` : null,
              }}
              style={styles.image}
            />
          </View>
        )}
      </View>
      <View style={styles.captionContainer}>
        <TextInput
          style={styles.captionInput}
          placeholder="Enter caption..."
          value={caption}
          onChangeText={setCaption}
        />
      </View>
      {image && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleDeleteImage}
            style={styles.deleteButton}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePost} style={styles.postButton}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    width: "80%",
  },
  captionInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePreview: {
    width: "80%",
    height: 300,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  captureButton: {
    backgroundColor: "#2196F3",
    borderRadius: 50,
    padding: 15,
    alignSelf: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "center",
  },
  postButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});

export default UploadScreen;
