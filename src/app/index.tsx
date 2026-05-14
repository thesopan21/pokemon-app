/**
 * Home Page
 * Main page with Pokemon list, filter, and detail modal
 */

import { FilterScreen, HomeScreen, PokemonDetailScreen } from '@/screens';
import { COLORS } from '@/theme';
import { Pokemon } from '@/types/pokemon';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  // Modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Handle Pokemon card press
  const handlePokemonPress = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setShowDetailModal(true);
  };

  // Handle filter type selection
  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setShowFilterModal(false);
  };

  // Handle close detail modal
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedPokemon(null);
  };

  // Handle close filter modal
  const handleCloseFilter = () => {
    setShowFilterModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Home Screen */}
      <HomeScreen
        onPokemonPress={handlePokemonPress}
        onFilterPress={() => setShowFilterModal(true)}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseFilter}
      >
        <FilterScreen
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
          onClose={handleCloseFilter}
        />
      </Modal>

      {/* Pokemon Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseDetail}
      >
        {selectedPokemon && (
          <PokemonDetailScreen
            pokemonId={selectedPokemon.id}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
