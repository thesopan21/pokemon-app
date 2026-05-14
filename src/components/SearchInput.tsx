/**
 * Search Input Component
 * Reusable search input with icon and styling
 */

import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/theme';
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export interface SearchInputProps extends TextInputProps {
  onClear?: () => void;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasValue?: boolean;
}

const SearchInput = React.forwardRef<TextInput, SearchInputProps>(
  (
    {
      onClear,
      style,
      leftIcon,
      rightIcon,
      hasValue = false,
      placeholder = 'Search Pokémon...',
      ...props
    },
    ref
  ) => {
    const styles = createStyles();

    return (
      <View style={[styles.container, style]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          {...props}
        />

        {hasValue && onClear ? (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon || <View style={styles.closeIcon} />}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
    );
  }
);

SearchInput.displayName = 'SearchInput';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: SPACING.md,
      ...SHADOWS.sm,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.base,
      color: COLORS.text,
      fontWeight: TYPOGRAPHY.fontWeight.regular,
    },
    inputWithLeftIcon: {
      marginLeft: SPACING.sm,
    },
    leftIcon: {
      marginRight: SPACING.sm,
    },
    rightIcon: {
      marginLeft: SPACING.sm,
      padding: SPACING.xs,
    },
    closeIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: COLORS.textTertiary,
    },
  });

export default SearchInput;
