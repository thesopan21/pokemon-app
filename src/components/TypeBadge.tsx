/**
 * Type Badge Component
 * Display Pokemon types with their corresponding colors
 */

import { TYPE_COLORS } from '@/constants/config';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '@/theme';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export interface TypeBadgeProps {
  type: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

const TypeBadge = React.forwardRef<View, TypeBadgeProps>(
  (
    {
      type,
      style,
      textStyle,
      size = 'md',
    },
    ref
  ) => {
    const styles = createStyles();

    // Normalize type to lowercase
    const normalizedType = type.toLowerCase();

    // Get type colors, fallback to default if type not found
    const typeColor = TYPE_COLORS[normalizedType as keyof typeof TYPE_COLORS] || {
      bg: '#A8A878',
      text: '#FFFFFF',
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            paddingHorizontal: SPACING.sm,
            paddingVertical: SPACING.xs,
            fontSize: TYPOGRAPHY.fontSize.xs,
          };
        case 'lg':
          return {
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.md,
            fontSize: TYPOGRAPHY.fontSize.base,
          };
        case 'md':
        default:
          return {
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            fontSize: TYPOGRAPHY.fontSize.sm,
          };
      }
    };

    const sizeStyles = getSizeStyles();

    return (
      <View
        ref={ref}
        style={[
          styles.badge,
          {
            backgroundColor: typeColor.bg,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: typeColor.text,
              fontSize: sizeStyles.fontSize,
            },
            textStyle,
          ]}
        >
          {normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)}
        </Text>
      </View>
    );
  }
);

TypeBadge.displayName = 'TypeBadge';

const createStyles = () =>
  StyleSheet.create({
    badge: {
      borderRadius: BORDER_RADIUS.full,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    text: {
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      textAlign: 'center',
    },
  });

export default TypeBadge;
