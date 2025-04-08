import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase'; 

type Character = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
};

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const snapshot = await get(ref(db, 'characters'));
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          const characterArray = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }));
          setCharacters(characterArray);  
        } else {
          console.log('⚠️ No data at /characters');
          setCharacters([]);
        }
      } catch (err) {
        console.error('❌ Firebase fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCharacters();
  }, []);
  

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading characters...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={characters}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/chat/[id]', params: { id: item.id } }} asChild>
          <Pressable style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 80, // keeps content clear of tab bar
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 12,
    color: '#999',
  },
});
