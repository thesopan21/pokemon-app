/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      label,
      onPress,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      style,
      textStyle,
      fullWidth = false,
      icon,
    },
    ref
  ) => {
    const styles = createStyles();

    const getVariantStyle = () => {
      switch (variant) {
        case 'secondary':
          return styles.secondaryButton;
        case 'tertiary':
          return styles.tertiaryButton;
        case 'danger':
          return styles.dangerButton;
        case 'primary':
        default:
          return styles.primaryButton;
      }
    };

    const getSizeStyle = () => {
      switch (size) {
        case 'sm':
          return styles.smallButton;
        case 'lg':
          return styles.largeButton;
        case 'md':
        default:
          return styles.mediumButton;
      }
    };

    const getTextVariantStyle = () => {
      switch (variant) {
        case 'secondary':
          return styles.secondaryText;
        case 'tertiary':
          return styles.tertiaryText;
        case 'danger':
          return styles.dangerText;
        case 'primary':
        default:
          return styles.primaryText;
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        disabled={disabled || loading}
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.button,
          getVariantStyle(),
          getSizeStyle(),
          disabled && styles.disabledButton,
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? COLORS.white : COLORS.primary}
            size="small"
          />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={[styles.text, getTextVariantStyle(), getSizeStyle(), textStyle]}>
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const createStyles = () =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.md,
      ...SHADOWS.sm,
    },
    primaryButton: {
      backgroundColor: COLORS.primary,
    },
    secondaryButton: {
      backgroundColor: COLORS.secondary,
    },
    tertiaryButton: {
      backgroundColor: COLORS.background,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    dangerButton: {
      backgroundColor: COLORS.error,
    },
    disabledButton: {
      opacity: 0.5,
    },
    smallButton: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
    },
    mediumButton: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
    },
    largeButton: {
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.xl,
    },
    text: {
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      textAlign: 'center',
    },
    primaryText: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    secondaryText: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    tertiaryText: {
      color: COLORS.text,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    dangerText: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    fullWidth: {
      width: '100%',
    },
  });

export default Button;
