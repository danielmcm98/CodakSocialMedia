import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { sendFriendRequest } from "../middleware/api";

const UserItem = ({ user }) => {
  const [requestStatus, setRequestStatus] = useState("Add");

  const handleAddFriend = async () => {
    try {
      const response = await sendFriendRequest(user._id);
      // Update the UI based on the response (if needed)
      console.log("Friend request sent:", response);
      setRequestStatus("Pending");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.userItem}>
      <View style={styles.avatarPlaceholder}>
        <Image
          source={{
            uri: user?.profilePicture
              ? `data:image/jpeg;base64,${user.profilePicture}`
              : "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.userName}>{user.firstName + " " + user.lastName}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddFriend}
        disabled={requestStatus === "Pending"}
      >
        <Text style={styles.addButtonText}>{requestStatus}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userItem: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserItem;
