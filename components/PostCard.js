import { View, Text, Image, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import React from 'react';

const PostCard = ({ post }) => {
  const imageUri = `data:image/jpeg;base64,${post.image}`;
  console.log('Image URI:', imageUri);
  return (
    <Card containerStyle={styles.card}>
      <Image source={{ uri: `data:image/jpeg;base64,${post.image}` }} style={styles.postImage} />
      <Text style={styles.uploadTime}>
        {new Date(post.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.caption}>{post.caption}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%", height: 250 },
  postImage: { width: "100%", height: 200, resizeMode: "cover" },
  uploadTime: { fontSize: 12, color: "gray" },
  caption: { fontSize: 16, marginTop: 10 },
});

export default PostCard;
