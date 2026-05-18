import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🌿</Text>
        <Text style={styles.title}>СадДизайн</Text>
        <Text style={styles.subtitle}>
          AI-помощник для ландшафтного дизайна
        </Text>
        <Text style={styles.desc}>
          Сфотографируйте участок, укажите пожелания — и получите готовый проект
          озеленения с подбором растений для вашего климата.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.mainBtn}
        onPress={() => navigation.navigate('NewProject')}
      >
        <Text style={styles.mainBtnText}>🏡 Новый проект</Text>
      </TouchableOpacity>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Возможности</Text>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('Compatibility')}
        >
          <Text style={styles.featureEmoji}>🌱</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Совместимость растений</Text>
            <Text style={styles.featureDesc}>
              Проверьте, какие растения хорошо соседствуют
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() =>
            navigation.navigate('PlantList', { zone: 4 })
          }
        >
          <Text style={styles.featureEmoji}>📚</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Каталог растений</Text>
            <Text style={styles.featureDesc}>
              50 растений с описанием и уходом
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('CareCalendar', { plantIds: [] })}
        >
          <Text style={styles.featureEmoji}>📅</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Календарь ухода</Text>
            <Text style={styles.featureDesc}>
              Помесячный план работ в саду
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Бесплатное приложение для дачников и ландшафтных дизайнеров.
          {'\n'}Поддерживает зоны морозостойкости USDA для всех регионов России.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  mainBtn: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mainBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 36,
    marginRight: 14,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#777',
  },
  info: {
    padding: 20,
    paddingBottom: 40,
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
