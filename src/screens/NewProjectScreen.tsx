import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { CITY_ZONES, getZoneForCity } from '../data/plants';

type Props = NativeStackScreenProps<RootStackParamList, 'NewProject'>;

const EXISTING_FEATURES = [
  'Дом',
  'Забор',
  'Дорожки',
  'Деревья',
  'Газон',
  'Сарай/Хозблок',
  'Беседка',
  'Теплица',
  'Водоём',
  'Клумбы',
];

export default function NewProjectScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [plotWidth, setPlotWidth] = useState('');
  const [plotLength, setPlotLength] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showCities, setShowCities] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Нужен доступ к камере');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const filteredCities = city.length >= 1
    ? CITY_ZONES.filter((c) =>
        c.city.toLowerCase().startsWith(city.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleNext = () => {
    const zone = getZoneForCity(city);
    if (!zone) {
      Alert.alert(
        'Город не найден',
        'Выберите город из списка или введите ближайший крупный город.'
      );
      return;
    }
    const w = parseFloat(plotWidth) || 0;
    const l = parseFloat(plotLength) || 0;
    if (w <= 0 || l <= 0) {
      Alert.alert('Укажите размер', 'Введите ширину и длину участка в метрах.');
      return;
    }

    navigation.navigate('Preferences', {
      photoUri,
      city,
      zone,
      plotWidth: w,
      plotLength: l,
      existingFeatures: selectedFeatures,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Фото участка</Text>
      <View style={styles.photoRow}>
        <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
          <Text style={styles.photoBtnEmoji}>📷</Text>
          <Text style={styles.photoBtnText}>Камера</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Text style={styles.photoBtnEmoji}>🖼</Text>
          <Text style={styles.photoBtnText}>Галерея</Text>
        </TouchableOpacity>
      </View>
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      )}
      <Text style={styles.photoHint}>
        (необязательно — можно создать проект без фото)
      </Text>

      <Text style={styles.sectionTitle}>Город / Регион</Text>
      <TextInput
        style={styles.input}
        placeholder="Начните вводить город..."
        value={city}
        onChangeText={(t) => {
          setCity(t);
          setShowCities(true);
        }}
      />
      {showCities && filteredCities.length > 0 && (
        <View style={styles.suggestions}>
          {filteredCities.map((c) => (
            <TouchableOpacity
              key={c.city}
              style={styles.suggestionItem}
              onPress={() => {
                setCity(c.city);
                setShowCities(false);
              }}
            >
              <Text style={styles.suggestionText}>
                {c.city} (зона {c.zone})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {getZoneForCity(city) && (
        <Text style={styles.zoneInfo}>
          Зона морозостойкости: {getZoneForCity(city)} (мин. температура:{' '}
          {getZoneForCity(city)! <= 3
            ? 'до -40°C'
            : getZoneForCity(city)! <= 5
            ? 'до -29°C'
            : getZoneForCity(city)! <= 7
            ? 'до -18°C'
            : 'до -7°C'}
          )
        </Text>
      )}

      <Text style={styles.sectionTitle}>Размер участка (метры)</Text>
      <View style={styles.sizeRow}>
        <View style={styles.sizeInput}>
          <Text style={styles.sizeLabel}>Ширина</Text>
          <TextInput
            style={styles.input}
            placeholder="м"
            keyboardType="numeric"
            value={plotWidth}
            onChangeText={setPlotWidth}
          />
        </View>
        <Text style={styles.sizeX}>x</Text>
        <View style={styles.sizeInput}>
          <Text style={styles.sizeLabel}>Длина</Text>
          <TextInput
            style={styles.input}
            placeholder="м"
            keyboardType="numeric"
            value={plotLength}
            onChangeText={setPlotLength}
          />
        </View>
      </View>
      {parseFloat(plotWidth) > 0 && parseFloat(plotLength) > 0 && (
        <Text style={styles.areaText}>
          Площадь: {(parseFloat(plotWidth) * parseFloat(plotLength)).toFixed(0)} м² (
          {((parseFloat(plotWidth) * parseFloat(plotLength)) / 100).toFixed(2)} соток)
        </Text>
      )}

      <Text style={styles.sectionTitle}>Что уже есть на участке?</Text>
      <View style={styles.chipRow}>
        {EXISTING_FEATURES.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.chip,
              selectedFeatures.includes(f) && styles.chipActive,
            ]}
            onPress={() => toggleFeature(f)}
          >
            <Text
              style={[
                styles.chipText,
                selectedFeatures.includes(f) && styles.chipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>Далее — Пожелания</Text>
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
  photoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  photoBtnEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  photoBtnText: {
    fontSize: 14,
    color: '#333',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  photoHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  suggestions: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
  },
  zoneInfo: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 6,
    fontStyle: 'italic',
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sizeInput: {
    flex: 1,
  },
  sizeLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  sizeX: {
    fontSize: 20,
    color: '#999',
    marginTop: 16,
  },
  areaText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  chipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
  },
  nextBtn: {
    backgroundColor: '#2E7D32',
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
