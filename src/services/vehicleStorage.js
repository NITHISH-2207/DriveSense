/**
 * Vehicle, User & Telemetry Storage Service
 * Centralized data layer for managing vehicles, user accounts, and smart threshold evaluation.
 * Namespaced keys: 'drivesense:vehicles', 'drivesense:activeVehicleId', and 'drivesense:user'.
 */

const STORAGE_KEY_VEHICLES = 'drivesense:vehicles';
const STORAGE_KEY_ACTIVE_ID = 'drivesense:activeVehicleId';
const STORAGE_KEY_USER = 'drivesense:user';

// ============================================================================
// USER ACCOUNT PERSISTENCE (drivesense:user)
// ============================================================================

export const getUser = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading user from storage:', err);
  }
  return {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+91 98765 43210',
  };
};

export const saveUser = (userData) => {
  try {
    const current = getUser();
    const updated = {
      ...current,
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving user to storage:', err);
    return null;
  }
};

// ============================================================================
// VEHICLE DATASET & HELPERS
// ============================================================================

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

export const getManufacturingYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1990; y--) {
    years.push(y.toString());
  }
  return years;
};

export const getVehicles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_VEHICLES);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading vehicles from storage:', err);
    return [];
  }
};

export const saveVehicles = (vehicles) => {
  try {
    localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Error saving vehicles to storage:', err);
  }
};

export const getActiveVehicleId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || null;
  } catch (err) {
    console.error('Error reading active vehicle id:', err);
    return null;
  }
};

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

export const getActiveVehicle = () => {
  const vehicles = getVehicles();
  const activeId = getActiveVehicleId();
  if (!vehicles.length) return null;
  const active = vehicles.find((v) => v.id === activeId);
  return active || vehicles[0];
};

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

  if (vehicles.length === 0 || vehicleData.setAsActive) {
    setActiveVehicleId(newVehicle.id);
  }

  return newVehicle;
};

export const deleteVehicle = (id) => {
  const vehicles = getVehicles();
  const filtered = vehicles.filter((v) => v.id !== id);
  saveVehicles(filtered);

  if (getActiveVehicleId() === id) {
    setActiveVehicleId(filtered.length ? filtered[0].id : null);
  }
  return filtered;
};

// ============================================================================
// 3-TIER SMART THRESHOLD CONFIGURATION
//
// 1. Tyre Pressure:
//    - 28–35 PSI: Normal
//    - 24–27.9 or 35.1–38 PSI: Attention
//    - <24 or >38 PSI: Critical
// 2. Battery Voltage:
//    - 12.0–14.4 V: Normal
//    - 11.5–11.9 V or 14.5–14.9 V: Attention
//    - <11.5 V or >14.9 V: Critical
// 3. Temperature:
//    - <45°C: Normal
//    - 45–55°C: Attention
//    - >55°C: Critical
// 4. Fluid Level:
//    - >20%: Normal
//    - 10–20%: Attention
//    - <10%: Critical
// 5. Vehicle Motion:
//    - within ±5°: Stable (Normal)
//    - ±5–10°: Attention
//    - beyond ±10°: Critical
// ============================================================================

export const THRESHOLDS = {
  tyrePressure: {
    normalMin: 28,
    normalMax: 35,
    attentionMin: 24,
    attentionMax: 38,
    recommendedText: '28 – 35 PSI',
  },
  voltage: {
    normalMin: 12.0,
    normalMax: 14.4,
    attentionMin: 11.5,
    attentionMax: 14.9,
    recommendedText: '12.0 – 14.4 V',
  },
  temperature: {
    normalMax: 45,
    attentionMax: 55,
    recommendedText: 'below 45 °C',
  },
  fluid: {
    normalMin: 20,
    attentionMin: 10,
    recommendedText: 'above 20%',
  },
  motion: {
    normalMaxTilt: 5,
    attentionMaxTilt: 10,
    recommendedText: 'within ±5°',
  },
};

/**
 * Reusable Status Evaluators
 */
export const evaluateTyreStatus = (psi) => {
  if (psi >= THRESHOLDS.tyrePressure.normalMin && psi <= THRESHOLDS.tyrePressure.normalMax) {
    return 'Normal';
  }
  if (psi >= THRESHOLDS.tyrePressure.attentionMin && psi <= THRESHOLDS.tyrePressure.attentionMax) {
    return 'Attention';
  }
  return 'Critical';
};

export const evaluateVoltageStatus = (v) => {
  if (v >= THRESHOLDS.voltage.normalMin && v <= THRESHOLDS.voltage.normalMax) {
    return 'Normal';
  }
  if (v >= THRESHOLDS.voltage.attentionMin && v <= THRESHOLDS.voltage.attentionMax) {
    return 'Attention';
  }
  return 'Critical';
};

export const evaluateTempStatus = (temp) => {
  if (temp < THRESHOLDS.temperature.normalMax) {
    return 'Normal';
  }
  if (temp <= THRESHOLDS.temperature.attentionMax) {
    return 'Attention';
  }
  return 'Critical';
};

export const evaluateFluidStatus = (level) => {
  if (level > THRESHOLDS.fluid.normalMin) {
    return 'Normal';
  }
  if (level >= THRESHOLDS.fluid.attentionMin) {
    return 'Attention';
  }
  return 'Critical';
};

export const evaluateMotionStatus = (x, y) => {
  const maxTilt = Math.max(Math.abs(x), Math.abs(y));
  if (maxTilt <= THRESHOLDS.motion.normalMaxTilt) {
    return 'Stable';
  }
  if (maxTilt <= THRESHOLDS.motion.attentionMaxTilt) {
    return 'Attention';
  }
  return 'Critical';
};

/**
 * Status Severity Priority: Critical (2) > Attention (1) > Normal/Stable (0)
 */
export const getStatusSeverity = (status) => {
  if (status === 'Critical') return 2;
  if (status === 'Attention') return 1;
  return 0;
};

export const getWorstStatus = (statuses = []) => {
  let worst = 'Normal';
  for (const s of statuses) {
    if (s === 'Critical') return 'Critical';
    if (s === 'Attention') worst = 'Attention';
  }
  return worst;
};

// ============================================================================
// STATIC COPY — Fixed single-sentence copy (<90 chars) per status tier
// ============================================================================
export const SENSOR_COPY = {
  tyrePressure: {
    Normal: {
      explanation: 'All tyre pressures are within the recommended operating range.',
      suggestion: 'Maintain regular monthly checks to preserve tyre life.',
    },
    Attention: {
      explanation: 'One or more tyres are outside the standard 28–35 PSI range.',
      suggestion: 'Inspect and inflate or deflate tyres to standard pressure.',
    },
    Critical: {
      explanation: 'Critical tyre pressure deviation detected on one or more tyres.',
      suggestion: 'Inspect tyres immediately before driving at higher speeds.',
    },
  },
  voltage: {
    Normal: {
      explanation: 'Battery voltage is in the optimal 12.0–14.4 V operating range.',
      suggestion: 'Electrical system is functioning normally with regular driving.',
    },
    Attention: {
      explanation: 'Battery voltage is below the recommended operating range.',
      suggestion: 'Check the battery/charging system if the condition continues.',
    },
    Critical: {
      explanation: 'Battery voltage is critically low. Risk of starting failure.',
      suggestion: 'Charge or inspect the battery immediately.',
    },
  },
  temperature: {
    Normal: {
      explanation: 'Operating temperature is within the safe zone below 45°C.',
      suggestion: 'Thermal readings are nominal during standard operation.',
    },
    Attention: {
      explanation: 'Operating temperature has entered the 45–55°C caution zone.',
      suggestion: 'Allow cooling and verify coolant fluid levels.',
    },
    Critical: {
      explanation: 'Critical high temperature detected above 55°C.',
      suggestion: 'Stop safely and check cooling system immediately.',
    },
  },
  fluid: {
    Normal: {
      explanation: 'Fluid level is above the 20% minimum caution threshold.',
      suggestion: 'Fluid reserves are adequate for daily vehicle use.',
    },
    Attention: {
      explanation: 'Fluid level is low in the 10–20% caution range.',
      suggestion: 'Top up recommended vehicle fluids at the earliest.',
    },
    Critical: {
      explanation: 'Fluid level is critically low below 10%.',
      suggestion: 'Refill essential fluids immediately to protect components.',
    },
  },
  motion: {
    Stable: {
      explanation: 'Vehicle orientation is level within the ±5° range.',
      suggestion: 'Chassis attitude is stable on standard road grade.',
    },
    Attention: {
      explanation: 'Vehicle tilt is currently between 5° and 10°.',
      suggestion: 'Verify sensor calibration and road incline.',
    },
    Critical: {
      explanation: 'Severe vehicle tilt detected beyond ±10°.',
      suggestion: 'Ensure vehicle is safely parked on level terrain.',
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

// ============================================================================
// DEMO DATA GENERATOR WITH DEMONSTRABLE THRESHOLD SCENARIOS
//
// Demonstrates threshold states across vehicles:
// - Vehicle 1 (default): Battery is 11.7 V (Attention) & Front Right tyre is 27 PSI (Attention)
// - Vehicle 2: Temperature is 58.2 °C (Critical)
// - Vehicle 3+: All Normal
// ============================================================================
export const getVehicleSignals = (vehicleId = 'default_veh') => {
  const seed = hashString(vehicleId);
  const variant = seed % 3;

  let fl = 33;
  let fr = 33;
  let rl = 34;
  let rr = 34;
  let voltageNum = 12.8;
  let currentNum = 2.4;
  let tempNum = 37.8;
  let fluidNum = 77;
  let tiltX = 0;
  let tiltY = 0;
  let tiltZ = 0;

  if (variant === 0) {
    // Scenario A (Default / Vehicle 1): Attention on Battery (11.7 V) and Front Right Tyre (27 PSI)
    fr = 27; // Attention (24-27.9)
    voltageNum = 11.7; // Attention (11.5-11.9)
    currentNum = 2.7;
    tempNum = 37.8;
    fluidNum = 77;
  } else if (variant === 1) {
    // Scenario B (Vehicle 2): Critical on Temperature (58.2 °C) & Attention on Fluid (16%)
    tempNum = 58.2; // Critical (>55)
    fluidNum = 16; // Attention (10-20)
    voltageNum = 12.6;
    currentNum = 2.2;
    fl = 32;
    fr = 32;
    rl = 33;
    rr = 33;
  } else {
    // Scenario C (Vehicle 3+): All nominal (Normal / Stable)
    fl = 33;
    fr = 33;
    rl = 34;
    rr = 34;
    voltageNum = 12.9;
    currentNum = 2.3;
    tempNum = 37.5;
    fluidNum = 82;
  }

  const flStatus = evaluateTyreStatus(fl);
  const frStatus = evaluateTyreStatus(fr);
  const rlStatus = evaluateTyreStatus(rl);
  const rrStatus = evaluateTyreStatus(rr);

  // Overview Tyre status reflects the WORST status among 4 tyres
  const tyreOverallStatus = getWorstStatus([flStatus, frStatus, rlStatus, rrStatus]);

  const vStatus = evaluateVoltageStatus(voltageNum);
  const tStatus = evaluateTempStatus(tempNum);
  const fStatus = evaluateFluidStatus(fluidNum);
  const mStatus = evaluateMotionStatus(tiltX, tiltY);

  const avgTyrePressure = Math.round((fl + fr + rl + rr) / 4);

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
      average: avgTyrePressure,
      statusFL: flStatus,
      statusFR: frStatus,
      statusRL: rlStatus,
      statusRR: rrStatus,
      overallStatus: tyreOverallStatus,
      recommendedRange: THRESHOLDS.tyrePressure.recommendedText,
    },
    electrical: {
      title: 'Electrical System',
      voltage: `${voltageNum} V`,
      voltageNum,
      current: `${currentNum} A`,
      currentNum,
      voltageStatus: vStatus,
      electricalStatus: vStatus,
      recommendedRange: THRESHOLDS.voltage.recommendedText,
    },
    temperature: {
      title: 'Temperature',
      value: `${tempNum} °C`,
      numericValue: tempNum,
      tempStatus: tStatus,
      rangeMin: 20,
      rangeMax: 90,
      recommendedRange: THRESHOLDS.temperature.recommendedText,
    },
    fluid: {
      title: 'Fluid Monitoring',
      reading: `${fluidNum}%`,
      numericLevel: fluidNum,
      metricType: 'Fluid Level',
      fluidStatus: fStatus,
      recommendedRange: THRESHOLDS.fluid.recommendedText,
    },
    motion: {
      title: 'Vehicle Motion',
      motionState: mStatus === 'Stable' ? 'Stable' : mStatus,
      motionStatus: mStatus,
      pitchX: `${tiltX >= 0 ? '+' : ''}${tiltX}°`,
      rollY: `${tiltY >= 0 ? '+' : ''}${tiltY}°`,
      yawZ: `${tiltZ >= 0 ? '+' : ''}${tiltZ}°`,
      numericX: tiltX,
      numericY: tiltY,
      numericZ: tiltZ,
      recommendedRange: THRESHOLDS.motion.recommendedText,
    },
  };
};

// ============================================================================
// VEHICLE ABNORMAL CONDITIONS EXTRACTOR & ALERT DISMISSAL HELPERS
// ============================================================================

/**
 * Returns an array of active abnormal conditions for a given vehicle's signals.
 * Sorted by severity: Critical (highest) -> Attention.
 */
export const getVehicleAbnormalConditions = (vehicleId, signals) => {
  if (!signals) return [];

  const issues = [];

  // 1. Tyre Pressure
  if (signals.tyrePressure.overallStatus !== 'Normal') {
    const worstTyreStatus = signals.tyrePressure.overallStatus;
    const abnormalTyres = [];
    if (signals.tyrePressure.statusFL !== 'Normal') abnormalTyres.push(`Front Left: ${signals.tyrePressure.frontLeft} PSI`);
    if (signals.tyrePressure.statusFR !== 'Normal') abnormalTyres.push(`Front Right: ${signals.tyrePressure.frontRight} PSI`);
    if (signals.tyrePressure.statusRL !== 'Normal') abnormalTyres.push(`Rear Left: ${signals.tyrePressure.rearLeft} PSI`);
    if (signals.tyrePressure.statusRR !== 'Normal') abnormalTyres.push(`Rear Right: ${signals.tyrePressure.rearRight} PSI`);

    issues.push({
      id: 'tyre-pressure',
      subsystem: 'tyres',
      tabId: 'tyres',
      title: 'Tyre Pressure',
      headline: worstTyreStatus === 'Critical' ? 'Critical tyre pressure alert' : 'Tyre pressure needs attention',
      severity: worstTyreStatus,
      currentReading: abnormalTyres.join(', ') || `${signals.tyrePressure.average} PSI avg`,
      recommendedRange: THRESHOLDS.tyrePressure.recommendedText,
      explanation: SENSOR_COPY.tyrePressure[worstTyreStatus].explanation,
      suggestion: SENSOR_COPY.tyrePressure[worstTyreStatus].suggestion,
      actionLabel: 'View Tyres',
    });
  }

  // 2. Battery Voltage
  if (signals.electrical.voltageStatus !== 'Normal') {
    const sev = signals.electrical.voltageStatus;
    issues.push({
      id: 'battery-voltage',
      subsystem: 'battery',
      tabId: 'battery',
      title: 'Battery Voltage',
      headline: sev === 'Critical' ? 'Critical battery voltage alert' : 'Battery voltage needs attention',
      severity: sev,
      currentReading: signals.electrical.voltage,
      recommendedRange: THRESHOLDS.voltage.recommendedText,
      explanation: SENSOR_COPY.voltage[sev].explanation,
      suggestion: SENSOR_COPY.voltage[sev].suggestion,
      actionLabel: 'View Battery',
    });
  }

  // 3. Temperature
  if (signals.temperature.tempStatus !== 'Normal') {
    const sev = signals.temperature.tempStatus;
    issues.push({
      id: 'temperature',
      subsystem: 'temperature',
      tabId: 'temperature',
      title: 'Operating Temperature',
      headline: sev === 'Critical' ? 'Critical temperature alert' : 'Temperature elevated',
      severity: sev,
      currentReading: signals.temperature.value,
      recommendedRange: THRESHOLDS.temperature.recommendedText,
      explanation: SENSOR_COPY.temperature[sev].explanation,
      suggestion: SENSOR_COPY.temperature[sev].suggestion,
      actionLabel: 'View Temperature',
    });
  }

  // 4. Fluid Level
  if (signals.fluid.fluidStatus !== 'Normal') {
    const sev = signals.fluid.fluidStatus;
    issues.push({
      id: 'fluid-level',
      subsystem: 'fluids',
      tabId: 'fluids',
      title: 'Fluid Level',
      headline: sev === 'Critical' ? 'Critical fluid level alert' : 'Fluid level low',
      severity: sev,
      currentReading: signals.fluid.reading,
      recommendedRange: THRESHOLDS.fluid.recommendedText,
      explanation: SENSOR_COPY.fluid[sev].explanation,
      suggestion: SENSOR_COPY.fluid[sev].suggestion,
      actionLabel: 'View Fluids',
    });
  }

  // 5. Vehicle Motion
  if (signals.motion.motionStatus !== 'Stable') {
    const sev = signals.motion.motionStatus;
    issues.push({
      id: 'vehicle-motion',
      subsystem: 'motion',
      tabId: 'motion',
      title: 'Vehicle Motion',
      headline: sev === 'Critical' ? 'Critical tilt / orientation alert' : 'Unusual vehicle tilt',
      severity: sev,
      currentReading: `X: ${signals.motion.pitchX}, Y: ${signals.motion.rollY}`,
      recommendedRange: THRESHOLDS.motion.recommendedText,
      explanation: SENSOR_COPY.motion[sev].explanation,
      suggestion: SENSOR_COPY.motion[sev].suggestion,
      actionLabel: 'View Motion',
    });
  }

  // Sort: Critical (2) first, then Attention (1)
  return issues.sort((a, b) => getStatusSeverity(b.severity) - getStatusSeverity(a.severity));
};

/**
 * Session storage dismissal helpers (keyed per vehicle + condition)
 */
export const isAlertDismissed = (vehicleId, conditionId) => {
  try {
    return sessionStorage.getItem(`drivesense:dismissed:${vehicleId}:${conditionId}`) === 'true';
  } catch (err) {
    return false;
  }
};

export const dismissAlert = (vehicleId, conditionId) => {
  try {
    sessionStorage.setItem(`drivesense:dismissed:${vehicleId}:${conditionId}`, 'true');
  } catch (err) {
    console.error('Error recording alert dismissal:', err);
  }
};
