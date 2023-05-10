import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const FriendItem = ({ friend }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(friend.profilePicture);
  }, []);

  return (
    <View style={styles.friendItem}>
      <Image source={{ uri: image ? `data:image/jpeg;base64,${image}` : "https://via.placeholder.com/150" }} style={styles.avatar} />
      <View style={styles.nameContainer}>
        <Text style={styles.firstName}>{friend.firstName}</Text>
        <Text style={styles.lastName}>{friend.lastName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  nameContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },

  firstName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },

  lastName: {
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default FriendItem;
