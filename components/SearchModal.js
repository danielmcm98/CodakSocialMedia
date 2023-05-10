import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { searchUsers } from "../middleware/api";
import UserItem from "./UserItem";

const SearchModal = ({ modalVisible, setModalVisible }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchUsersWrapper = async () => {
    try {
      const users = await searchUsers(searchTerm);
      setSearchResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setSearchTerm}
            value={searchTerm}
            placeholder="Search for friends..."
            onSubmitEditing={() => searchUsersWrapper()}
          />
        </View>
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              handleAddFriend={(userId) => console.log("Add friend:", userId)}
            />
          )}
          keyExtractor={(item) => item._id}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 80, // adjust this value to move the entire component up or down
  },
  searchContainer: {
    height: "25%",
    justifyContent: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchModal;
