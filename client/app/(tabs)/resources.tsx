import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const progress = {
  goal: 80, // percent
  streak: 5,
  wordsThisWeek: 12,
};

const resources = [
  {
    id: '1',
    title: '🎧 Listening Practice',
    description: 'Practice listening with real-life English phrases.',
    icon: 'headset-outline',
  },
  {
    id: '2',
    title: '🗣 Speaking Challenge',
    description: 'Repeat and respond to real conversations.',
    icon: 'mic-outline',
  },
  {
    id: '3',
    title: '📖 Grammar Tips',
    description: 'Clear, short lessons on common grammar topics.',
    icon: 'book-outline',
  },
  {
    id: '4',
    title: '🧠 Vocabulary Builder',
    description: 'Practice themed word packs like Travel, Work, etc.',
    icon: 'bulb-outline',
  },
];

export default function ResourcesScreen() {
  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={styles.dashboard}>
            <View style={styles.widget}>
              <Ionicons name="checkmark-done-circle-outline" size={28} color="#4CAF50" />
              <View style={styles.widgetText}>
                <Text style={styles.widgetTitle}>Goal</Text>
                <Text style={styles.widgetValue}>{progress.goal}%</Text>
              </View>
            </View>
            <View style={styles.widget}>
              <Ionicons name="flame-outline" size={28} color="#FF5722" />
              <View style={styles.widgetText}>
                <Text style={styles.widgetTitle}>Streak</Text>
                <Text style={styles.widgetValue}>{progress.streak} days</Text>
              </View>
            </View>
            <View style={styles.widget}>
              <Ionicons name="bookmarks-outline" size={28} color="#3F51B5" />
              <View style={styles.widgetText}>
                <Text style={styles.widgetTitle}>Words</Text>
                <Text style={styles.widgetValue}>{progress.wordsThisWeek}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Learning Resources</Text>
        </>
      }
      data={resources}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <Ionicons name={item.icon as any} size={28} color="#444" style={{ marginRight: 12 }} />
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  widget: {
    flex: 1,
    alignItems: 'center',
  },
  widgetText: {
    marginTop: 8,
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 12,
    color: '#888',
  },
  widgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
