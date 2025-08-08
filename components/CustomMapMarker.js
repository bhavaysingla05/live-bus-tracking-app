// components/CustomMapMarker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const CustomMapMarker = ({ type, name, status, isBus = false }) => {
  const getMarkerIcon = () => {
    if (isBus) {
      return (
        <View style={[styles.markerContainer, styles.busMarker]}>
          <MaterialCommunityIcons name="bus" size={24} color="#fff" />
          <View style={styles.busPulse} />
        </View>
      );
    }

    switch (type) {
      case 'school':
        return (
          <View style={[styles.markerContainer, styles.schoolMarker]}>
            <FontAwesome5 name="school" size={20} color="#fff" />
            <Text style={styles.markerLabel}>{name}</Text>
          </View>
        );
      case 'residential':
        return (
          <View style={[styles.markerContainer, styles.residentialMarker]}>
            <MaterialIcons name="home" size={20} color="#fff" />
            <Text style={styles.markerLabel}>{name}</Text>
          </View>
        );
      case 'landmark':
        return (
          <View style={[styles.markerContainer, styles.landmarkMarker]}>
            <MaterialIcons name="place" size={20} color="#fff" />
            <Text style={styles.markerLabel}>{name}</Text>
          </View>
        );
      case 'junction':
        return (
          <View style={[styles.markerContainer, styles.junctionMarker]}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
            <Text style={styles.markerLabel}>{name}</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.markerContainer, styles.defaultMarker]}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
            <Text style={styles.markerLabel}>{name}</Text>
          </View>
        );
    }
  };

  const getStatusIndicator = () => {
    if (isBus) return null;
    
    switch (status) {
      case 'completed':
        return <View style={[styles.statusIndicator, styles.completedIndicator]} />;
      case 'current':
        return <View style={[styles.statusIndicator, styles.currentIndicator]} />;
      default:
        return <View style={[styles.statusIndicator, styles.upcomingIndicator]} />;
    }
  };

  return (
    <View style={styles.container}>
      {getMarkerIcon()}
      {getStatusIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  busMarker: {
    backgroundColor: '#e95028',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  schoolMarker: {
    backgroundColor: '#2563eb',
  },
  residentialMarker: {
    backgroundColor: '#059669',
  },
  landmarkMarker: {
    backgroundColor: '#7c3aed',
  },
  junctionMarker: {
    backgroundColor: '#dc2626',
  },
  defaultMarker: {
    backgroundColor: '#6b7280',
  },
  markerLabel: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 80,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  completedIndicator: {
    backgroundColor: '#22c55e',
  },
  currentIndicator: {
    backgroundColor: '#e95028',
  },
  upcomingIndicator: {
    backgroundColor: '#6b7280',
  },
  busPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(233, 80, 40, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(233, 80, 40, 0.5)',
    animation: 'pulse 2s infinite',
  },
});

export default CustomMapMarker;
