import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

export default function TypingBubble() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const createAnimation = (dot: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    );

  useEffect(() => {
    createAnimation(dot1, 0).start();
    createAnimation(dot2, 150).start();
    createAnimation(dot3, 300).start();
  }, []);

  return (
    <View style={[styles.bubble, styles.ai]}>
      <View style={styles.dotWrapper}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
    maxWidth: '50%',
    marginLeft: 10,
    marginVertical: 4,
  },
  ai: {
    backgroundColor: '#f1f0f0',
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#888',
    marginHorizontal: 3,
  },
});
