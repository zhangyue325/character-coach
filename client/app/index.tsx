import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Redirect } from 'expo-router';
import { auth } from '../firebase';

export default function Index() {
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setUserChecked(true);
    });
    return unsub;
  }, []);

  if (!userChecked) return null;

  return <Redirect href={user ? '/(tabs)' : '/welcome'} />;
}
