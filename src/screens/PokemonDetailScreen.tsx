/**
 * Pokemon Detail Screen
 * Displays comprehensive information about a specific Pokemon
 */

import { useGetPokemonDetailQuery } from '@/api/pokemonDetailSlice';
import { Card, TypeBadge } from '@/components';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import {
  capitalize,
  formatAbilityName,
  formatHeight,
  formatStatName,
  formatWeight,
  getPokemonImageUrl,
  getStatColor,
  getStatPercentage,
} from '@/utils/pokemon';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface PokemonDetailScreenProps {
  pokemonId: string | number;
  onClose: () => void;
}

const PokemonDetailScreen = React.forwardRef<View, PokemonDetailScreenProps>(
  ({ pokemonId, onClose }, ref) => {
    const styles = createStyles();

    // Fetch Pokemon detail
    const { data: pokemon, isLoading, error } = useGetPokemonDetailQuery(pokemonId);

    const imageUrl = useMemo(() => {
      return getPokemonImageUrl(pokemon || null);
    }, [pokemon]);

    // Render loading state
    if (isLoading) {
      return (
        <SafeAreaView style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </SafeAreaView>
      );
    }

    // Render error state
    if (error || !pokemon) {
      return (
        <SafeAreaView style={[styles.container, styles.errorContainer]}>
          <Text style={styles.errorText}>Failed to load Pokemon details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={[styles.container, { ref }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Close Button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{capitalize(pokemon.name)}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Pokemon Image and ID */}
          <View style={styles.imageSection}>
            <Card elevation="lg" padding="lg" style={styles.imageCard}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            </Card>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>
                #{pokemon.id.toString().padStart(3, '0')}
              </Text>
            </View>
          </View>

          {/* Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type</Text>
            <View style={styles.typesContainer}>
              {pokemon.types.map((typeObj, index) => (
                <TypeBadge
                  key={index}
                  type={typeObj.type.name}
                  size="md"
                  style={styles.typeBadge}
                />
              ))}
            </View>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Info</Text>
            <Card padding="md" elevation="sm">
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Height</Text>
                  <Text style={styles.infoValue}>{formatHeight(pokemon.height)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Weight</Text>
                  <Text style={styles.infoValue}>{formatWeight(pokemon.weight)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Base Exp</Text>
                  <Text style={styles.infoValue}>{pokemon.base_experience}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Order</Text>
                  <Text style={styles.infoValue}>{pokemon.order}</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            <Card padding="md" elevation="sm">
              {pokemon.stats.map((stat, index) => (
                <View key={index} style={[styles.statRow, index !== pokemon.stats.length - 1 && styles.statRowBorder]}>
                  <Text style={styles.statName}>{formatStatName(stat.stat.name)}</Text>
                  <View style={styles.statBarContainer}>
                    <View
                      style={[
                        styles.statBar,
                        {
                          width: `${getStatPercentage(stat.base_stat)}%`,
                          backgroundColor: getStatColor(getStatPercentage(stat.base_stat)),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statValue}>{stat.base_stat}</Text>
                </View>
              ))}
            </Card>
          </View>

          {/* Abilities */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Abilities</Text>
              <Card padding="md" elevation="sm">
                {pokemon.abilities.map((ability, index) => (
                  <View
                    key={index}
                    style={[
                      styles.abilityRow,
                      index !== pokemon.abilities.length - 1 && styles.abilityRowBorder,
                    ]}
                  >
                    <View style={styles.abilityInfo}>
                      <Text style={styles.abilityName}>
                        {formatAbilityName(ability.ability.name)}
                      </Text>
                      {ability.is_hidden && (
                        <Text style={styles.hiddenBadge}>Hidden</Text>
                      )}
                    </View>
                  </View>
                ))}
              </Card>
            </View>
          )}

          {/* Moves */}
          {pokemon.moves && pokemon.moves.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Moves ({pokemon.moves.slice(0, 10).length} shown)
              </Text>
              <Card padding="md" elevation="sm">
                <View style={styles.movesGrid}>
                  {pokemon.moves.slice(0, 10).map((move, index) => (
                    <View
                      key={index}
                      style={styles.moveChip}
                    >
                      <Text style={styles.moveName} numberOfLines={1}>
                        {capitalize(move.move.name)}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
);

PokemonDetailScreen.displayName = 'PokemonDetailScreen';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    errorText: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      color: COLORS.error,
      marginBottom: SPACING.lg,
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
    },
    closeButtonText: {
      color: COLORS.white,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingBottom: SPACING.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.surfaceSecondary,
    },
    backIcon: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      color: COLORS.text,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    headerTitle: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
      flex: 1,
      textAlign: 'center',
    },
    placeholder: {
      width: 40,
    },
    imageSection: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
      position: 'relative',
    },
    imageCard: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.surfaceSecondary,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    idBadge: {
      position: 'absolute',
      top: SPACING.xl,
      right: SPACING.xl,
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.full,
    },
    idText: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.white,
    },
    section: {
      paddingHorizontal: SPACING.lg,
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    typesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
    },
    typeBadge: {
      marginRight: SPACING.xs,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
    },
    infoItem: {
      flex: 1,
      minWidth: '48%',
    },
    infoLabel: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      marginBottom: SPACING.xs,
    },
    infoValue: {
      fontSize: TYPOGRAPHY.fontSize.base,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
    },
    statRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    statName: {
      width: 60,
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      color: COLORS.text,
    },
    statBarContainer: {
      flex: 1,
      height: 6,
      backgroundColor: COLORS.border,
      borderRadius: 3,
      marginHorizontal: SPACING.md,
      overflow: 'hidden',
    },
    statBar: {
      height: '100%',
      borderRadius: 3,
    },
    statValue: {
      width: 30,
      textAlign: 'right',
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.text,
    },
    abilityRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.md,
    },
    abilityRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    abilityInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
    },
    abilityName: {
      fontSize: TYPOGRAPHY.fontSize.base,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      color: COLORS.text,
    },
    hiddenBadge: {
      backgroundColor: COLORS.warning,
      color: COLORS.white,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      overflow: 'hidden',
    },
    movesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    moveChip: {
      backgroundColor: COLORS.secondary,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.full,
      marginBottom: SPACING.sm,
    },
    moveName: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      color: COLORS.white,
      maxWidth: 100,
    },
  });

export default PokemonDetailScreen;
