// components/TimelineItem.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TimelineItem = ({ stop, isLast, style }) => {
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

  return (
    <View style={[styles.timelineItem, style]}>
      {/* Timeline Line */}
      {!isLast && (
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
  );
};

const styles = StyleSheet.create({
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 32,
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
    fontFamily: 'Inter_500Medium',
  },
  timelineStopEtaTime: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
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
});

export default TimelineItem;
