/**
 * Pokemon Grid Card Component
 * Displays a single Pokemon in grid view with image, name, and types
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

export interface PokemonGridCardProps {
  pokemon: Partial<Pokemon> & { id: number; name: string };
  onPress: (pokemonId: number) => void;
  style?: ViewStyle;
}

const PokemonGridCard = React.forwardRef<View, PokemonGridCardProps>(
  ({ pokemon, onPress, style }, ref) => {
    const styles = createStyles();

    return (
      <Card
        ref={ref}
        onPress={() => onPress(pokemon.id)}
        padding="md"
        elevation="md"
        style={[styles.card, style]}
        borderRadius="lg"
      >
        <View style={styles.container}>
          {/* Pokemon Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getPokemonImageUrlById(pokemon.id) }}
              style={styles.image}
              contentFit="contain"
            />
          </View>

          {/* Pokemon ID Badge */}
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{pokemon.id ? pokemon.id.toString().padStart(3, '0') : '???'}</Text>
          </View>

          {/* Pokemon Name */}
          <Text style={styles.name} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>

          {/* Pokemon Types */}
          <View style={styles.typesContainer}>
            {pokemon.types && pokemon.types.length > 0
              ? pokemon.types.slice(0, 2).map((typeObj: any, index: number) => (
                <TypeBadge
                  key={index}
                  type={typeObj.type.name}
                  size="sm"
                  style={styles.type}
                />
              ))
              : null}
          </View>
        </View>
      </Card>
    );
  }
);

PokemonGridCard.displayName = 'PokemonGridCard';

const createStyles = () =>
  StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 240,
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
    },
    container: {
      flex: 1,
      padding: SPACING.md,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 140,
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.lg,
    },
    image: {
      width: '95%',
      height: '95%',
    },
    imagePlaceholder: {
      backgroundColor: COLORS.border,
    },
    idBadge: {
      position: 'absolute',
      top: SPACING.lg,
      right: SPACING.lg,
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
    },
    idText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.white,
    },
    name: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    typesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    type: {
      marginRight: SPACING.xs,
    },
  });

export default PokemonGridCard;
