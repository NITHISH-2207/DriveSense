/**
 * Vehicle Storage Service
 * Centralized data layer for managing vehicles and active vehicle selection.
 * Namespaced keys: 'drivesense:vehicles' and 'drivesense:activeVehicleId'.
 */

const STORAGE_KEY_VEHICLES = 'drivesense:vehicles';
const STORAGE_KEY_ACTIVE_ID = 'drivesense:activeVehicleId';

// Manufacturer and Model Mock Dataset (easy to swap with backend API)
export const VEHICLE_MANUFACTURERS = [
  { id: 'hyundai', name: 'Hyundai', models: ['Creta', 'Venue', 'i20', 'Verna', 'Tucson'] },
  { id: 'tata', name: 'Tata', models: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago'] },
  { id: 'maruti', name: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Grand Vitara', 'Dzire'] },
  { id: 'mahindra', name: 'Mahindra', models: ['XUV700', 'Scorpio-N', 'Thar', 'XUV300', 'Bolero'] },
  { id: 'toyota', name: 'Toyota', models: ['Innova Hycross', 'Fortuner', 'Urban Cruiser', 'Glanza'] },
  { id: 'honda', name: 'Honda', models: ['City', 'Elevate', 'Amaze'] },
  { id: 'kia', name: 'Kia', models: ['Seltos', 'Sonet', 'Carens', 'EV6'] },
  { id: 'other', name: 'Other', models: ['Custom / Other Model'] },
];

export const VEHICLE_TYPES = [
  'SUV',
  'Sedan',
  'Hatchback',
  'Car',
  'Motorcycle',
  'Other',
];

export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'CNG',
  'Other',
];

// Generate manufacturing year range from current year down to 1990
export const getManufacturingYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1990; y--) {
    years.push(y.toString());
  }
  return years;
};

/**
 * Get all registered vehicles from localStorage
 */
export const getVehicles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_VEHICLES);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading vehicles from storage:', err);
    return [];
  }
};

/**
 * Save vehicle list to localStorage
 */
export const saveVehicles = (vehicles) => {
  try {
    localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Error saving vehicles to storage:', err);
  }
};

/**
 * Get current active vehicle ID
 */
export const getActiveVehicleId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || null;
  } catch (err) {
    console.error('Error reading active vehicle id:', err);
    return null;
  }
};

/**
 * Set active vehicle ID
 */
export const setActiveVehicleId = (id) => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  } catch (err) {
    console.error('Error setting active vehicle id:', err);
  }
};

/**
 * Get the full active vehicle object
 */
export const getActiveVehicle = () => {
  const vehicles = getVehicles();
  const activeId = getActiveVehicleId();
  if (!vehicles.length) return null;
  const active = vehicles.find((v) => v.id === activeId);
  return active || vehicles[0]; // fallback to first vehicle if activeId is invalid
};

/**
 * Add a new vehicle to storage and return it
 */
export const addVehicle = (vehicleData) => {
  const vehicles = getVehicles();
  const newVehicle = {
    id: `veh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    registrationNumber: vehicleData.registrationNumber.trim().toUpperCase(),
    manufacturer: vehicleData.manufacturer,
    model: vehicleData.model,
    year: vehicleData.year,
    type: vehicleData.type,
    fuelType: vehicleData.fuelType,
    nickname: vehicleData.nickname ? vehicleData.nickname.trim() : '',
    createdAt: new Date().toISOString(),
  };

  const updatedVehicles = [...vehicles, newVehicle];
  saveVehicles(updatedVehicles);

  // If this is the only vehicle, make it active automatically
  if (vehicles.length === 0 || vehicleData.setAsActive) {
    setActiveVehicleId(newVehicle.id);
  }

  return newVehicle;
};

/**
 * Delete a vehicle by ID
 */
export const deleteVehicle = (id) => {
  const vehicles = getVehicles();
  const filtered = vehicles.filter((v) => v.id !== id);
  saveVehicles(filtered);

  // If the deleted vehicle was active, set active to the first remaining vehicle
  if (getActiveVehicleId() === id) {
    setActiveVehicleId(filtered.length ? filtered[0].id : null);
  }
  return filtered;
};

// ============================================================================
// STATUS THRESHOLDS (frontend-only, illustrative)
// - Tyre Pressure: 28–35 PSI → Normal, outside → Attention
// - Battery Voltage: 12.0–14.4 V → Normal, outside → Attention
// - Temperature: below 45°C → Normal, at/above → Attention
// - Fluids: above 20% → Normal, at/below → Attention
// - Motion: any tilt within ±5° → Stable, beyond → Attention
// ============================================================================
export const THRESHOLDS = {
  tyrePressure: { min: 28, max: 35 },
  voltage: { min: 12.0, max: 14.4 },
  temperature: { max: 45 },
  fluid: { min: 20 },
  motion: { maxTilt: 5 },
};

export const evaluateTyreStatus = (psi) =>
  psi >= THRESHOLDS.tyrePressure.min && psi <= THRESHOLDS.tyrePressure.max ? 'Normal' : 'Attention';

export const evaluateVoltageStatus = (v) =>
  v >= THRESHOLDS.voltage.min && v <= THRESHOLDS.voltage.max ? 'Normal' : 'Attention';

export const evaluateTempStatus = (temp) =>
  temp < THRESHOLDS.temperature.max ? 'Normal' : 'Attention';

export const evaluateFluidStatus = (level) =>
  level > THRESHOLDS.fluid.min ? 'Normal' : 'Attention';

export const evaluateMotionStatus = (x, y) =>
  Math.abs(x) <= THRESHOLDS.motion.maxTilt && Math.abs(y) <= THRESHOLDS.motion.maxTilt ? 'Stable' : 'Attention';

// ============================================================================
// STATIC COPY — Fixed single-sentence copy (<90 chars) per status bucket
// ============================================================================
export const SENSOR_COPY = {
  tyrePressure: {
    Normal: {
      explanation: 'All tyre pressures are within the recommended operating range.',
      suggestion: 'Maintain regular monthly checks to preserve tyre life.',
    },
    Attention: {
      explanation: 'One or more tyres are outside the 28–35 PSI range.',
      suggestion: 'Inspect and inflate or deflate tyres to standard pressure.',
    },
  },
  voltage: {
    Normal: {
      explanation: 'Battery voltage is in the optimal 12.0–14.4 V operating range.',
      suggestion: 'Electrical system is functioning normally with regular driving.',
    },
    Attention: {
      explanation: 'Battery voltage is outside the safe 12.0–14.4 V range.',
      suggestion: 'Check battery terminals and charging system health soon.',
    },
  },
  temperature: {
    Normal: {
      explanation: 'Operating temperature is within the safe zone below 45°C.',
      suggestion: 'Thermal readings are nominal during standard operation.',
    },
    Attention: {
      explanation: 'Temperature is at or above the 45°C caution threshold.',
      suggestion: 'Allow cooling and verify coolant fluid levels.',
    },
  },
  fluid: {
    Normal: {
      explanation: 'Fluid level is above the 20% minimum caution threshold.',
      suggestion: 'Fluid reserves are adequate for daily vehicle use.',
    },
    Attention: {
      explanation: 'Fluid level has dropped to 20% or below.',
      suggestion: 'Top up recommended vehicle fluids at the earliest.',
    },
  },
  motion: {
    Stable: {
      explanation: 'Vehicle orientation is level within the ±5° range.',
      suggestion: 'Chassis attitude is stable on standard road grade.',
    },
    Attention: {
      explanation: 'Vehicle pitch or roll exceeds the ±5° threshold.',
      suggestion: 'Verify sensor calibration and road incline.',
    },
  },
};

/**
 * Deterministic seeded hash helper from string ID
 */
const hashString = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * Get deterministic vehicle signal telemetry data for a given vehicle ID.
 * Default values land on Normal / Stable as specified.
 */
export const getVehicleSignals = (vehicleId) => {
  const seed = hashString(vehicleId || 'default_veh');

  // Baseline values land on Normal / Stable
  const fl = 32 + ((seed % 3) - 1); // 31-33 (Normal)
  const fr = 32 + (((seed >> 2) % 3) - 1); // 31-33 (Normal)
  const rl = 33 + (((seed >> 4) % 3) - 1); // 32-34 (Normal)
  const rr = 33 + (((seed >> 6) % 3) - 1); // 32-34 (Normal)

  const voltageNum = parseFloat((12.5 + ((seed % 5) * 0.2)).toFixed(1)); // 12.5 - 13.3 V (Normal)
  const currentNum = parseFloat((2.1 + ((seed % 4) * 0.2)).toFixed(1)); // 2.1 - 2.7 A
  const tempNum = parseFloat((37.0 + ((seed % 5) * 1.2)).toFixed(1)); // 37.0 - 41.8 °C (Normal < 45)
  const fluidNum = 75 + (seed % 15); // 75 - 89% (Normal > 20)

  const tiltX = (seed % 3) - 1; // -1 to +1° (Stable <= 5)
  const tiltY = ((seed >> 3) % 3) - 1; // -1 to +1° (Stable <= 5)
  const tiltZ = 0;

  const flStatus = evaluateTyreStatus(fl);
  const frStatus = evaluateTyreStatus(fr);
  const rlStatus = evaluateTyreStatus(rl);
  const rrStatus = evaluateTyreStatus(rr);
  const tyreOverall = [flStatus, frStatus, rlStatus, rrStatus].includes('Attention') ? 'Attention' : 'Normal';

  const vStatus = evaluateVoltageStatus(voltageNum);
  const tStatus = evaluateTempStatus(tempNum);
  const fStatus = evaluateFluidStatus(fluidNum);
  const mStatus = evaluateMotionStatus(tiltX, tiltY);

  return {
    overview: {
      vehicleStatus: 'Monitoring Active',
      signalsCount: 5,
    },
    tyrePressure: {
      title: 'Tyre Pressure',
      unit: 'PSI',
      frontLeft: fl,
      frontRight: fr,
      rearLeft: rl,
      rearRight: rr,
      statusFL: flStatus,
      statusFR: frStatus,
      statusRL: rlStatus,
      statusRR: rrStatus,
      overallStatus: tyreOverall,
    },
    electrical: {
      title: 'Electrical System',
      voltage: `${voltageNum} V`,
      voltageNum,
      current: `${currentNum} A`,
      currentNum,
      voltageStatus: vStatus,
      electricalStatus: vStatus === 'Normal' ? 'Normal' : 'Attention',
    },
    temperature: {
      title: 'Temperature',
      value: `${tempNum} °C`,
      numericValue: tempNum,
      tempStatus: tStatus,
      rangeMin: 20,
      rangeMax: 90,
    },
    fluid: {
      title: 'Fluid Monitoring',
      reading: `${fluidNum}%`,
      numericLevel: fluidNum,
      metricType: 'Fluid Level',
      fluidStatus: fStatus,
    },
    motion: {
      title: 'Vehicle Motion',
      motionState: mStatus === 'Stable' ? 'Stable' : 'Attention',
      motionStatus: mStatus,
      pitchX: `${tiltX >= 0 ? '+' : ''}${tiltX}°`,
      rollY: `${tiltY >= 0 ? '+' : ''}${tiltY}°`,
      yawZ: `${tiltZ >= 0 ? '+' : ''}${tiltZ}°`,
      numericX: tiltX,
      numericY: tiltY,
      numericZ: tiltZ,
    },
  };
};
