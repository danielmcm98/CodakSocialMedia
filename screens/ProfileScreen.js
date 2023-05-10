import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { getUser, updatePassword, signOut } from "../middleware/api";

const ProfileScreen = ({ navigation, handleSignoutSuccess }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    try {
      await updatePassword(user._id, { currentPassword, newPassword });
      Alert.alert("Success", "Password changed successfully.");
      setModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to change password. Please try again later."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleSignoutSuccess();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again later.");
    }
  };

  const handleProfilePicture = async () => {
    // Add your logic for changing the profile picture here.
    // It can be either choosing an image from the gallery or taking a new photo.
    // After getting the image, you can use the changeProfilePicture API function.
  };

  return (
    <View style={styles.profileScreen}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: user?.profilePicture
              ? `data:image/jpeg;base64,${user.profilePicture}`
              : "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userInfoText}>{user?.userEmail}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleProfilePicture}>
          <Text style={styles.buttonText}>Change Profile Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry={true}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChangePassword}
              >
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profileScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 40,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "#1e90ff",
    padding: 10,
  },
  avatar: { 
    width: 180, 
    height: 180, 
    borderRadius: 90
  },
  userInfoContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center"
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default ProfileScreen;
