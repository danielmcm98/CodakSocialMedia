import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

 

const PostForm = ({ onSubmit }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);

 

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this app.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

 

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    setImage(result.uri);
  };

 

  const handleSubmit = () => {
    if (!caption || !image) {
      Alert.alert(
        'Missing data!',
        'Please enter a caption and capture an image.',
        [{ text: 'OK' }]
      );
      return;
    }
    onSubmit(caption, image);
    setCaption('');
    setImage(null);
  };

 

  return (
<View style={styles.container}>
<TextInput
        style={styles.input}
        placeholder="Enter caption..."
        value={caption}
        onChangeText={setCaption}
      />
<View style={styles.imagePreview}>
        {!image ? (
<Button title="Take Picture" onPress={takeImageHandler} />
        ) : (
<View style={styles.imageContainer}>
<Image source={{ uri: image }} style={styles.image} />
</View>
        )}
</View>
<Button title="Submit Post" onPress={handleSubmit} />
</View>
  );
};

 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  imagePreview: {
    width: '80%',
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

 

export default PostForm;