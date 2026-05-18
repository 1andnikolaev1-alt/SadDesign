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
import { PLANTS, getMonthName } from '../data/plants';

type Props = NativeStackScreenProps<RootStackParamList, 'CareCalendar'>;

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function CareCalendarScreen({ route }: Props) {
  const { plantIds } = route.params;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const plants =
    plantIds.length > 0
      ? PLANTS.filter((p) => plantIds.includes(p.id))
      : PLANTS;

  const monthTasks: { plantName: string; tasks: string[] }[] = [];

  for (const plant of plants) {
    const calEntry = plant.careCalendar.find((c) => c.month === selectedMonth);
    if (calEntry && calEntry.tasks.length > 0) {
      monthTasks.push({
        plantName: plant.nameRu,
        tasks: calEntry.tasks,
      });
    }
  }

  // Bloom this month
  const blooming = plants.filter((p) =>
    p.bloomMonths.includes(selectedMonth)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Календарь ухода</Text>
      {plantIds.length > 0 && (
        <Text style={styles.subtitle}>
          Для {plantIds.length} растений из вашего проекта
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthScroll}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {MONTHS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.monthBtn,
              selectedMonth === m && styles.monthBtnActive,
            ]}
            onPress={() => setSelectedMonth(m)}
          >
            <Text
              style={[
                styles.monthBtnText,
                selectedMonth === m && styles.monthBtnTextActive,
              ]}
            >
              {getMonthName(m).substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.monthHeader}>
        <Text style={styles.monthTitle}>{getMonthName(selectedMonth)}</Text>
        <Text style={styles.monthCount}>
          {monthTasks.length} растений с задачами
        </Text>
      </View>

      {blooming.length > 0 && (
        <View style={styles.bloomCard}>
          <Text style={styles.bloomTitle}>
            Цветут в {getMonthName(selectedMonth).toLowerCase()}е:
          </Text>
          <Text style={styles.bloomList}>
            {blooming.map((p) => p.nameRu).join(', ')}
          </Text>
        </View>
      )}

      {monthTasks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Нет задач на этот месяц. Время отдыхать! 😊
          </Text>
        </View>
      ) : (
        monthTasks.map((item, idx) => (
          <View key={idx} style={styles.taskCard}>
            <Text style={styles.taskPlant}>{item.plantName}</Text>
            {item.tasks.map((task, i) => (
              <View key={i} style={styles.taskRow}>
                <View style={styles.taskDot} />
                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>
        ))
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#4CAF50',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  monthScroll: {
    marginTop: 16,
    maxHeight: 50,
  },
  monthBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  monthBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  monthBtnText: {
    fontSize: 14,
    color: '#555',
  },
  monthBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  monthHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  monthCount: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  bloomCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  bloomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  bloomList: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
  },
  taskCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 14,
    elevation: 1,
  },
  taskPlant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginTop: 5,
    marginRight: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
