import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';

export default function MeScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/welcome');
        },
      },
    ]);
  };

  const handleProfileClick = () => {
    router.push('/profile-settings'); // 🔁 Make sure this screen exists
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profile} onPress={handleProfileClick}>
        <Image source={{ uri: user?.photoURL || 'https://i.pravatar.cc/100?img=60' }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user?.displayName || 'Anonymous'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#000" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
