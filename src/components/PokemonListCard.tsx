/**
 * Pokemon List Card Component
 * Displays a single Pokemon in list view with details
 */

import { Card, TypeBadge } from '@/components';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import { Pokemon } from '@/types/pokemon';
import { capitalize, getPokemonImageUrl } from '@/utils/pokemon';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

export interface PokemonListCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
  style?: ViewStyle;
}

const PokemonListCard = React.forwardRef<View, PokemonListCardProps>(
  ({ pokemon, onPress, style }, ref) => {
    const styles = createStyles();
    const imageUrl = getPokemonImageUrl(pokemon);

    return (
      <Card
        ref={ref}
        onPress={() => onPress(pokemon)}
        padding="md"
        elevation="sm"
        style={[styles.card, style]}
        borderRadius="lg"
      >
        <View style={styles.container}>
          {/* Pokemon Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Pokemon Info */}
          <View style={styles.infoContainer}>
            {/* ID and Name */}
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {capitalize(pokemon.name)}
                </Text>
              </View>

              {/* Arrow Icon */}
              <Text style={styles.arrow}>›</Text>
            </View>

            {/* Types */}
            <View style={styles.typesContainer}>
              {pokemon.types.map((typeObj, index) => (
                <TypeBadge
                  key={index}
                  type={typeObj.type.name}
                  size="sm"
                  style={styles.type}
                />
              ))}
            </View>

            {/* Stats Preview */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>HP</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats[0]?.base_stat || 0}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>ATK</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats[1]?.base_stat || 0}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>DEF</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats[2]?.base_stat || 0}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SPD</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats[5]?.base_stat || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  }
);

PokemonListCard.displayName = 'PokemonListCard';

const createStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      marginBottom: SPACING.md,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    imageContainer: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.surfaceSecondary,
      borderRadius: BORDER_RADIUS.md,
      marginRight: SPACING.md,
      marginBottom: 0,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    infoContainer: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    id: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      marginBottom: SPACING.xs,
    },
    name: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
    },
    arrow: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      color: COLORS.textTertiary,
      marginRight: SPACING.sm,
    },
    typesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.xs,
      marginBottom: SPACING.sm,
    },
    type: {
      marginRight: SPACING.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    statItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      marginBottom: SPACING.xs,
    },
    statValue: {
      fontSize: TYPOGRAPHY.fontSize.base,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.primary,
    },
  });

export default PokemonListCard;
