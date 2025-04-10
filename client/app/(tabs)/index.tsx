import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

const testImageUrl = 'https://via.placeholder.com/300x200.png?text=Role+Play';

const rolePlays = [
  { title: 'Job interview', character_id: 'emma', character_name: 'Emma', image: { uri: testImageUrl }, id: 'job-interview' },
  { title: 'Hotel check-in', character_id: 'max', character_name: 'Max', image: { uri: testImageUrl }, id: 'hotel-check-in' },
  { title: 'Meeting new people', character_id: 'lily', character_name: 'Lily', image: { uri: testImageUrl }, id: 'meeting-new-people' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('For you');
  const tabs = ['For you', 'Popular', 'Practice again'];

  const handlePress = (id: string, character_id: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: {
        id,
        character_id,
      },
    } as const);
  };

  const renderItem = ({ item }: { item: typeof rolePlays[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id, item.character_id)}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text >{item.character_name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Role-play</Text>

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

      <FlatList
        data={rolePlays}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  grid: {
    paddingBottom: 80,
  },
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
  cardTitle: {
    padding: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});
