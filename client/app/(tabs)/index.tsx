import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase'; // adjust path to your Firebase config

type RolePlay = {
  id: string;
  title: string;
  cover: string;
  description: string;
  character: string;
  avatar: string;
  prompt: string;
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('For you');
  const [rolePlays, setRolePlays] = useState<RolePlay[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['For you', 'Popular', 'Practice again'];

  useEffect(() => {
    const fetchRolePlays = async () => {
      try {
        const snapshot = await get(ref(db, 'roleplay'));

        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.entries(data).map(
            ([key, value]: [string, any]) => ({
              id: key,
              ...value,
            })
          );
          setRolePlays(list);
        } else {
          console.log('⚠️ No roleplay data found');
          setRolePlays([]);
        }
      } catch (err) {
        console.error('❌ Error fetching Firebase data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRolePlays();
  }, []);

  const handlePress = (roleplayid: string) => {
    router.push({
      pathname: '/chat/roleplay/[roleplayid]',
      params: { roleplayid },
    } as const);
  };

  const renderItem = ({ item }: { item: RolePlay }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id)}>
      <Image source={{ uri: item.cover }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.characterName}>{item.character}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <br />
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={rolePlays}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  tabContainer: { flexDirection: 'row', marginBottom: 16 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeTab: { backgroundColor: '#333' },
  tabText: { color: '#333' },
  activeTabText: { color: '#fff' },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  grid: { paddingBottom: 80 },
  card: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  textContainer: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  characterName: {
    fontSize: 14,
    color: '#666',
  },
});
