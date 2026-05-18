import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import {
  PLANTS,
  CATEGORY_LABELS,
  LIGHT_LABELS,
  WATER_LABELS,
  CARE_LABELS,
  getMonthName,
} from '../data/plants';

type Props = NativeStackScreenProps<RootStackParamList, 'PlantDetail'>;

export default function PlantDetailScreen({ navigation, route }: Props) {
  const plant = PLANTS.find((p) => p.id === route.params.plantId);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text>Растение не найдено</Text>
      </View>
    );
  }

  const companions = PLANTS.filter((p) => plant.companions.includes(p.id));
  const enemies = PLANTS.filter((p) => plant.enemies.includes(p.id));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{plant.nameRu}</Text>
        <Text style={styles.latin}>{plant.nameLat}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {CATEGORY_LABELS[plant.category]}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.desc}>{plant.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Характеристики</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Зоны USDA:</Text>
          <Text style={styles.value}>{plant.zones.join(', ')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Высота:</Text>
          <Text style={styles.value}>
            {plant.heightMin}–{plant.heightMax} см
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ширина:</Text>
          <Text style={styles.value}>
            {plant.widthMin}–{plant.widthMax} см
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Освещение:</Text>
          <Text style={styles.value}>{LIGHT_LABELS[plant.light]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Полив:</Text>
          <Text style={styles.value}>{WATER_LABELS[plant.water]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Уход:</Text>
          <Text style={styles.value}>{CARE_LABELS[plant.careLevel]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Почва:</Text>
          <Text style={[styles.value, { flex: 1 }]}>{plant.soil}</Text>
        </View>
      </View>

      {plant.bloomMonths.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Цветение</Text>
          <View style={styles.bloomRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <View
                key={m}
                style={[
                  styles.monthCell,
                  plant.bloomMonths.includes(m) && styles.monthCellActive,
                ]}
              >
                <Text
                  style={[
                    styles.monthText,
                    plant.bloomMonths.includes(m) && styles.monthTextActive,
                  ]}
                >
                  {getMonthName(m).substring(0, 3)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.bloomColor}>Цвет: {plant.bloomColor}</Text>
        </View>
      )}

      {plant.careCalendar.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Календарь ухода</Text>
          {plant.careCalendar.map((c) => (
            <View key={c.month} style={styles.careRow}>
              <View style={styles.careMonth}>
                <Text style={styles.careMonthText}>{getMonthName(c.month)}</Text>
              </View>
              <View style={styles.careTasks}>
                {c.tasks.map((t, i) => (
                  <Text key={i} style={styles.careTask}>
                    • {t}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {companions.length > 0 && (
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: '#2E7D32' }]}>
            Хорошие соседи
          </Text>
          {companions.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.neighborRow}
              onPress={() =>
                navigation.push('PlantDetail', { plantId: c.id })
              }
            >
              <Text style={styles.neighborName}>{c.nameRu}</Text>
              <Text style={styles.neighborArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {enemies.length > 0 && (
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: '#C62828' }]}>
            Плохие соседи
          </Text>
          {enemies.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={styles.neighborRow}
              onPress={() =>
                navigation.push('PlantDetail', { plantId: e.id })
              }
            >
              <Text style={[styles.neighborName, { color: '#C62828' }]}>
                {e.nameRu}
              </Text>
              <Text style={styles.neighborArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
  },
  latin: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#C8E6C9',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 13,
    color: '#1B5E20',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 14,
    color: '#888',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bloomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  monthCell: {
    width: '8%',
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCellActive: {
    backgroundColor: '#4CAF50',
  },
  monthText: {
    fontSize: 8,
    color: '#999',
  },
  monthTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bloomColor: {
    fontSize: 13,
    color: '#666',
  },
  careRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  careMonth: {
    width: 80,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  careMonthText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  careTasks: {
    flex: 1,
    justifyContent: 'center',
  },
  careTask: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  neighborRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  neighborName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  neighborArrow: {
    fontSize: 20,
    color: '#ccc',
  },
});
