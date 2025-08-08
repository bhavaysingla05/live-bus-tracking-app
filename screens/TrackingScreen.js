// screens/TrackingScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps'; // Using react-native-maps
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CustomMapMarker from '../components/CustomMapMarker';

export default function TrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || { type: 'pickup' };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [busPosition, setBusPosition] = useState({ latitude: 28.6130, longitude: 77.2060 }); // Initial position
  const [showBusInfo, setShowBusInfo] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);
  const [speed, setSpeed] = useState(24);
  const [distance, setDistance] = useState(1.7);
  const [eta, setEta] = useState(5);

  // Define route path points for smooth movement (approximate real-world coordinates)
  const routePoints = useMemo(() => [
    { latitude: 28.6100, longitude: 77.2000 },   // School (approx)
    { latitude: 28.6115, longitude: 77.2030 },  // Point 1
    { latitude: 28.6130, longitude: 77.2060 },  // Current position
    { latitude: 28.6145, longitude: 77.2090 },  // Point 2
    { latitude: 28.6160, longitude: 77.2120 },  // T Point
    { latitude: 28.6175, longitude: 77.2150 },  // Final destination
  ], []);

  const [busStops, setBusStops] = useState([
    { name: 'SDVM School', type: 'school', status: 'completed', eta: 'Completed', time: '07:30', coords: { latitude: 28.6100, longitude: 77.2000 }, description: 'School pickup point' },
    { name: 'Gurudwara', type: 'landmark', status: 'completed', eta: 'Completed', time: '07:45', coords: { latitude: 28.6125, longitude: 77.2050 }, description: 'Religious landmark' },
    { name: 'T Point Junction', type: 'junction', status: 'current', eta: '2 mins', time: '07:57', coords: { latitude: 28.6160, longitude: 77.2120 }, description: 'Traffic junction' },
    { name: 'Huda Sector 11-12', type: 'residential', status: 'upcoming', eta: '8 mins', time: '08:05', coords: { latitude: 28.6175, longitude: 77.2150 }, description: 'Residential area' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setRouteProgress(prev => {
        const newProgress = prev + 0.008;
        if (newProgress >= 1) return 0;
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    const currentIndex = Math.floor(routeProgress * (routePoints.length - 1));
    const nextIndex = Math.min(currentIndex + 1, routePoints.length - 1);
    const segmentProgress = (routeProgress * (routePoints.length - 1)) - currentIndex;

    const currentPoint = routePoints[currentIndex];
    const nextPoint = routePoints[nextIndex];

    const newLatitude = currentPoint.latitude + (nextPoint.latitude - currentPoint.latitude) * segmentProgress;
    const newLongitude = currentPoint.longitude + (nextPoint.longitude - currentPoint.longitude) * segmentProgress;

    setBusPosition({ latitude: newLatitude, longitude: newLongitude });

    const newSpeed = Math.floor(20 + Math.random() * 10);
    const newDistance = Math.max(0.1, 1.7 - (routeProgress * 1.6));
    const newEta = Math.max(1, Math.floor(newDistance / newSpeed * 60));

    setSpeed(newSpeed);
    setDistance(parseFloat(newDistance.toFixed(1)));
    setEta(newEta);

    if (routeProgress > 0.6) {
      setBusStops(prevBusStops => {
        if (prevBusStops[2].status === 'current') {
          return [
            { ...prevBusStops[0] },
            { ...prevBusStops[1] },
            { ...prevBusStops[2], status: 'completed', eta: 'Completed' },
            { ...prevBusStops[3], status: 'current', eta: `${newEta} mins` }
          ];
        }
        return prevBusStops;
      });
    }
  }, [routeProgress, routePoints, eta]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <View style={styles.statusIconCompleted}>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        );
      case 'current':
        return (
          <View style={styles.statusIconCurrent}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        );
      default:
        return <View style={styles.statusIconUpcoming} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return styles.statusTextCompleted;
      case 'current': return styles.statusTextCurrent;
      default: return styles.statusTextUpcoming;
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Bus Tracking</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Bus Info Header */}
        <View style={styles.busInfoHeader}>
          <View>
            <Text style={styles.busId}>Bus HR65 6866</Text>
            <Text style={styles.routeSpeed}>Route No-20 • Speed: {speed} km/h</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Map Container - Using react-native-maps */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 28.6139,
              longitude: 77.2090,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            region={{ // Keep map centered on bus for demo
              latitude: busPosition.latitude,
              longitude: busPosition.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* Bus Marker */}
            <Marker
              coordinate={busPosition}
              onPress={() => setShowBusInfo(!showBusInfo)}
            >
              <CustomMapMarker 
                isBus={true}
                name="Bus"
              />
            </Marker>

            {/* Bus Stops Markers */}
            {busStops.map((stop, index) => (
              <Marker
                key={index}
                coordinate={stop.coords}
                title={stop.name}
                description={stop.description}
              >
                <CustomMapMarker 
                  type={stop.type}
                  name={stop.name}
                  status={stop.status}
                />
              </Marker>
            ))}

            {/* Route Polyline */}
            <Polyline
              coordinates={routePoints}
              strokeColor="#1a73e8"
              strokeWidth={4}
            />
          </MapView>

          {/* Bus Info Popup with live updates */}
          {showBusInfo && (
            <View style={styles.busInfoPopup}>
              <View style={styles.busInfoContent}>
                <View>
                  <Text style={styles.busInfoDistance}>{distance} km remaining</Text>
                  <Text style={styles.busInfoEtaSpeed}>
                    ETA: {eta} mins • Speed: {speed} km/h
                  </Text>
                  <Text style={styles.busInfoUpdate}>
                    ● Location updated {formatTime(currentTime)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBusInfo(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Status Cards */}
        <View style={styles.statusCardsGrid}>
          {/* ETA Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconWrapper}>
              <Ionicons name="time-outline" size={24} color="#e95028" />
            </View>
            <Text style={styles.statusValue}>{eta} mins</Text>
            <Text style={styles.statusLabel}>ETA</Text>
          </View>

          {/* Distance Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconWrapper}>
              <MaterialCommunityIcons name="map-marker-distance" size={24} color="#e95028" />
            </View>
            <Text style={styles.statusValue}>{distance} km</Text>
            <Text style={styles.statusLabel}>Distance</Text>
          </View>

          {/* Speed Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconWrapper}>
              <MaterialCommunityIcons name="speedometer" size={24} color="#e95028" />
            </View>
            <Text style={styles.statusValue}>{speed}</Text>
            <Text style={styles.statusLabel}>km/h</Text>
          </View>
        </View>

        {/* Next Stop */}
        <View style={styles.nextStopCard}>
          <View style={styles.nextStopIconWrapper}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#e95028" />
          </View>
          <View>
            <Text style={styles.nextStopLabel}>Next Stop</Text>
            <Text style={styles.nextStopValue}>Sector 12 Main Gate</Text>
          </View>
        </View>

        {/* Live Status */}
        <View style={styles.liveStatusCard}>
          <View style={styles.liveStatusHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.liveStatusTime}>Updated {formatTime(currentTime)}</Text>
          </View>
          <View style={styles.liveStatusGrid}>
            <View style={styles.liveStatusItem}>
              <Text style={styles.liveStatusItemText}>28/35 Present</Text>
              <View style={styles.liveStatusItemIconWrapper}>
                <Ionicons name="people" size={18} color="#4b5563" />
              </View>
            </View>
            <View style={styles.liveStatusItem}>
              <Text style={styles.liveStatusItemText}>7 At Stops</Text>
              <View style={styles.liveStatusItemIconWrapper}>
                <Ionicons name="checkmark-circle" size={18} color="green" />
              </View>
            </View>
            <View style={styles.liveStatusItem}>
              <Text style={styles.liveStatusItemText}>7 Remaining</Text>
              <View style={styles.liveStatusItemIconWrapper}>
                <Ionicons name="time" size={18} color="#e95028" />
              </View>
            </View>
          </View>
        </View>

        {/* Timeline / Route Path */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Route Progress</Text>
          <View style={styles.timelineContent}>
            {busStops.map((stop, index) => (
              <View key={index} style={styles.timelineItem}>
                {/* Timeline Line */}
                {index < busStops.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    stop.status === 'completed' ? styles.timelineLineCompleted :
                    stop.status === 'current' ? styles.timelineLineCurrent : styles.timelineLineUpcoming
                  ]} />
                )}

                {/* Status Icon */}
                <View style={styles.timelineIconContainer}>
                  {getStatusIcon(stop.status)}
                </View>

                {/* Stop Details */}
                <View style={styles.timelineDetails}>
                  <Text style={[styles.timelineStopName, getStatusColor(stop.status)]}>
                    {stop.name}
                  </Text>
                  <Text style={styles.timelineStopEtaTime}>
                    {stop.eta} • {stop.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Driver Details */}
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={24} color="#6b7280" />
            </View>
            <View>
              <Text style={styles.driverName}>Rajesh Kumar</Text>
              <Text style={styles.driverRole}>Driver</Text>
            </View>
          </View>
          <View style={styles.driverContact}>
            <TouchableOpacity onPress={handleCall}>
              <Text style={styles.driverPhone}>+91 9876 543 210</Text>
            </TouchableOpacity>
            <Text style={styles.driverCallHint}>Tap to call</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    paddingTop: 40, // Adjust for status bar
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
  },
  content: {
    flex: 1,
    paddingTop: 100, // Space for fixed header
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16, // Equivalent to space-y-4
  },
  busInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  busId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e95028',
    fontFamily: 'Inter_700Bold', // Placeholder for custom font
  },
  routeSpeed: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  liveIndicator: {
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
    fontSize: 14,
    fontWeight: '500',
    color: '#22c55e',
    fontFamily: 'Inter_500Medium', // Placeholder for custom font
  },
  mapContainer: {
    height: 320, // Equivalent to h-80
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  busInfoPopup: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    zIndex: 30,
  },
  busInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  busInfoDistance: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold', // Placeholder for custom font
  },
  busInfoEtaSpeed: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  busInfoUpdate: {
    fontSize: 12,
    color: '#22c55e',
    marginTop: 4,
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statusCardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // Equivalent to gap-3
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  statusIconWrapper: {
    width: 32,
    height: 32,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter_700Bold', // Placeholder for custom font
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  nextStopCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextStopIconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStopLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  nextStopValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
  },
  liveStatusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  liveStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveStatusTime: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  liveStatusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16, // Equivalent to gap-4
    textAlign: 'center',
  },
  liveStatusItem: {
    alignItems: 'center',
    flex: 1,
  },
  liveStatusItemText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  liveStatusItemIconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
  },
  timelineContent: {
    gap: 16, // Equivalent to space-y-4
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 15, // Adjust to align with icon center
    top: 32, // Adjust to start below icon
    width: 2,
    height: 32, // Height of the line segment
  },
  timelineLineCompleted: {
    backgroundColor: '#22c55e',
  },
  timelineLineCurrent: {
    backgroundColor: '#e95028',
  },
  timelineLineUpcoming: {
    backgroundColor: '#d1d5db',
  },
  timelineIconContainer: {
    flexShrink: 0,
  },
  statusIconCompleted: {
    width: 16,
    height: 16,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconCurrent: {
    width: 16,
    height: 16,
    backgroundColor: '#e95028',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconUpcoming: {
    width: 16,
    height: 16,
    backgroundColor: '#d1d5db',
    borderRadius: 8,
  },
  timelineDetails: {
    flex: 1,
    minWidth: 0,
  },
  timelineStopName: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium', // Placeholder for custom font
  },
  timelineStopEtaTime: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  statusTextCompleted: {
    color: '#22c55e',
  },
  statusTextCurrent: {
    color: '#e95028',
  },
  statusTextUpcoming: {
    color: '#6b7280',
  },
  driverCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
  },
  driverRole: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
  driverContact: {
    alignItems: 'flex-end',
  },
  driverPhone: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
    fontFamily: 'Inter_500Medium', // Placeholder for custom font
  },
  driverCallHint: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular', // Placeholder for custom font
  },
});
