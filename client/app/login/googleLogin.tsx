import * as React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { Button } from 'react-native';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase'; // adjust path

export default function GoogleLoginButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '521795714166-ho8t7ab0ccr0nv3p6lqcq3rmp2vemn1v.apps.googleusercontent.com',
});

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Continue with Google"
      onPress={() => promptAsync()}
    />
  );
}
