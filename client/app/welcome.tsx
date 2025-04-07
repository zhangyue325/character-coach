import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

export default function Welcome() {
  const router = useRouter();

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'test@email.com', 'password123');
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Email login failed:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's go ●</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emailBtn} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Sign up with Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 60 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    width: '80%',
    marginBottom: 20,
  },
  emailBtn: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
