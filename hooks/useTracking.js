// hooks/useTracking.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { BUS_DATA, getBusPosition, calculateMetrics, updateBusStops } from '../data/busData';
import { formatTime, showErrorAlert } from '../utils/helpers';

export const useTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [busPosition, setBusPosition] = useState(BUS_DATA.tracking.initialPosition);
  const [routeProgress, setRouteProgress] = useState(0);
  const [speed, setSpeed] = useState(BUS_DATA.tracking.initialSpeed);
  const [distance, setDistance] = useState(BUS_DATA.tracking.initialDistance);
  const [eta, setEta] = useState(BUS_DATA.tracking.initialEta);
  const [busStops, setBusStops] = useState(BUS_DATA.tracking.busStops);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Start tracking simulation
  const startTracking = useCallback(() => {
    try {
      setIsTracking(true);
      setError(null);
      
      // Reset progress
      setRouteProgress(0);
      setBusPosition(BUS_DATA.tracking.initialPosition);
      setSpeed(BUS_DATA.tracking.initialSpeed);
      setDistance(BUS_DATA.tracking.initialDistance);
      setEta(BUS_DATA.tracking.initialEta);
      setBusStops(BUS_DATA.tracking.busStops);

      // Start progress simulation
      progressIntervalRef.current = setInterval(() => {
        setRouteProgress(prev => {
          const newProgress = prev + 0.008;
          if (newProgress >= 1) {
            // Reset to start for continuous simulation
            return 0;
          }
          return newProgress;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting tracking:', error);
      setError('Failed to start tracking');
      showErrorAlert('Tracking Error', 'Failed to start tracking. Please try again.');
    }
  }, []);

  // Stop tracking simulation
  const stopTracking = useCallback(() => {
    try {
      setIsTracking(false);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping tracking:', error);
    }
  }, []);

  // Update bus position and metrics based on progress
  useEffect(() => {
    if (!isTracking) return;

    try {
      // Calculate new position
      const newPosition = getBusPosition(routeProgress);
      setBusPosition(newPosition);

      // Calculate new metrics
      const metrics = calculateMetrics(routeProgress);
      setSpeed(metrics.speed);
      setDistance(metrics.distance);
      setEta(metrics.eta);

      // Update bus stops status
      const updatedBusStops = updateBusStops(routeProgress, metrics.eta);
      setBusStops(updatedBusStops);

      // Update last update time
      setLastUpdate(new Date());

    } catch (error) {
      console.error('Error updating tracking data:', error);
      setError('Failed to update tracking data');
    }
  }, [routeProgress, isTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get formatted current time
  const formattedTime = formatTime(currentTime);
  const formattedLastUpdate = formatTime(lastUpdate);

  // Get next stop info
  const nextStop = busStops.find(stop => stop.status === 'current') || busStops[0];

  return {
    // State
    currentTime,
    busPosition,
    routeProgress,
    speed,
    distance,
    eta,
    busStops,
    isTracking,
    error,
    lastUpdate,
    
    // Formatted values
    formattedTime,
    formattedLastUpdate,
    nextStop,
    
    // Actions
    startTracking,
    stopTracking,
    
    // Bus data
    busInfo: BUS_DATA.busInfo,
    liveStatus: BUS_DATA.liveStatus,
    routePoints: BUS_DATA.tracking.routePoints
  };
};
