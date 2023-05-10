import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFriendRequests, updateFriendRequest } from "../middleware/api";
import FriendRequestItem from "./FriendRequestItem";
import { useFocusEffect } from '@react-navigation/native';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchFriendRequests();
    }, [])
  );


  const fetchFriendRequests = async () => {
    try {
      const requests = await getFriendRequests();
      setFriendRequests(requests);
    } catch (error) {
      console.log("Error fetching friend requests");
    }
  };

  const handleAccept = async (requestId) => {
    await updateFriendRequestStatus(requestId, "accepted");
  };

  const handleDecline = async (requestId) => {
    await updateFriendRequestStatus(requestId, "rejected");
  };

  const updateFriendRequestStatus = async (requestId, status) => {
    try {
      await updateFriendRequest(requestId, status);
      fetchFriendRequests();
    } catch (error) {
      console.error("Error updating friend request:", error);
    }
  };

  return (
    <View style={styles.friendRequestsContainer}>
      <Text style={styles.friendText}>Friend Requests:</Text>
      <FlatList
        data={friendRequests}
        renderItem={({ item }) => (
          <FriendRequestItem
            request={item}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  friendRequestsContainer: {
    height: "40%",
    paddingHorizontal: 15,
  },
  friendText:{
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  }
});

export default FriendRequests;
