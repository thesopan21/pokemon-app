/**
 * Pokemon Grid Card Component
 * Displays a single Pokemon in grid view with image, name, and types
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

export interface PokemonGridCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
  style?: ViewStyle;
}

const PokemonGridCard = React.forwardRef<View, PokemonGridCardProps>(
  ({ pokemon, onPress, style }, ref) => {
    const styles = createStyles();
    const imageUrl = getPokemonImageUrl(pokemon);

    return (
      <Card
        ref={ref}
        onPress={() => onPress(pokemon)}
        padding="md"
        elevation="md"
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

          {/* Pokemon ID Badge */}
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{pokemon.id.toString().padStart(3, '0')}</Text>
          </View>

          {/* Pokemon Name */}
          <Text style={styles.name} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>

          {/* Pokemon Types */}
          <View style={styles.typesContainer}>
            {pokemon.types.slice(0, 2).map((typeObj, index) => (
              <TypeBadge
                key={index}
                type={typeObj.type.name}
                size="sm"
                style={styles.type}
              />
            ))}
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
      minHeight: 200,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 120,
      backgroundColor: COLORS.surfaceSecondary,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.md,
    },
    image: {
      width: '80%',
      height: '80%',
    },
    idBadge: {
      position: 'absolute',
      top: SPACING.md,
      right: SPACING.md,
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
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
      marginBottom: SPACING.sm,
    },
    typesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.xs,
    },
    type: {
      marginRight: SPACING.xs,
    },
  });

export default PokemonGridCard;
