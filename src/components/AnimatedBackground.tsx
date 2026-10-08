import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../stores/theme';

const { width, height } = Dimensions.get('window');

const FloatingIcon = ({ name, size, initialX, initialY, duration, scaleRange, rotateRange, color }: any) => {
  const moveAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating Up and Down
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: duration,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Endless Rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration * 1.5,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40] // float up 40px
  });

  const scale = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: scaleRange
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: rotateRange
  });

  return (
    <Animated.View style={{
      position: 'absolute',
      left: initialX,
      top: initialY,
      transform: [
        { translateY },
        { scale },
        { rotate },
        { perspective: 1000 } // pseudo 3D perspective
      ]
    }}>
      <Ionicons name={name as any} size={size} color={color} />
    </Animated.View>
  );
};

export const AnimatedBackground = () => {
  const { colors, dark } = useTheme();
  
  // Subtle brand colors for the floating shapes
  const iconColor = dark ? 'rgba(10, 132, 255, 0.08)' : 'rgba(0, 122, 255, 0.04)';
  const secondaryColor = dark ? 'rgba(48, 209, 88, 0.06)' : 'rgba(52, 199, 89, 0.03)';

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background, zIndex: -100, overflow: 'hidden' }]} pointerEvents="none">
      
      {/* MOTO: Speedometer */}
      <FloatingIcon 
        name="speedometer" 
        size={width * 1.2} 
        initialX={-width * 0.4} 
        initialY={-height * 0.1} 
        duration={12000} 
        scaleRange={[0.9, 1.1]}
        rotateRange={['0deg', '15deg']}
        color={iconColor}
      />

      {/* CARE: Shield */}
      <FloatingIcon 
        name="shield-checkmark" 
        size={width * 1.5} 
        initialX={width * 0.1} 
        initialY={height * 0.4} 
        duration={15000} 
        scaleRange={[1, 1.05]}
        rotateRange={['-5deg', '5deg']}
        color={secondaryColor}
      />

      {/* MAINTENANCE: Settings / Gear */}
      <FloatingIcon 
        name="settings" 
        size={width * 0.8} 
        initialX={-width * 0.2} 
        initialY={height * 0.7} 
        duration={18000} 
        scaleRange={[0.8, 1]}
        rotateRange={['0deg', '360deg']}
        color={iconColor}
      />
      
    </View>
  );
};
