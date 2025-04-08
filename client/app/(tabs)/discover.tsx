import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase'; 

const screenWidth = Dimensions.get('window').width;

type Post = {
  id: string;
  authorId: string;
  authorName: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string | null;
};

export default function DiscoverScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await get(ref(db, 'posts'));
        console.log('📦 Raw snapshot:', snapshot.val());
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          const postArray = Array.isArray(data) ? data : Object.values(data);
          setPosts(postArray);
        } else {
          console.log('⚠️ No data at /post');
          setPosts([]);
        }
      } catch (err) {
        console.error('❌ Firebase fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#888" />
        <Text>Loading posts...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.authorName}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
          <Text style={styles.content}>{item.content}</Text>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.postImage} />
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});
