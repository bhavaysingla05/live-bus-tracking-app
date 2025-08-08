// data/busData.js
export const BUS_DATA = {
  busInfo: {
    id: 'HR65 6866',
    routeNumber: 'Route No-20',
    routeName: 'Panipat Huda Sec.11-12 (N.H.T)',
    driver: {
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      role: 'Driver'
    }
  },
  
  routes: {
    pickup: {
      routeName: 'Route No-20 Panipat Huda Sec.11-12 (N.H.T)',
      pickupPoint: 'T Point',
      pickupTime: '07:57',
      type: 'pickup'
    },
    drop: {
      routeName: 'Route No-20 Panipat Huda Sec.11-12 (N.H.T)',
      dropPoint: 'T Point',
      dropTime: '14:30',
      type: 'drop'
    }
  },

  tracking: {
    routePoints: [
      { latitude: 28.6100, longitude: 77.2000 },   // SDVM School
      { latitude: 28.6115, longitude: 77.2030 },  // Point 1
      { latitude: 28.6130, longitude: 77.2060 },  // Current position
      { latitude: 28.6145, longitude: 77.2090 },  // Point 2
      { latitude: 28.6160, longitude: 77.2120 },  // T Point
      { latitude: 28.6175, longitude: 77.2150 },  // Huda Sector 11-12
    ],
    
    busStops: [
      { 
        name: 'SDVM School', 
        status: 'completed', 
        eta: 'Completed', 
        time: '07:30', 
        coords: { latitude: 28.6100, longitude: 77.2000 },
        type: 'school',
        description: 'School pickup point'
      },
      { 
        name: 'Gurudwara Stop', 
        status: 'completed', 
        eta: 'Completed', 
        time: '07:45', 
        coords: { latitude: 28.6125, longitude: 77.2050 },
        type: 'landmark',
        description: 'Religious landmark'
      },
      { 
        name: 'T Point Junction', 
        status: 'current', 
        eta: '2 mins', 
        time: '07:57', 
        coords: { latitude: 28.6160, longitude: 77.2120 },
        type: 'junction',
        description: 'Main traffic junction'
      },
      { 
        name: 'Huda Sector 11-12', 
        status: 'upcoming', 
        eta: '8 mins', 
        time: '08:05', 
        coords: { latitude: 28.6175, longitude: 77.2150 },
        type: 'residential',
        description: 'Residential area'
      }
    ],

    initialPosition: { latitude: 28.6130, longitude: 77.2060 },
    initialSpeed: 24,
    initialDistance: 1.7,
    initialEta: 5
  },

  liveStatus: {
    totalStudents: 35,
    presentStudents: 28,
    atStops: 7,
    remaining: 7
  }
};

export const getBusPosition = (progress) => {
  const { routePoints } = BUS_DATA.tracking;
  const currentIndex = Math.floor(progress * (routePoints.length - 1));
  const nextIndex = Math.min(currentIndex + 1, routePoints.length - 1);
  const segmentProgress = (progress * (routePoints.length - 1)) - currentIndex;

  const currentPoint = routePoints[currentIndex];
  const nextPoint = routePoints[nextIndex];

  const newLatitude = currentPoint.latitude + (nextPoint.latitude - currentPoint.latitude) * segmentProgress;
  const newLongitude = currentPoint.longitude + (nextPoint.longitude - currentPoint.longitude) * segmentProgress;

  return { latitude: newLatitude, longitude: newLongitude };
};

export const calculateMetrics = (progress) => {
  const speed = Math.floor(20 + Math.random() * 10);
  const distance = Math.max(0.1, 1.7 - (progress * 1.6));
  const eta = Math.max(1, Math.floor(distance / speed * 60));

  return {
    speed,
    distance: parseFloat(distance.toFixed(1)),
    eta
  };
};

export const updateBusStops = (progress, currentEta) => {
  const { busStops } = BUS_DATA.tracking;
  
  if (progress > 0.6) {
    return [
      { ...busStops[0] },
      { ...busStops[1] },
      { ...busStops[2], status: 'completed', eta: 'Completed' },
      { ...busStops[3], status: 'current', eta: `${currentEta} mins` }
    ];
  }
  
  return busStops;
};
