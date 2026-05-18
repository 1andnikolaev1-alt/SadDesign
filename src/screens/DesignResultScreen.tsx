import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import {
  PLANTS,
  Plant,
  filterPlantsByZone,
  getContinuousBloom,
  CATEGORY_LABELS,
  LIGHT_LABELS,
  getMonthName,
} from '../data/plants';

type Props = NativeStackScreenProps<RootStackParamList, 'DesignResult'>;

const API_URL = 'http://5.129.233.22:8001';

const STYLE_LABELS: Record<string, string> = {
  classic: 'Классический',
  modern: 'Современный',
  rustic: 'Деревенский',
  japanese: 'Японский',
  mediterranean: 'Средиземноморский',
  natural: 'Природный',
};

const FEATURE_LABELS: Record<string, string> = {
  flowers: 'Клумбы',
  lawn: 'Газон',
  trees: 'Деревья',
  shrubs: 'Кустарники',
  garden: 'Огород',
  pond: 'Водоём',
  gazebo: 'Беседка',
  paths: 'Дорожки',
  lighting: 'Подсветка',
  hedge: 'Живая изгородь',
  roses: 'Розарий',
  fruit: 'Плодовый сад',
  alpine: 'Альпийская горка',
  pergola: 'Пергола',
};

interface DesignResult {
  description: string;
  zones: DesignZone[];
  plants: Plant[];
  tips: string[];
}

interface DesignZone {
  name: string;
  description: string;
  plants: Plant[];
}

function generateLocalDesign(params: Props['route']['params']): DesignResult {
  const { zone, style, features, careLevel, continuousBloom, plotWidth, plotLength } = params;
  const area = plotWidth * plotLength;
  const eligible = filterPlantsByZone(zone);

  const careLevelFilter = (p: Plant) => {
    if (careLevel === 'low') return p.careLevel === 'low';
    if (careLevel === 'medium') return p.careLevel !== 'high';
    return true;
  };

  const filtered = eligible.filter(careLevelFilter);

  const designZones: DesignZone[] = [];
  const allPlants: Plant[] = [];

  if (features.includes('flowers')) {
    const bloomPlants = continuousBloom
      ? getContinuousBloom(zone)
      : filtered.filter((p) => p.category === 'perennial' || p.category === 'annual').slice(0, 6);
    designZones.push({
      name: 'Цветник / Миксбордер',
      description: 'Клумба с многолетниками и однолетниками для яркого цветения с весны до осени.',
      plants: bloomPlants,
    });
    allPlants.push(...bloomPlants);
  }

  if (features.includes('trees') || features.includes('fruit')) {
    const trees = filtered
      .filter((p) => p.category === 'fruit_tree' || p.category === 'decorative_tree')
      .slice(0, 4);
    designZones.push({
      name: 'Деревья',
      description: 'Плодовые и декоративные деревья для тени, урожая и красоты.',
      plants: trees,
    });
    allPlants.push(...trees);
  }

  if (features.includes('shrubs') || features.includes('hedge')) {
    const shrubs = filtered.filter((p) => p.category === 'shrub').slice(0, 4);
    designZones.push({
      name: 'Кустарники / Живая изгородь',
      description: 'Декоративные кустарники для зонирования и красивого фона.',
      plants: shrubs,
    });
    allPlants.push(...shrubs);
  }

  if (features.includes('roses')) {
    const roses = filtered.filter((p) => p.category === 'rose').slice(0, 3);
    designZones.push({
      name: 'Розарий',
      description: 'Уголок с розами — классика садового дизайна.',
      plants: roses,
    });
    allPlants.push(...roses);
  }

  if (features.includes('lawn')) {
    const grass = filtered.filter((p) => p.category === 'grass').slice(0, 2);
    designZones.push({
      name: 'Газон',
      description: 'Ровный зелёный газон — основа ландшафтного дизайна.',
      plants: grass,
    });
    allPlants.push(...grass);
  }

  if (features.includes('garden')) {
    const vegs = filtered.filter((p) => p.category === 'vegetable').slice(0, 5);
    designZones.push({
      name: 'Огород',
      description: 'Грядки с овощами и зеленью для свежих продуктов.',
      plants: vegs,
    });
    allPlants.push(...vegs);
  }

  const conifers = filtered.filter((p) => p.category === 'conifer').slice(0, 2);
  if (conifers.length > 0 && (features.includes('hedge') || features.includes('trees'))) {
    designZones.push({
      name: 'Хвойные акценты',
      description: 'Вечнозелёные растения для круглогодичной декоративности.',
      plants: conifers,
    });
    allPlants.push(...conifers);
  }

  const styleDesc = STYLE_LABELS[style] || style;
  const description = `Дизайн-проект участка ${plotWidth}x${plotLength} м (${area} м²) в ${styleDesc.toLowerCase()} стиле для зоны морозостойкости ${zone}. ` +
    `Проект включает ${designZones.map((z) => z.name.toLowerCase()).join(', ')}. ` +
    `Подобрано ${allPlants.length} растений, подходящих для вашего климата.` +
    (continuousBloom ? ' Растения подобраны для непрерывного цветения с апреля по октябрь.' : '');

  const tips = [
    `Для зоны ${zone} выбирайте растения с морозостойкостью не выше ${zone} зоны USDA.`,
    'Высаживайте высокие растения на заднем плане, низкие — на переднем.',
    'Группируйте растения по 3-5 штук одного вида для лучшего эффекта.',
    'Оставляйте расстояние между деревьями не менее 3-4 метров.',
    continuousBloom
      ? 'Для непрерывного цветения сочетайте ранневесенние, летние и осенние виды.'
      : 'Сделайте акцент на декоративнолиственных растениях для стабильной красоты.',
  ];

  return { description, zones: designZones, plants: allPlants, tips };
}

export default function DesignResultScreen({ navigation, route }: Props) {
  const params = route.params;
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<DesignResult | null>(null);
  const [aiDescription, setAiDescription] = useState<string | null>(null);

  useEffect(() => {
    const localDesign = generateLocalDesign(params);
    setDesign(localDesign);
    setLoading(false);

    // Try to get AI-enhanced description
    fetchAiDesign(params, localDesign);
  }, []);

  const fetchAiDesign = async (p: typeof params, localDesign: DesignResult) => {
    try {
      const response = await fetch(`${API_URL}/api/garden/design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: p.city,
          zone: p.zone,
          plot_width: p.plotWidth,
          plot_length: p.plotLength,
          style: p.style,
          budget: p.budget,
          features: p.features,
          care_level: p.careLevel,
          continuous_bloom: p.continuousBloom,
          existing: p.existingFeatures,
          plant_names: localDesign.plants.map((pl) => pl.nameRu),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.description) {
          setAiDescription(data.description);
        }
      }
    } catch {
      // AI is optional, local design is always available
    }
  };

  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const newDesign = generateLocalDesign(params);
      setDesign(newDesign);
      setLoading(false);
      setAiDescription(null);
      fetchAiDesign(params, newDesign);
    }, 500);
  };

  if (loading || !design) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Создаём дизайн-проект...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ваш дизайн-проект</Text>
        <Text style={styles.headerSubtitle}>
          {params.city}, зона {params.zone} | {params.plotWidth}x{params.plotLength} м
        </Text>
      </View>

      <View style={styles.descCard}>
        <Text style={styles.descText}>
          {aiDescription || design.description}
        </Text>
      </View>

      {design.zones.map((z, i) => (
        <View key={i} style={styles.zoneCard}>
          <Text style={styles.zoneName}>{z.name}</Text>
          <Text style={styles.zoneDesc}>{z.description}</Text>
          <View style={styles.plantList}>
            {z.plants.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.plantItem}
                onPress={() =>
                  navigation.navigate('PlantDetail', { plantId: p.id })
                }
              >
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{p.nameRu}</Text>
                  <Text style={styles.plantLat}>{p.nameLat}</Text>
                  {p.bloomMonths.length > 0 && (
                    <Text style={styles.plantBloom}>
                      Цветение: {p.bloomMonths.map(getMonthName).join(', ')} |{' '}
                      {p.bloomColor}
                    </Text>
                  )}
                </View>
                <Text style={styles.plantArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Советы</Text>
        {design.tips.map((tip, i) => (
          <Text key={i} style={styles.tipText}>
            • {tip}
          </Text>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleRegenerate}>
          <Text style={styles.actionBtnText}>🔄 Другой вариант</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnSecondary]}
          onPress={() =>
            navigation.navigate('CareCalendar', {
              plantIds: design.plants.map((p) => p.id),
            })
          }
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>
            📅 Календарь ухода
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnSecondary]}
          onPress={() =>
            navigation.navigate('PlantList', {
              zone: params.zone,
            })
          }
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>
            📚 Все растения для зоны {params.zone}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  loadingText: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 16,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  descCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  descText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  zoneCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  zoneDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  plantList: {},
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  plantLat: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  plantBloom: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  plantArrow: {
    fontSize: 24,
    color: '#ccc',
    marginLeft: 8,
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 4,
  },
  actions: {
    padding: 16,
    gap: 10,
  },
  actionBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  actionBtnSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionBtnTextSecondary: {
    color: '#2E7D32',
  },
});
