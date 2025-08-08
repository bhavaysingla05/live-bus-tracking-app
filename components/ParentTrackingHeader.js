// components/ParentTrackingHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const ParentTrackingHeader = ({ 
  busInfo, 
  speed, 
  eta, 
  distance, 
  currentStop, 
  nextStop,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <View style={styles.container}>
      {/* Bus Info Row */}
      <View style={styles.busInfoRow}>
        <View style={styles.busInfo}>
          <MaterialCommunityIcons name="bus" size={24} color="#e95028" />
          <View style={styles.busDetails}>
            <Text style={styles.busNumber}>{busInfo.id}</Text>
            <Text style={styles.routeInfo}>{busInfo.routeNumber}</Text>
          </View>
        </View>
        
        <View style={styles.liveStatus}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Quick Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.statValue}>{eta} mins</Text>
          <Text style={styles.statLabel}>ETA</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="map-marker-distance" size={16} color="#6b7280" />
          <Text style={styles.statValue}>{distance} km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="speedometer" size={16} color="#6b7280" />
          <Text style={styles.statValue}>{speed} km/h</Text>
          <Text style={styles.statLabel}>Speed</Text>
        </View>
      </View>

      {/* Current Location Row */}
      <View style={styles.locationRow}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Current Location</Text>
          <Text style={styles.locationValue}>{currentStop?.name || 'En Route'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={onRefresh}
          disabled={isRefreshing}
        >
          <Ionicons 
            name={isRefreshing ? "refresh" : "refresh-outline"} 
            size={20} 
            color="#e95028" 
          />
        </TouchableOpacity>
      </View>

      {/* Next Stop Info */}
      {nextStop && (
        <View style={styles.nextStopRow}>
          <View style={styles.nextStopIcon}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#e95028" />
          </View>
          <View style={styles.nextStopInfo}>
            <Text style={styles.nextStopLabel}>Next Stop</Text>
            <Text style={styles.nextStopValue}>{nextStop.name}</Text>
            <Text style={styles.nextStopEta}>Arriving in {nextStop.eta}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  busInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  busDetails: {
    gap: 2,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e95028',
    fontFamily: 'Inter_700Bold',
  },
  routeInfo: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    fontFamily: 'Inter_600SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter_600SemiBold',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  nextStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  nextStopIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStopInfo: {
    flex: 1,
  },
  nextStopLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
  },
  nextStopValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter_600SemiBold',
  },
  nextStopEta: {
    fontSize: 12,
    color: '#e95028',
    fontFamily: 'Inter_500Medium',
  },
});

export default ParentTrackingHeader;
