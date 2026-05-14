/**
 * Filter Screen (Bottom Sheet)
 * Display Pokemon types with single-selection checkboxes
 */

import { useGetPokemonTypesQuery } from '@/api/pokemonTypeSlice';
import { Button, Checkbox, Skeleton } from '@/components';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import { TypeResult } from '@/types/pokemon';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

export interface FilterScreenProps {
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
  onClose: () => void;
  style?: ViewStyle;
}

const FilterScreen = React.forwardRef<View, FilterScreenProps>(
  ({ selectedType, onTypeSelect, onClose, style }, ref) => {
    const styles = createStyles();

    // Fetch types
    const { data: typesData, isLoading } = useGetPokemonTypesQuery();

    // Local state for selected type
    const [localSelected, setLocalSelected] = useState<string | null>(selectedType);

    // Update local state when prop changes
    useEffect(() => {
      setLocalSelected(selectedType);
    }, [selectedType]);

    // Handle type selection (single selection only)
    const handleTypeSelect = useCallback((typeName: string | null) => {
      if (localSelected === typeName) {
        // Deselect if clicking the same type
        setLocalSelected(null);
      } else {
        // Select new type
        setLocalSelected(typeName);
      }
    }, [localSelected]);

    // Handle apply filter
    const handleApplyFilter = useCallback(() => {
      onTypeSelect(localSelected);
      onClose();
    }, [localSelected, onTypeSelect, onClose]);

    // Handle reset filter
    const handleResetFilter = useCallback(() => {
      setLocalSelected(null);
    }, []);

    // Render type item
    const renderTypeItem = ({ item }: { item: TypeResult }) => {
      const isSelected = localSelected === item.name;

      return (
        <Checkbox
          label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          checked={isSelected}
          onChange={() => handleTypeSelect(item.name)}
          size="md"
        />
      );
    };

    // Render skeleton loader
    const renderSkeleton = () => {
      return (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              width="100%"
              height={44}
              borderRadius={BORDER_RADIUS.md}
              style={{ marginBottom: SPACING.md }}
            />
          ))}
        </View>
      );
    };

    return (
      <SafeAreaView style={[styles.container, style]} ref={ref}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter by Type</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            {/* "All" Option */}
            <View style={styles.allOptionContainer}>
              <Checkbox
                label="All Pokemon"
                checked={localSelected === null}
                onChange={() => handleTypeSelect(null)}
                size="md"
              />
              <Text style={styles.allOptionDescription}>
                Show all Pokemon types
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Types List */}
            <FlatList
              data={typesData?.results || []}
              renderItem={renderTypeItem}
              keyExtractor={(item) => item.name}
              scrollEnabled={true}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="Reset"
            onPress={handleResetFilter}
            variant="tertiary"
            size="md"
            style={{ flex: 1 }}
          />
          <Button
            label="Apply"
            onPress={handleApplyFilter}
            variant="primary"
            size="md"
            style={{ flex: 1, marginLeft: SPACING.md }}
          />
        </View>
      </SafeAreaView>
    );
  }
);

FilterScreen.displayName = 'FilterScreen';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.white,
    },
    headerTitle: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
    },
    closeIcon: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.border,
    },
    allOptionContainer: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
      backgroundColor: COLORS.surfaceSecondary,
    },
    allOptionDescription: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.regular,
      marginTop: SPACING.sm,
      marginLeft: 44, // Align with checkbox
    },
    listContent: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    separator: {
      height: 1,
      backgroundColor: COLORS.borderLight,
      marginVertical: SPACING.xs,
    },
    skeletonContainer: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    actions: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
      backgroundColor: COLORS.white,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      gap: SPACING.md,
    },
  });

export default FilterScreen;
