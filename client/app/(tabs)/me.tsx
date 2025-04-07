import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const user = {
  name: 'Alex Learner',
  avatar: 'https://i.pravatar.cc/100?img=60',
  level: 'Intermediate',
  streak: 12,
  saved: 5,
};

const settings = [
  { id: '1', icon: 'person-outline', label: 'Profile Settings' },
  { id: '2', icon: 'bookmarks-outline', label: 'Saved Posts' },
  { id: '3', icon: 'notifications-outline', label: 'Notifications' },
  { id: '4', icon: 'color-palette-outline', label: 'Theme' },
  { id: '5', icon: 'log-out-outline', label: 'Log Out' },
];

export default function MeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.level}>Level: {user.level}</Text>
          <Text style={styles.streak}>🔥 Streak: {user.streak} days</Text>
        </View>
      </View>

      <FlatList
        data={settings}
        keyExtractor={item => item.id}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name={item.icon as any} size={22} color="#333" style={{ marginRight: 12 }} />
            <Text style={styles.settingLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  level: { fontSize: 14, color: '#555', marginTop: 4 },
  streak: { fontSize: 14, color: '#777', marginTop: 2 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  settingLabel: { fontSize: 16 },
});
