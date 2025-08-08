// components/StatusCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusCard = ({ icon: Icon, value, label, style, iconColor = '#e95028' }) => {
  return (
    <View style={[styles.statusCard, style]}>
      <View style={styles.statusIconWrapper}>
        <Icon size={24} color={iconColor} />
      </View>
      <Text style={styles.statusValue}>{value}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: 'Inter_700Bold',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
  },
});

export default StatusCard;
