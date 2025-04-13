import { View, StyleSheet, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

export default function TypingBubble({ visible }: { visible: boolean }) {
  // Create three animated values for each dot
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Create the animation sequence
      const animateDots = () => {
        Animated.sequence([
          // Reset opacities
          Animated.timing(dot1Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          // Dot 1 appears
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          // Dot 2 appears
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          // Dot 3 appears
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          // Short pause
          Animated.delay(300),
        ]).start(() => {
          // Loop the animation
          if (visible) {
            animateDots();
          }
        });
      };

      animateDots();
    } else {
      // Reset when not visible
      dot1Opacity.setValue(0);
      dot2Opacity.setValue(0);
      dot3Opacity.setValue(0);
    }
  }, [visible, dot1Opacity, dot2Opacity, dot3Opacity]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[styles.dot, { opacity: dot1Opacity }]}
          />
          <Animated.View
            style={[styles.dot, { opacity: dot2Opacity }]}
          />
          <Animated.View
            style={[styles.dot, { opacity: dot3Opacity }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  bubble: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
    minWidth: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 2,
  },
});