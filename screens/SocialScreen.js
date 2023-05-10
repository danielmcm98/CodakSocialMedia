import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import FriendRequests from "../components/FriendRequests";
import FriendsList from "../components/FriendsList";
import SearchModal from "../components/SearchModal";

const SocialScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <FriendRequests />
      <FriendsList />
      <TouchableOpacity style={styles.searchButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      <SearchModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SocialScreen;

