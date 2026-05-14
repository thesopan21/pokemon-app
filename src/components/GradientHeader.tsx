/**
 * Gradient Header Component
 * Premium gradient header for visual polish
 */

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

const GradientHeader = React.forwardRef<View, GradientHeaderProps>(
  (
    {
      title,
      subtitle,
      style,
      titleStyle,
    },
    ref
  ) => {
    const styles = createStyles();

    return (
      <View ref={ref} style={[styles.container, style]}>
        {/* Background gradient effect */}
        <View style={styles.gradientBg} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>

        {/* Decorative elements */}
        <View style={styles.decorative} />
      </View>
    );
  }
);

GradientHeader.displayName = 'GradientHeader';

const createStyles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xl,
      borderBottomLeftRadius: BORDER_RADIUS.lg,
      borderBottomRightRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      position: 'relative',
    },
    gradientBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: COLORS.primaryDark,
      opacity: 0.1,
    },
    content: {
      position: 'relative',
      zIndex: 1,
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize['2xl'],
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.white,
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.fontSize.base,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: TYPOGRAPHY.fontWeight.regular,
    },
    decorative: {
      position: 'absolute',
      bottom: -20,
      right: -30,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  });

export default GradientHeader;
