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
