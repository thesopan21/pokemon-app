/**
 * Home Screen
 * Main home page displaying Pokemon with search, filter, and view toggle
 */

import { useGetPokemonByTypeQuery } from '@/api/pokemonByTypeSlice';
import { useGetPokemonListQuery } from '@/api/pokemonListSlice';
import { PokemonGridCard, PokemonListCard, SearchInput, SkeletonList } from '@/components';
import { PAGINATION } from '@/constants/config';
import { useDebounce } from '@/hooks';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';
import { Pokemon } from '@/types/pokemon';
import { getPokemonIdFromUrl } from '@/utils/pokemon';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface HomeScreenProps {
  onPokemonPress: (pokemonId: string | number) => void;
  onFilterPress: () => void;
  selectedType?: string | null;
}

// Pokemon representation for list view (minimal data)
interface ListPokemon extends Partial<Pokemon> {
  id: number;
  name: string;
  url: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onPokemonPress,
  onFilterPress,
  selectedType,
}) => {
  const styles = createStyles();

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Pagination state
  const [offset, setOffset] = useState<number>(PAGINATION.INITIAL_OFFSET);
  const [allPokemon, setAllPokemon] = useState<ListPokemon[]>([]);

  // API calls - Pokemon list (default)
  const {
    data: pokemonListData,
    isLoading: isLoadingList,
    isFetching: isFetchingList,
    error: listError,
    refetch: refetchList,
  } = useGetPokemonListQuery(
    {
      limit: PAGINATION.DEFAULT_LIMIT,
      offset,
    },
    {
      skip: !!selectedType, // Skip when type is selected
    }
  );



  // API calls - Pokemon by type (when filter is active)
  const {
    data: pokemonTypeData,
    isLoading: isLoadingType,
    isFetching: isFetchingType,
    error: typeError,
  } = useGetPokemonByTypeQuery(selectedType || '', {
    skip: !selectedType, // Skip when no type selected
  });

  // Determine which data to use
  const isLoading = selectedType ? isLoadingType : isLoadingList;
  const isFetching = selectedType ? isFetchingType : isFetchingList;
  const error = selectedType ? typeError : listError;
  const pokemonListDataRef = selectedType ? null : pokemonListData;

  // Track if we've reached end of pagination
  const hasMoreData = pokemonListDataRef?.next !== null && pokemonListDataRef?.next !== undefined;

  // Handle new data from API - List view
  React.useEffect(() => {
    if (!selectedType && pokemonListData?.results) {
      const convertedResults: ListPokemon[] = pokemonListData.results.map((result) => ({
        id: getPokemonIdFromUrl(result.url),
        name: result.name,
        url: result.url,
      }));

      if (offset === 0) {
        // Reset on first page
        setAllPokemon(convertedResults);
      } else {
        // Append new results
        setAllPokemon((prev) => [...prev, ...convertedResults]);
      }
    }
  }, [pokemonListData, offset, selectedType]);

  // Handle new data from API - Type view
  React.useEffect(() => {
    if (selectedType && pokemonTypeData?.pokemon) {
      const convertedResults: ListPokemon[] = pokemonTypeData.pokemon.map((item) => ({
        id: getPokemonIdFromUrl(item.pokemon.url),
        name: item.pokemon.name,
        url: item.pokemon.url,
      }));

      // Type data comes all at once, so always reset
      setAllPokemon(convertedResults);
      setOffset(PAGINATION.INITIAL_OFFSET);
    }
  }, [pokemonTypeData, selectedType]);

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
    if (selectedType) {
      // Type view doesn't need refresh - data comes all at once
      return;
    }
    setOffset(PAGINATION.INITIAL_OFFSET);
    setAllPokemon([]);
    await refetchList();
  }, [refetchList, selectedType]);

  // Handle load more (infinite scroll)
  const handleLoadMore = useCallback(() => {
    if (selectedType) {
      // Type view doesn't have pagination
      return;
    }

    // Only load more if:
    // 1. Not already loading
    // 2. There's a next page (hasMoreData)
    // 3. Total loaded is less than total count
    if (
      !isLoadingList &&
      !isFetchingList &&
      hasMoreData &&
      allPokemon.length < (pokemonListDataRef?.count || 0)
    ) {
      setOffset((prev) => prev + PAGINATION.DEFAULT_LIMIT);
    }
  }, [isLoadingList, isFetchingList, hasMoreData, allPokemon.length, pokemonListDataRef?.count, selectedType]);

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
  const renderItem = ({ item }: { item: ListPokemon }) => {
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
    <SafeAreaView style={styles.container}>
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

      {/* Result count and active filter */}
      <View style={styles.resultInfo}>
        <Text style={styles.resultCount}>
          {selectedType && (
            <>
              <Text style={styles.filterTag}>
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
              </Text>
              {' '}
            </>
          )}
          Showing {filteredPokemon.length} Pokemon
          {!selectedType && pokemonListDataRef?.count
            ? ` of ${pokemonListDataRef.count}`
            : null}
        </Text>
      </View>

      {isLoading && allPokemon.length === 0 ? (
        <SkeletonList count={6} />
      ) : (
        <FlatList
          key={`flatlist-${viewMode}`}
          data={filteredPokemon}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          numColumns={numColumns}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.content}
          columnWrapperStyle={
            viewMode === 'grid' ? { gap: SPACING.lg, marginBottom: SPACING.lg } : undefined
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
};

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
      paddingVertical: SPACING.lg,
      borderBottomWidth: 0,
    },
    headerActions: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginTop: SPACING.lg,
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
      paddingVertical: SPACING.md,
      borderBottomWidth: 0,
    },
    resultCount: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    filterTag: {
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      color: COLORS.primary,
      paddingHorizontal: SPACING.xs,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: COLORS.primaryLight + '20',
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
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
