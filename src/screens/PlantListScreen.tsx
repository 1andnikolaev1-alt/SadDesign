import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import {
  PLANTS,
  Plant,
  CATEGORY_LABELS,
  PlantCategory,
  filterPlantsByZone,
  getMonthName,
} from '../data/plants';

type Props = NativeStackScreenProps<RootStackParamList, 'PlantList'>;

const CATEGORIES: { id: PlantCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'fruit_tree', label: 'Плодовые' },
  { id: 'decorative_tree', label: 'Декоративные' },
  { id: 'conifer', label: 'Хвойные' },
  { id: 'shrub', label: 'Кустарники' },
  { id: 'perennial', label: 'Многолетники' },
  { id: 'annual', label: 'Однолетники' },
  { id: 'rose', label: 'Розы' },
  { id: 'vegetable', label: 'Овощи' },
  { id: 'grass', label: 'Газон' },
  { id: 'climber', label: 'Вьющиеся' },
];

export default function PlantListScreen({ navigation, route }: Props) {
  const { zone, category: initCategory } = route.params;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<PlantCategory | 'all'>(
    (initCategory as PlantCategory) || 'all'
  );

  const plants = useMemo(() => {
    let list = filterPlantsByZone(zone);
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nameRu.toLowerCase().includes(q) ||
          p.nameLat.toLowerCase().includes(q)
      );
    }
    return list;
  }, [zone, activeCategory, search]);

  const renderPlant = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.nameRu}</Text>
        <Text style={styles.cardLatin}>{item.nameLat}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>
            {CATEGORY_LABELS[item.category]}
          </Text>
          {item.bloomMonths.length > 0 && (
            <Text style={styles.metaBloom}>
              {item.bloomMonths.map((m) => getMonthName(m).substring(0, 3)).join('-')}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Поиск по названию..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              activeCategory === item.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === item.id && styles.categoryTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.countText}>
        Найдено: {plants.length} растений (зона {zone})
      </Text>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlant}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  search: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  categoryList: {
    maxHeight: 50,
    marginTop: 10,
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  categoryChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryText: {
    fontSize: 13,
    color: '#555',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 13,
    color: '#888',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 1,
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardLatin: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  metaBloom: {
    fontSize: 11,
    color: '#E65100',
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardArrow: {
    fontSize: 22,
    color: '#ccc',
  },
});
