// utils/helpers.js
import { Alert } from 'react-native';

export const formatTime = (date) => {
  if (!date) return '';
  
  try {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const showErrorAlert = (title = 'Error', message = 'Something went wrong') => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showSuccessAlert = (title = 'Success', message = 'Operation completed successfully') => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return '#22c55e';
    case 'current':
      return '#e95028';
    case 'upcoming':
      return '#6b7280';
    default:
      return '#6b7280';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'current':
      return 'In Progress';
    case 'upcoming':
      return 'Upcoming';
    default:
      return 'Unknown';
  }
};

export const isNetworkAvailable = () => {
  // This would typically check actual network connectivity
  // For prototype, we'll assume network is always available
  return true;
};

export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};
