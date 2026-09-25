import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { DriveField } from '../components/DriveField';
import { PrimaryAction } from '../components/PrimaryAction';
import { VehicleRegistrationForm } from '../components/VehicleRegistrationForm';
import { VehicleTelemetrySection } from '../components/VehicleTelemetrySection';
import { PageTransition } from '../components/PageTransition';
import {
  getVehicles,
  getActiveVehicle,
  setActiveVehicleId,
  getVehicleSignals,
} from '../services/vehicleStorage';

/**
 * HomePage: The DriveSense Home Experience.
 *
 * Visual Structure:
 * 1. Header: DriveSense Logo | Overview Tyres Battery Fluids Temperature Motion | Active Vehicle Switcher
 * 2. Active Vehicle Identity Block (Active Vehicle label, Name, Reg Number details, Greeting)
 * 3. Selected Information Stage (Overview / Tyres / Battery / Fluids / Temperature / Motion)
 */
export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [mode, setMode] = useState('loading'); // 'invitation' | 'register' | 'success' | 'active'
  const [newlyAddedVehicle, setNewlyAddedVehicle] = useState(null);
  const [isAdditionalFlow, setIsAdditionalFlow] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Sync data from storage
  const syncVehicleState = () => {
    const list = getVehicles();
    const current = getActiveVehicle();
    setVehicles(list);
    setActiveVehicle(current);

    const setupQuery = searchParams.get('setup');

    if (setupQuery === 'new') {
      setMode('register');
      setIsAdditionalFlow(list.length > 0);
    } else if (list.length === 0) {
      setMode('invitation');
    } else {
      setMode('active');
    }
  };

  useEffect(() => {
    syncVehicleState();
  }, [searchParams]);

  // Handle successful vehicle addition
  const handleRegistrationSuccess = (newVehicle, isAdditional) => {
    setNewlyAddedVehicle(newVehicle);
    setIsAdditionalFlow(isAdditional);
    setMode('success');
    if (searchParams.get('setup')) {
      searchParams.delete('setup');
      setSearchParams(searchParams, { replace: true });
    }
  };

  // Complete success transition to active home
  const handleProceedToActive = (makeActive = true) => {
    if (makeActive && newlyAddedVehicle) {
      setActiveVehicleId(newlyAddedVehicle.id);
    }
    syncVehicleState();
    setMode('active');
    setActiveTab('overview');
  };

  // Cancel registration and return
  const handleCancelRegistration = () => {
    if (searchParams.get('setup')) {
      searchParams.delete('setup');
      setSearchParams(searchParams, { replace: true });
    }
    syncVehicleState();
  };

  const isVehicleContext = mode === 'active' && !!activeVehicle;

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-[#FAFCFB] open-canvas-gradient flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-10 lg:px-16 relative overflow-hidden">
        {/* Top Navigation Bar with Integrated Vehicle Tabs in Vehicle Context */}
        <AppHeader
          isVehicleContext={isVehicleContext}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onVehicleSwitch={(v) => {
            setActiveVehicle(v);
            setMode('active');
          }}
          onAddNewVehicle={() => {
            setIsAdditionalFlow(true);
            setMode('register');
          }}
        />

        {/* Main Content Stage */}
        <main className="w-full max-w-6xl mx-auto my-auto relative z-10 py-4 lg:py-8">
          <AnimatePresence mode="wait">
            {/* ========================================================================= */}
            {/* STATE 1: FIRST-TIME WELCOME INVITATION (0 Vehicles)                       */}
            {/* ========================================================================= */}
            {mode === 'invitation' && (
              <motion.div
                key="invitation-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
              >
                {/* Ambient Drive Field */}
                <div className="absolute inset-0 flex items-center justify-center lg:justify-end pointer-events-none -z-10 opacity-70 lg:opacity-100">
                  <div className="w-full max-w-2xl lg:max-w-3xl translate-y-4 lg:translate-y-0 lg:translate-x-12">
                    <DriveField variant="login" />
                  </div>
                </div>

                {/* Left Text / Invitation */}
                <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F5F1] text-[#176B5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C9A70]" />
                    <span>Your DriveSense space is ready</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2927] tracking-tight leading-[1.1]">
                    Let&apos;s get your vehicle ready.
                  </h1>

                  <p className="text-base sm:text-lg text-[#66736F] font-normal leading-relaxed">
                    Add your vehicle details to begin your DriveSense experience. We&apos;ll prepare your companion environment.
                  </p>

                  <div className="pt-3">
                    <PrimaryAction
                      onClick={() => {
                        setIsAdditionalFlow(false);
                        setMode('register');
                      }}
                    >
                      Add your vehicle
                    </PrimaryAction>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STATE 2: INLINE VEHICLE REGISTRATION FORM                                 */}
            {/* ========================================================================= */}
            {mode === 'register' && (
              <motion.div
                key="register-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start"
              >
                {/* Left Editorial Header */}
                <div className="lg:col-span-5 text-left space-y-3 sticky top-12">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2927] tracking-tight leading-tight">
                    {isAdditionalFlow ? 'Add another vehicle.' : "Let's get your vehicle ready."}
                  </h1>

                  <p className="text-sm sm:text-base text-[#66736F] font-normal leading-relaxed">
                    {isAdditionalFlow
                      ? 'Keep multiple vehicles in DriveSense and switch between them whenever you need.'
                      : 'Tell us a little about the vehicle you want to monitor. You can add more vehicles later.'}
                  </p>

                  <div className="pt-6 hidden lg:block opacity-60 pointer-events-none">
                    <DriveField variant="signup" />
                  </div>
                </div>

                {/* Right Open Canvas Form */}
                <div className="lg:col-span-7 w-full max-w-xl">
                  <VehicleRegistrationForm
                    onSuccess={handleRegistrationSuccess}
                    onCancel={handleCancelRegistration}
                    showCancel={vehicles.length > 0}
                    isAdditionalVehicle={isAdditionalFlow}
                  />
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STATE 3: IN-PLACE SUCCESS EXPERIENCE                                      */}
            {/* ========================================================================= */}
            {mode === 'success' && newlyAddedVehicle && (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl text-left space-y-5 my-8"
              >
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] bg-[#E8F5F1] px-3.5 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-[#3C9A70]" />
                  <span>Vehicle registration complete</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
                  Your vehicle is ready.
                </h1>

                {/* Vehicle Identity Showcase */}
                <div className="py-4 border-y border-[#DCE7E3] space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#176B5B]">
                    {newlyAddedVehicle.nickname || `${newlyAddedVehicle.manufacturer} ${newlyAddedVehicle.model}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#66736F] font-mono uppercase tracking-wider">
                    {newlyAddedVehicle.registrationNumber} • {newlyAddedVehicle.year} • {newlyAddedVehicle.type} • {newlyAddedVehicle.fuelType}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#66736F] leading-relaxed">
                  {isAdditionalFlow
                    ? 'The vehicle has been added to your DriveSense account.'
                    : 'This is now your active vehicle. Your DriveSense companion environment is configured.'}
                </p>

                {/* CTA to proceed into Home */}
                <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <PrimaryAction onClick={() => handleProceedToActive(true)}>
                    {isAdditionalFlow ? 'Make Active & View Home' : 'Explore DriveSense'}
                  </PrimaryAction>

                  {isAdditionalFlow && (
                    <button
                      type="button"
                      onClick={() => handleProceedToActive(false)}
                      className="text-xs font-semibold text-[#66736F] hover:text-[#1F2927] py-2 px-1 cursor-pointer"
                    >
                      Keep Current Active Vehicle
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STATE 4: ACTIVE VEHICLE HOME VIEW                                         */}
            {/* User Flow: Header Nav -> Active Vehicle Identity -> Selected Information */}
            {/* ========================================================================= */}
            {mode === 'active' && activeVehicle && (
              <motion.div
                key={`active-vehicle-${activeVehicle.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 text-left"
              >
                {/* 1. Active Vehicle Identity Section */}
                <div className="space-y-2 border-b border-[#DCE7E3] pb-5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C9A70]" />
                    <span>Active Vehicle</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <div>
                      <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
                        {activeVehicle.nickname || `${activeVehicle.manufacturer} ${activeVehicle.model}`}
                      </h1>
                      <p className="mt-1 text-xs sm:text-sm text-[#66736F] font-mono uppercase tracking-wider">
                        {activeVehicle.registrationNumber} • {activeVehicle.year} • {activeVehicle.type} • {activeVehicle.fuelType}
                      </p>
                    </div>

                    <p className="text-xs text-[#66736F]">
                      Good to see you. DriveSense is monitoring this vehicle.
                    </p>
                  </div>
                </div>

                {/* 2. Selected Vehicle Information Section */}
                <VehicleTelemetrySection
                  signals={getVehicleSignals(activeVehicle.id)}
                  vehicleName={activeVehicle.nickname || `${activeVehicle.manufacturer} ${activeVehicle.model}`}
                  activeTab={activeTab}
                  onSelectTab={setActiveTab}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Minimal Bottom Spacer */}
        <div className="w-full max-w-6xl mx-auto opacity-0 pointer-events-none text-xs">
          DriveSense
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
