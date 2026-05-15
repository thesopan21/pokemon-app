/**
 * Pokemon List Card Component
 * Displays a single Pokemon in list view with details
 */

import Card from '@/components/Card';
import TypeBadge from '@/components/TypeBadge';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import { Pokemon } from '@/types/pokemon';
import { capitalize, getPokemonImageUrlById } from '@/utils/pokemon';
import { Image } from 'expo-image';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

export interface PokemonListCardProps {
  pokemon: Partial<Pokemon> & { id: number; name: string };
  onPress: (pokemonId: number) => void;
  style?: ViewStyle;
}

const PokemonListCard = React.forwardRef<View, PokemonListCardProps>(
  ({ pokemon, onPress, style }, ref) => {
    const styles = createStyles();
    const imageUrl = getPokemonImageUrlById(pokemon.id);

    return (
      <Card
        ref={ref}
        onPress={() => onPress(pokemon.id)}
        padding="md"
        elevation="sm"
        style={[styles.card, style]}
        borderRadius="lg"
      >
        <View style={styles.container}>
          {/* Pokemon Image */}
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="contain"
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]} />
            )}
          </View>

          {/* Pokemon Info */}
          <View style={styles.infoContainer}>
            {/* ID and Name */}
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.id}>#{pokemon.id ? pokemon.id.toString().padStart(3, '0') : '???'}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {capitalize(pokemon.name)}
                </Text>
              </View>

              {/* Arrow Icon */}
              <Text style={styles.arrow}>›</Text>
            </View>

            {/* Types */}
            <View style={styles.typesContainer}>
              {pokemon.types && pokemon.types.length > 0
                ? pokemon.types.map((typeObj: any, index: number) => (
                  <TypeBadge
                    key={index}
                    type={typeObj.type.name}
                    size="sm"
                    style={styles.type}
                  />
                ))
                : null}
            </View>

            {/* Stats Preview */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>HP</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats && pokemon.stats[0]?.base_stat || 0}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>ATK</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats && pokemon.stats[1]?.base_stat || 0}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>DEF</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats && pokemon.stats[2]?.base_stat || 0}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SPD</Text>
                <Text style={styles.statValue}>
                  {pokemon.stats && pokemon.stats[5]?.base_stat || 0}
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
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.md,
      marginRight: SPACING.md,
      marginBottom: 0,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      backgroundColor: COLORS.border,
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
