/**
 * Checkbox Component
 * Reusable checkbox with label and styling
 */

import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox = React.forwardRef<View, CheckboxProps>(
  (
    {
      label,
      checked,
      onChange,
      disabled = false,
      style,
      size = 'md',
    },
    ref
  ) => {
    const styles = createStyles();

    const getCheckboxSize = () => {
      switch (size) {
        case 'sm':
          return { width: 18, height: 18, borderRadius: 4 };
        case 'lg':
          return { width: 26, height: 26, borderRadius: 6 };
        case 'md':
        default:
          return { width: 22, height: 22, borderRadius: 5 };
      }
    };

    const getLabelSize = () => {
      switch (size) {
        case 'sm':
          return TYPOGRAPHY.fontSize.sm;
        case 'lg':
          return TYPOGRAPHY.fontSize.lg;
        case 'md':
        default:
          return TYPOGRAPHY.fontSize.base;
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        onPress={() => !disabled && onChange(!checked)}
        activeOpacity={0.7}
        style={[styles.container, disabled && styles.disabled, style]}
      >
        <View
          style={[
            styles.checkbox,
            getCheckboxSize(),
            checked && styles.checked,
          ]}
        >
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[
            styles.label,
            { fontSize: getLabelSize() },
            checked && styles.labelChecked,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
);

Checkbox.displayName = 'Checkbox';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
    },
    checkbox: {
      borderWidth: 2,
      borderColor: COLORS.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
      backgroundColor: COLORS.white,
    },
    checked: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    checkmark: {
      color: COLORS.white,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    label: {
      flex: 1,
      color: COLORS.text,
      fontWeight: TYPOGRAPHY.fontWeight.regular,
    },
    labelChecked: {
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      color: COLORS.primary,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default Checkbox;
