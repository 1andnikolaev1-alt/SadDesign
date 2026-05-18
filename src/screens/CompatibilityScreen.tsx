import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { PLANTS, checkCompatibility } from '../data/plants';

type Props = NativeStackScreenProps<RootStackParamList, 'Compatibility'>;

export default function CompatibilityScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const result = selected.length >= 2 ? checkCompatibility(selected) : null;

  const selectedPlants = PLANTS.filter((p) => selected.includes(p.id));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Проверка совместимости</Text>
      <Text style={styles.subtitle}>
        Выберите 2 или более растений, чтобы проверить их совместимость
      </Text>

      {selected.length > 0 && (
        <View style={styles.selectedRow}>
          {selectedPlants.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.selectedChip}
              onPress={() => toggle(p.id)}
            >
              <Text style={styles.selectedChipText}>{p.nameRu} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {result && (
        <View style={styles.resultSection}>
          {result.good.length > 0 && (
            <View style={styles.resultCard}>
              <Text style={[styles.resultTitle, { color: '#2E7D32' }]}>
                Хорошие пары ({result.good.length})
              </Text>
              {result.good.map(([a, b], i) => {
                const pa = PLANTS.find((p) => p.id === a);
                const pb = PLANTS.find((p) => p.id === b);
                return (
                  <Text key={i} style={styles.resultPair}>
                    {pa?.nameRu} + {pb?.nameRu}
                  </Text>
                );
              })}
            </View>
          )}

          {result.bad.length > 0 && (
            <View style={[styles.resultCard, { backgroundColor: '#FFEBEE' }]}>
              <Text style={[styles.resultTitle, { color: '#C62828' }]}>
                Плохие пары ({result.bad.length})
              </Text>
              {result.bad.map(([a, b], i) => {
                const pa = PLANTS.find((p) => p.id === a);
                const pb = PLANTS.find((p) => p.id === b);
                return (
                  <Text key={i} style={[styles.resultPair, { color: '#C62828' }]}>
                    {pa?.nameRu} + {pb?.nameRu}
                  </Text>
                );
              })}
            </View>
          )}

          {result.good.length === 0 && result.bad.length === 0 && (
            <View style={styles.resultCard}>
              <Text style={styles.resultNeutral}>
                Нет известных взаимодействий между выбранными растениями.
                Они нейтральны друг к другу.
              </Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.listTitle}>Выберите растения:</Text>
      {PLANTS.map((plant) => (
        <TouchableOpacity
          key={plant.id}
          style={[
            styles.plantRow,
            selected.includes(plant.id) && styles.plantRowActive,
          ]}
          onPress={() => toggle(plant.id)}
        >
          <View
            style={[
              styles.checkbox,
              selected.includes(plant.id) && styles.checkboxActive,
            ]}
          >
            {selected.includes(plant.id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>{plant.nameRu}</Text>
            <Text style={styles.plantLatin}>{plant.nameLat}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    marginBottom: 12,
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  selectedChip: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedChipText: {
    color: '#fff',
    fontSize: 13,
  },
  resultSection: {
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  resultPair: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
    paddingLeft: 8,
  },
  resultNeutral: {
    fontSize: 14,
    color: '#888',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },
  plantRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  plantRowActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#2E7D32',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  plantName: {
    fontSize: 15,
    color: '#333',
  },
  plantLatin: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
