import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const getTabBarIcon = (
  filledName: keyof typeof Ionicons.glyphMap,
  outlineName: keyof typeof Ionicons.glyphMap
) => ({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => (
  <Ionicons name={focused ? filledName : outlineName} size={size} color={color} />
);

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Role-plays',
          headerTitleAlign: 'center',
          tabBarIcon: getTabBarIcon('people', 'people-outline'),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          headerTitleAlign: 'center',
          tabBarIcon: getTabBarIcon('chatbubble', 'chatbubble-outline'),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          headerTitleAlign: 'center',
          tabBarIcon: getTabBarIcon('person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}
