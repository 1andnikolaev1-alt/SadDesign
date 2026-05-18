import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Preferences'>;

const STYLES = [
  { id: 'classic', label: 'Классический', emoji: '🏛' },
  { id: 'modern', label: 'Современный', emoji: '🔲' },
  { id: 'rustic', label: 'Деревенский', emoji: '🌾' },
  { id: 'japanese', label: 'Японский', emoji: '⛩' },
  { id: 'mediterranean', label: 'Средиземноморский', emoji: '🌊' },
  { id: 'natural', label: 'Природный', emoji: '🌲' },
];

const BUDGETS = [
  { id: 'economy', label: 'Эконом', desc: 'до 50 000 ₽' },
  { id: 'medium', label: 'Средний', desc: '50 000 — 200 000 ₽' },
  { id: 'premium', label: 'Премиум', desc: 'от 200 000 ₽' },
];

const FEATURES = [
  { id: 'flowers', label: 'Клумбы с цветами', emoji: '🌸' },
  { id: 'lawn', label: 'Газон', emoji: '🌿' },
  { id: 'trees', label: 'Деревья', emoji: '🌳' },
  { id: 'shrubs', label: 'Кустарники', emoji: '🌲' },
  { id: 'garden', label: 'Огород', emoji: '🥕' },
  { id: 'pond', label: 'Водоём', emoji: '💧' },
  { id: 'gazebo', label: 'Беседка/Зона отдыха', emoji: '🏕' },
  { id: 'paths', label: 'Дорожки', emoji: '🛤' },
  { id: 'lighting', label: 'Подсветка', emoji: '💡' },
  { id: 'hedge', label: 'Живая изгородь', emoji: '🌿' },
  { id: 'roses', label: 'Розарий', emoji: '🌹' },
  { id: 'fruit', label: 'Плодовый сад', emoji: '🍎' },
  { id: 'alpine', label: 'Альпийская горка', emoji: '⛰' },
  { id: 'pergola', label: 'Пергола/Арка', emoji: '🏗' },
];

const CARE_LEVELS = [
  { id: 'low', label: 'Минимальный', desc: 'Неприхотливые растения, редкий полив' },
  { id: 'medium', label: 'Средний', desc: 'Регулярный полив и подкормка' },
  { id: 'high', label: 'Максимальный', desc: 'Готов ухаживать каждый день' },
];

export default function PreferencesScreen({ navigation, route }: Props) {
  const params = route.params;
  const [style, setStyle] = useState('classic');
  const [budget, setBudget] = useState('medium');
  const [features, setFeatures] = useState<string[]>(['flowers', 'lawn', 'trees']);
  const [careLevel, setCareLevel] = useState('medium');
  const [continuousBloom, setContinuousBloom] = useState(true);

  const toggleFeature = (f: string) => {
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleGenerate = () => {
    navigation.navigate('DesignResult', {
      ...params,
      style,
      budget,
      features,
      careLevel,
      continuousBloom,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Стиль оформления</Text>
      <View style={styles.grid}>
        {STYLES.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.styleCard, style === s.id && styles.styleCardActive]}
            onPress={() => setStyle(s.id)}
          >
            <Text style={styles.styleEmoji}>{s.emoji}</Text>
            <Text
              style={[
                styles.styleLabel,
                style === s.id && styles.styleLabelActive,
              ]}
            >
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Бюджет</Text>
      {BUDGETS.map((b) => (
        <TouchableOpacity
          key={b.id}
          style={[styles.optionRow, budget === b.id && styles.optionRowActive]}
          onPress={() => setBudget(b.id)}
        >
          <View
            style={[styles.radio, budget === b.id && styles.radioActive]}
          />
          <View>
            <Text
              style={[
                styles.optionLabel,
                budget === b.id && styles.optionLabelActive,
              ]}
            >
              {b.label}
            </Text>
            <Text style={styles.optionDesc}>{b.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Что хотите на участке?</Text>
      <View style={styles.chipRow}>
        {FEATURES.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.chip,
              features.includes(f.id) && styles.chipActive,
            ]}
            onPress={() => toggleFeature(f.id)}
          >
            <Text style={styles.chipEmoji}>{f.emoji}</Text>
            <Text
              style={[
                styles.chipText,
                features.includes(f.id) && styles.chipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Уровень ухода</Text>
      {CARE_LEVELS.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={[
            styles.optionRow,
            careLevel === c.id && styles.optionRowActive,
          ]}
          onPress={() => setCareLevel(c.id)}
        >
          <View
            style={[styles.radio, careLevel === c.id && styles.radioActive]}
          />
          <View>
            <Text
              style={[
                styles.optionLabel,
                careLevel === c.id && styles.optionLabelActive,
              ]}
            >
              {c.label}
            </Text>
            <Text style={styles.optionDesc}>{c.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.bloomToggle, continuousBloom && styles.bloomToggleActive]}
        onPress={() => setContinuousBloom(!continuousBloom)}
      >
        <Text style={styles.bloomEmoji}>🌸</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.bloomLabel,
              continuousBloom && styles.bloomLabelActive,
            ]}
          >
            Непрерывное цветение
          </Text>
          <Text style={styles.bloomDesc}>
            Подобрать растения так, чтобы что-то цвело с апреля по октябрь
          </Text>
        </View>
        <Text style={styles.bloomCheck}>{continuousBloom ? '✓' : ''}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
        <Text style={styles.generateBtnText}>🌿 Создать дизайн-проект</Text>
      </TouchableOpacity>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  styleCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  styleCardActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  styleEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  styleLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  styleLabelActive: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionRowActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
  },
  radioActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#2E7D32',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionLabelActive: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  optionDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  chipEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
  },
  bloomToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bloomToggleActive: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  bloomEmoji: {
    fontSize: 30,
    marginRight: 12,
  },
  bloomLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bloomLabelActive: {
    color: '#E65100',
  },
  bloomDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  bloomCheck: {
    fontSize: 24,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  generateBtn: {
    backgroundColor: '#2E7D32',
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
