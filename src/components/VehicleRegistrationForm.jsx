import React, { useState, useMemo } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Input } from './Input';
import { CustomSelect } from './CustomSelect';
import { ChipSelect } from './ChipSelect';
import { PrimaryAction } from './PrimaryAction';
import {
  VEHICLE_MANUFACTURERS,
  VEHICLE_TYPES,
  FUEL_TYPES,
  getManufacturingYears,
  addVehicle,
} from '../services/vehicleStorage';

/**
 * VehicleRegistrationForm: Inline Open Canvas vehicle registration experience.
 */
export const VehicleRegistrationForm = ({
  onSuccess,
  onCancel,
  showCancel = false,
  isAdditionalVehicle = false,
}) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    manufacturer: '',
    model: '',
    year: '',
    type: 'SUV',
    fuelType: 'Petrol',
    nickname: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const manufacturingYears = useMemo(() => getManufacturingYears(), []);

  // Compute available models based on selected manufacturer
  const availableModels = useMemo(() => {
    if (!formData.manufacturer) return [];
    const found = VEHICLE_MANUFACTURERS.find(
      (m) => m.name.toLowerCase() === formData.manufacturer.toLowerCase()
    );
    return found ? found.models : ['Standard'];
  }, [formData.manufacturer]);

  // Handle registration number with auto-uppercase
  const handleRegNumberChange = (e) => {
    const raw = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, registrationNumber: raw }));
    if (errors.registrationNumber) {
      setErrors((prev) => ({ ...prev, registrationNumber: null }));
    }
  };

  const handleManufacturerChange = (val) => {
    setFormData((prev) => ({ ...prev, manufacturer: val, model: '' }));
    if (errors.manufacturer) setErrors((prev) => ({ ...prev, manufacturer: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Registration number validation (loose Indian format check e.g. TN 38 AB 1234 or similar)
    const cleanReg = formData.registrationNumber.replace(/\s+/g, '');
    if (!cleanReg) {
      newErrors.registrationNumber = 'Enter your vehicle registration number.';
    } else if (cleanReg.length < 6 || cleanReg.length > 13) {
      newErrors.registrationNumber = 'Please check the registration number format (e.g. TN 38 AB 1234).';
    }

    if (!formData.manufacturer) {
      newErrors.manufacturer = 'Select your vehicle manufacturer.';
    }

    if (!formData.model) {
      newErrors.model = 'Select your vehicle model.';
    }

    if (!formData.year) {
      newErrors.year = 'Select the manufacturing year.';
    }

    if (!formData.type) {
      newErrors.type = 'Choose your vehicle type.';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Choose your fuel type.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      registrationNumber: true,
      manufacturer: true,
      model: true,
      year: true,
      type: true,
      fuelType: true,
    });

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const newVehicle = addVehicle({
        ...formData,
        setAsActive: !isAdditionalVehicle, // auto-active if first vehicle
      });
      setIsLoading(false);
      if (onSuccess) {
        onSuccess(newVehicle, isAdditionalVehicle);
      }
    }, 450);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-7 text-left" noValidate>
      {/* Top Cancel Affordance if user already has vehicles */}
      {showCancel && onCancel && (
        <div className="flex items-center justify-between pb-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736F] hover:text-[#176B5B] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>
      )}

      {/* 1. Registration Number */}
      <Input
        id="vehicle-reg-number"
        label="Registration Number"
        type="text"
        required
        placeholder="e.g. TN 38 AB 1234"
        value={formData.registrationNumber}
        onChange={handleRegNumberChange}
        error={touched.registrationNumber && errors.registrationNumber}
      />

      {/* 2. Manufacturer & Model (2-column layout on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomSelect
          id="vehicle-manufacturer"
          label="Manufacturer"
          required
          placeholder="Select brand"
          options={VEHICLE_MANUFACTURERS.map((m) => m.name)}
          value={formData.manufacturer}
          onChange={handleManufacturerChange}
          error={touched.manufacturer && errors.manufacturer}
        />

        <CustomSelect
          id="vehicle-model"
          label="Model"
          required
          placeholder={formData.manufacturer ? 'Select model' : 'Choose brand first'}
          options={availableModels}
          value={formData.model}
          disabled={!formData.manufacturer}
          onChange={(val) => {
            setFormData((prev) => ({ ...prev, model: val }));
            if (errors.model) setErrors((prev) => ({ ...prev, model: null }));
          }}
          error={touched.model && errors.model}
        />
      </div>

      {/* 3. Manufacturing Year & Nickname */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomSelect
          id="vehicle-year"
          label="Manufacturing Year"
          required
          placeholder="Select year"
          options={manufacturingYears}
          value={formData.year}
          onChange={(val) => {
            setFormData((prev) => ({ ...prev, year: val }));
            if (errors.year) setErrors((prev) => ({ ...prev, year: null }));
          }}
          error={touched.year && errors.year}
        />

        <Input
          id="vehicle-nickname"
          label="Nickname (Optional)"
          type="text"
          placeholder="e.g. My Daily Drive"
          value={formData.nickname}
          onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
        />
      </div>

      {/* 4. Vehicle Type Selection */}
      <ChipSelect
        label="Vehicle Type"
        required
        options={VEHICLE_TYPES}
        value={formData.type}
        onChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
        error={touched.type && errors.type}
      />

      {/* 5. Fuel Type Selection */}
      <ChipSelect
        label="Fuel Type"
        required
        options={FUEL_TYPES}
        value={formData.fuelType}
        onChange={(val) => setFormData((prev) => ({ ...prev, fuelType: val }))}
        error={touched.fuelType && errors.fuelType}
      />

      {/* Submit Action */}
      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <PrimaryAction type="submit" isLoading={isLoading}>
          {isAdditionalVehicle ? 'Add Vehicle' : 'Add Vehicle'}
        </PrimaryAction>

        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#66736F] hover:text-[#1F2927] transition-colors py-2 px-1 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default VehicleRegistrationForm;
