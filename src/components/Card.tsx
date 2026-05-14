/**
 * Card Component
 * Reusable card component for displaying content with elevation and styling
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '@/theme';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  borderRadius?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Card = React.forwardRef<View, CardProps>(
  (
    {
      children,
      onPress,
      style,
      elevation = 'md',
      padding = 'md',
      backgroundColor = COLORS.white,
      borderRadius = 'md',
      disabled = false,
    },
    ref
  ) => {
    const styles = createStyles();

    const elevationStyle = () => {
      switch (elevation) {
        case 'sm':
          return SHADOWS.sm;
        case 'lg':
          return SHADOWS.lg;
        case 'xl':
          return SHADOWS.xl;
        case 'md':
        default:
          return SHADOWS.md;
      }
    };

    const paddingStyle = () => {
      switch (padding) {
        case 'sm':
          return { padding: SPACING.sm };
        case 'lg':
          return { padding: SPACING.lg };
        case 'md':
        default:
          return { padding: SPACING.md };
      }
    };

    const radiusStyle = () => {
      switch (borderRadius) {
        case 'sm':
          return { borderRadius: BORDER_RADIUS.sm };
        case 'lg':
          return { borderRadius: BORDER_RADIUS.lg };
        case 'md':
        default:
          return { borderRadius: BORDER_RADIUS.md };
      }
    };

    const cardStyle = [
      styles.card,
      paddingStyle(),
      radiusStyle(),
      elevationStyle(),
      { backgroundColor },
      onPress && styles.pressable,
      disabled && styles.disabled,
      style,
    ];

    const content = <View ref={ref}>{children}</View>;

    if (onPress && !disabled) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={cardStyle}
        >
          {children}
        </TouchableOpacity>
      );
    }

    return <View ref={ref} style={cardStyle}>{children}</View>;
  }
);

Card.displayName = 'Card';

const createStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
    },
    pressable: {
      opacity: 1,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default Card;
