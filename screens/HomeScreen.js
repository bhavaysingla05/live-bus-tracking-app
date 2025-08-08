    // screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BUS_DATA } from '../data/busData';
import { showErrorAlert, debounce } from '../utils/helpers';

export default function HomeScreen() {
  const [trackingPickup, setTrackingPickup] = useState(false);
  const [trackingDrop, setTrackingDrop] = useState(false);
  const navigation = useNavigation();

  const handleTrackPickup = useCallback(() => {
    try {
      setTrackingPickup(true);
      setTimeout(() => {
        setTrackingPickup(false);
        navigation.navigate('Tracking', { type: 'pickup' });
      }, 1000);
    } catch (error) {
      console.error('Error navigating to pickup tracking:', error);
      setTrackingPickup(false);
      showErrorAlert('Navigation Error', 'Failed to start pickup tracking. Please try again.');
    }
  }, [navigation]);

  const handleTrackDrop = useCallback(() => {
    try {
      setTrackingDrop(true);
      setTimeout(() => {
        setTrackingDrop(false);
        navigation.navigate('Tracking', { type: 'drop' });
      }, 1000);
    } catch (error) {
      console.error('Error navigating to drop tracking:', error);
      setTrackingDrop(false);
      showErrorAlert('Navigation Error', 'Failed to start drop tracking. Please try again.');
    }
  }, [navigation]);

  const handleBack = useCallback(() => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => {} }
      ]
    );
  }, []);

      return (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {/* <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#e95028" />
            </TouchableOpacity> */}
            <MaterialCommunityIcons name="bus" size={28} color="#e95028" />
            <Text style={styles.headerTitle}>Bus Transport</Text>
          </View>

          {/* Main Content */}
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Pickup Details Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>PICKUP DETAILS</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Route Name</Text>
                  <Text style={styles.detailValue}>{BUS_DATA.routes.pickup.routeName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pickup Point</Text>
                  <Text style={styles.detailValue}>{BUS_DATA.routes.pickup.pickupPoint}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pickup Time</Text>
                  <Text style={styles.timeValue}>{BUS_DATA.routes.pickup.pickupTime}</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  onPress={handleTrackPickup}
                  disabled={trackingPickup}
                  style={[styles.trackButton, trackingPickup && styles.trackButtonDisabled]}
                  accessible={true}
                  accessibilityLabel="Track pickup bus"
                  accessibilityHint="Tracks the pickup bus location and route"
                  accessibilityRole="button"
                >
                  <View style={styles.trackButtonContent}>
                    {trackingPickup ? (
                      <>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.trackButtonText}>Tracking...</Text>
                      </>
                    ) : (
                      <>
                        <MaterialCommunityIcons name="map-marker" size={18} color="#fff" />
                        <Text style={styles.trackButtonText}>Track Pickup Bus</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Drop Details Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>DROP DETAILS</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Route Name</Text>
                  <Text style={styles.detailValue}>{BUS_DATA.routes.drop.routeName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Drop Point</Text>
                  <Text style={styles.detailValue}>{BUS_DATA.routes.drop.dropPoint}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Drop Time</Text>
                  <Text style={styles.timeValue}>{BUS_DATA.routes.drop.dropTime}</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  onPress={handleTrackDrop}
                  disabled={trackingDrop}
                  style={[styles.trackButton, trackingDrop && styles.trackButtonDisabled]}
                  accessible={true}
                  accessibilityLabel="Track drop bus"
                  accessibilityHint="Tracks the drop bus location and route"
                  accessibilityRole="button"
                >
                  <View style={styles.trackButtonContent}>
                    {trackingDrop ? (
                      <>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.trackButtonText}>Tracking...</Text>
                      </>
                    ) : (
                      <>
                        <MaterialCommunityIcons name="map-marker" size={18} color="#fff" />
                        <Text style={styles.trackButtonText}>Track Drop Bus</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
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
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8,
        color: '#e95028',
        fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
      },
      content: {
        flex: 1,
        paddingTop: 100, // Space for fixed header
        paddingHorizontal: 16,
      },
      contentContainer: {
        paddingBottom: 20,
        gap: 16, // Equivalent to space-y-4
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 2,
        borderColor: '#f3f4f6',
      },
      cardHeader: {
        backgroundColor: '#f9fafb',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      cardHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4b5563',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
      },
      cardBody: {
        padding: 16,
        gap: 12, // Equivalent to space-y-3
      },
      detailRow: {
        marginBottom: 4,
      },
      detailLabel: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 4,
        fontFamily: 'Inter_400Regular', // Placeholder for custom font
      },
      detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
        fontFamily: 'Inter_500Medium', // Placeholder for custom font
      },
      timeValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e95028',
        fontFamily: 'Inter_600SemiBold', // Placeholder for custom font
      },
      cardFooter: {
        paddingHorizontal: 16,
        paddingBottom: 16,
      },
      trackButton: {
        width: '100%',
        backgroundColor: '#e95028',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#e95028',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      },
      trackButtonDisabled: {
        opacity: 0.7,
      },
      trackButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      },
      trackButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
        fontFamily: 'Inter_500Medium', // Placeholder for custom font
      },
    });
    