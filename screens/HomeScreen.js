import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import { getPosts } from '../middleware/api';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  
  );

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.log('Error fetching posts');
    }
  };

  const renderPost = (item) => {
    const imageUri = `data:image/jpeg;base64,${item.image}`;

    return (
      <Card containerStyle={styles.card} key={item._id}>
        <Image source={{ uri: imageUri }} style={styles.postImage} />
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
        <Text style={styles.uploadTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </Card>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {posts.length > 0 ? (
        posts.map((post) => renderPost(post))
      ) : (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>No posts</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    width: '80%',
    height: 410,
    alignItems: 'center',
    margin: 50,
  },
  postImage: {
    width: 300,
    height: '90%',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  uploadTime: {
    fontSize: 12,
    color: 'gray',
  },
  captionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
  },
  caption: {
    fontSize: 16,
    textAlign: 'center',
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostsText: {
    fontSize: 20,
  },
});

export default HomeScreen;
