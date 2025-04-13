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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase';
import type { RolePlay } from '../chat/types';

const SPACING = 12;
const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - SPACING * 3) / 2;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('For you');
  const [rolePlays, setRolePlays] = useState<RolePlay[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['For you', 'Popular'];

  useEffect(() => {
    const fetchRolePlays = async () => {
      try {
        const snapshot = await get(ref(db, 'roleplay'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }));
          setRolePlays(list);
        } else {
          setRolePlays([]);
        }
      } catch (err) {
        console.error('❌ Firebase error:', err);
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

  const renderItem = ({ item, index }: { item: RolePlay; index: number }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.id)}
      style={[
        styles.card,
        {
          marginRight: index % 2 === 0 ? SPACING : 0, // left card in each row
        },
      ]}
    >
      <Image source={{ uri: item.cover }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.characterName}>{item.character}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          renderItem={renderItem}
          contentContainerStyle={styles.grid}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING,
    marginBottom: 16,
    marginTop: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#0096FF',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  grid: {
    paddingHorizontal: SPACING,
    paddingBottom: 80,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginBottom: SPACING,
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
