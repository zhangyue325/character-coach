import { useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
  } from 'react-native';

  export default function ChatScreen() {
    const { id, character_id } = useLocalSearchParams();
  
    return (
      <View>
        <Text>Role-play ID: {id}</Text>
        <Text>Character ID: {character_id}</Text>
      </View>
    );
  }
  