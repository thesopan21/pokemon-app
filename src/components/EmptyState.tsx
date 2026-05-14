/**
 * Empty State Component
 * Display when no data is available
 */

import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  style?: ViewStyle;
}

const EmptyState = React.forwardRef<View, EmptyStateProps>(
  (
    {
      title,
      description,
      icon = '📦',
      style,
    },
    ref
  ) => {
    const styles = createStyles();

    return (
      <View ref={ref} style={[styles.container, style]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    );
  }
);

EmptyState.displayName = 'EmptyState';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 300,
      paddingHorizontal: SPACING.lg,
    },
    icon: {
      fontSize: 64,
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    description: {
      fontSize: TYPOGRAPHY.fontSize.base,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: TYPOGRAPHY.lineHeight.relaxed,
    },
  });

export default EmptyState;
