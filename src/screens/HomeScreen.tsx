/**
 * Home Screen
 * Main home page displaying Pokemon with search, filter, and view toggle
 */

import { useGetPokemonListQuery } from '@/api/pokemonListSlice';
import { PokemonGridCard, PokemonListCard, SearchInput, SkeletonGrid, SkeletonList } from '@/components';
import { PAGINATION } from '@/constants/config';
import { useDebounce } from '@/hooks';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import { Pokemon } from '@/types/pokemon';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export interface HomeScreenProps {
  onPokemonPress: (pokemon: Pokemon) => void;
  onFilterPress: () => void;
}

interface PokemonWithDetails extends Pokemon {
  url?: string;
}

const HomeScreen = React.forwardRef<View, HomeScreenProps>(
  ({ onPokemonPress, onFilterPress }, ref) => {
    const styles = createStyles();

    // View mode state
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Pagination state
    const [offset, setOffset] = useState(PAGINATION.INITIAL_OFFSET);
    const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);

    // API calls
    const {
      data: pokemonListData,
      isLoading,
      isFetching,
      error,
      refetch,
    } = useGetPokemonListQuery({
      limit: PAGINATION.DEFAULT_LIMIT,
      offset,
    });

    // Handle new data from API
    React.useEffect(() => {
      if (pokemonListData?.results) {
        if (offset === 0) {
          // Reset on first page
          setAllPokemon(pokemonListData.results as any);
        } else {
          // Append new results
          setAllPokemon((prev) => [...prev, ...(pokemonListData.results as any)]);
        }
      }
    }, [pokemonListData, offset]);

    // Filter Pokemon based on search query
    const filteredPokemon = useMemo(() => {
      if (!debouncedSearchQuery.trim()) {
        return allPokemon;
      }

      const lowerQuery = debouncedSearchQuery.toLowerCase();
      return allPokemon.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(lowerQuery) ||
          pokemon.id.toString().includes(lowerQuery)
      );
    }, [allPokemon, debouncedSearchQuery]);

    // Handle pull to refresh
    const handleRefresh = useCallback(async () => {
      setOffset(PAGINATION.INITIAL_OFFSET);
      setAllPokemon([]);
      await refetch();
    }, [refetch]);

    // Handle load more (infinite scroll)
    const handleLoadMore = useCallback(() => {
      if (
        !isLoading &&
        !isFetching &&
        pokemonListData?.next &&
        allPokemon.length < pokemonListData.count
      ) {
        setOffset((prev) => prev + PAGINATION.DEFAULT_LIMIT);
      }
    }, [isLoading, isFetching, pokemonListData, allPokemon.length]);

    // Clear search
    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
    }, []);

    // Render empty state
    const renderEmpty = () => {
      if (isLoading && allPokemon.length === 0) {
        return null; // Show skeleton instead
      }

      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {filteredPokemon.length === 0
              ? 'No Pokemon found'
              : 'No Pokemon available'}
          </Text>
        </View>
      );
    };

    // Render footer with loading indicator
    const renderFooter = () => {
      if (!isFetching) return null;
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    };

    // Render Pokemon item
    const renderItem = ({ item }: { item: Pokemon }) => {
      if (viewMode === 'grid') {
        return (
          <View style={styles.gridItem}>
            <PokemonGridCard
              pokemon={item}
              onPress={onPokemonPress}
            />
          </View>
        );
      }

      return (
        <PokemonListCard
          pokemon={item}
          onPress={onPokemonPress}
        />
      );
    };

    // Determine number of columns based on view mode
    const numColumns = viewMode === 'grid' ? 2 : 1;

    return (
      <SafeAreaView style={[styles.container, { ref }]}>
        {/* Header with search and filter */}
        <View style={styles.header}>
          <SearchInput
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            hasValue={searchQuery.length > 0}
            onClear={handleClearSearch}
          />

          {/* Filter and View Toggle */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.viewToggle}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Text style={styles.viewToggleIcon}>
                {viewMode === 'grid' ? '≡' : '⊞'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={onFilterPress}
            >
              <Text style={styles.filterIcon}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Result count */}
        {filteredPokemon.length > 0 && (
          <View style={styles.resultInfo}>
            <Text style={styles.resultCount}>
              Showing {filteredPokemon.length} Pokemon
              {pokemonListData?.count
                ? ` of ${pokemonListData.count}`
                : ''}
            </Text>
          </View>
        )}

        {/* Pokemon List */}
        {isLoading && allPokemon.length === 0 ? (
          <View style={styles.content}>
            {viewMode === 'grid' ? (
              <SkeletonGrid count={6} columns={2} />
            ) : (
              <SkeletonList count={6} />
            )}
          </View>
        ) : (
          <FlatList
            ref={ref}
            data={filteredPokemon}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
            numColumns={numColumns}
            key={numColumns} // Force re-render when changing columns
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.content}
            columnWrapperStyle={
              viewMode === 'grid' ? { gap: SPACING.md } : undefined
            }
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary}
              />
            }
            scrollEnabled={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
          />
        )}

        {/* Error state */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Failed to load Pokemon. Please try again.
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
);

HomeScreen.displayName = 'HomeScreen';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      backgroundColor: COLORS.white,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    headerActions: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginTop: SPACING.md,
    },
    searchInput: {
      flex: 1,
    },
    viewToggle: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: COLORS.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewToggleIcon: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      color: COLORS.text,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    filterButton: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterIcon: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      color: COLORS.white,
      fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    resultInfo: {
      backgroundColor: COLORS.white,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    resultCount: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    gridItem: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
    },
    emptyText: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      color: COLORS.textSecondary,
      textAlign: 'center',
    },
    footerContainer: {
      paddingVertical: SPACING.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      backgroundColor: COLORS.error,
      padding: SPACING.lg,
      marginHorizontal: SPACING.lg,
      marginBottom: SPACING.lg,
      borderRadius: 8,
    },
    errorText: {
      color: COLORS.white,
      textAlign: 'center',
      fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
  });

export default HomeScreen;
