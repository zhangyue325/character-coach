import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GoogleLoginButton from './login/googleLogin';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top icon grid or background graphic */}
      <View style={styles.iconGrid}>
        <Image
          source={{ uri:'https://images.squarespace-cdn.com/content/v1/5dd6f32ef5ae331b3cdd201a/8a88d2dd-51bc-4e71-92f0-837cc85b1cb9/gudatema.png' }}// replace with your icon background image
          style={styles.iconImage}
          resizeMode="cover"
        />
      </View>

      {/* Title */}
      <View style={styles.content}>
        <Text style={styles.title}>Your all-in-one</Text>
        <Text style={styles.subtitle}>language coach</Text>

        {/* CTA Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login/signup')}>
          <Text style={styles.primaryButtonText}>Create your account</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.line} />
        </View>

        {/* OAuth Buttons */}
        <View style={styles.oauthRow}>
          <GoogleLoginButton/>

          <TouchableOpacity style={styles.oauthButton}>
            <Ionicons name="logo-apple" size={20} color="#000" />
            <Text style={styles.oauthText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <TouchableOpacity onPress={() => router.push('./login/login')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  iconGrid: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  iconImage: {
    width: '100%',
    height: 240,
  },
  content: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e06a50',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#e06a50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: '#fff',
  },
  oauthText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  signInText: {
    fontSize: 14,
    color: '#444',
  },
  signInLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
});
