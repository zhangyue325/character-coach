import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { useState } from 'react';

export default function Welcome() {
  const router = useRouter();
  const [mode, setMode] = useState<'none' | 'signup' | 'login'>('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async () => {
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
  
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
  
      setError(null);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('❌ Firebase error:', err.message);
      setError(err.message); // Show Firebase's message directly
    }
  };

  const resetForm = () => {
    setMode('none');
    setEmail('');
    setPassword('');
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome ✨</Text>

      {mode === 'none' && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => setMode('signup')}>
            <Text style={styles.buttonText}>Sign up with Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.loginBtn]} onPress={() => setMode('login')}>
            <Text style={styles.buttonText}>Login with Email</Text>
          </TouchableOpacity>
        </>
      )}

      {mode !== 'none' && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (error) setError(null);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (error) setError(null);
            }}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
            <Text style={styles.buttonText}>
              {mode === 'signup' ? 'Create Account' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetForm}>
            <Text style={styles.link}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 60 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  loginBtn: { backgroundColor: '#444' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  form: { width: '100%', marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  link: { textAlign: 'center', color: '#007AFF', marginTop: 10 },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
});