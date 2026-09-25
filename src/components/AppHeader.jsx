import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Plus, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DriveSenseLogo } from './DriveSenseLogo';
import {
  getVehicles,
  getActiveVehicle,
  setActiveVehicleId,
} from '../services/vehicleStorage';

/**
 * AppHeader: Main navigation bar for DriveSense.
 *
 * Modes:
 * 1. Vehicle Context Mode (/home with active vehicle):
 *    - DriveSense logo + in-page tabs (Overview, Tyres, Battery, Fluids, Temperature, Motion)
 *    - Right: Active Vehicle / User element with flyout (vehicle switching, My Vehicles link, + Add Vehicle)
 * 2. Standard Mode (/vehicles, invitation, etc.):
 *    - DriveSense logo + Home | My Vehicles links
 */
export const AppHeader = ({
  isVehicleContext = false,
  activeTab = 'overview',
  onSelectTab,
  onVehicleSwitch,
  onAddNewVehicle,
}) => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const flyoutRef = useRef(null);

  const vehicleTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tyres', label: 'Tyres' },
    { id: 'battery', label: 'Battery' },
    { id: 'fluids', label: 'Fluids' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'motion', label: 'Motion' },
  ];

  const refreshData = () => {
    const list = getVehicles();
    const current = getActiveVehicle();
    setVehicles(list);
    setActiveVehicle(current);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Close flyout on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setIsSwitcherOpen(false);
      }
    };
    if (isSwitcherOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSwitcherOpen]);

  const handleSelectVehicle = (vehicle) => {
    setActiveVehicleId(vehicle.id);
    setActiveVehicle(vehicle);
    setIsSwitcherOpen(false);
    if (onVehicleSwitch) {
      onVehicleSwitch(vehicle);
    }
  };

  const handleAddClick = () => {
    setIsSwitcherOpen(false);
    if (onAddNewVehicle) {
      onAddNewVehicle();
    } else {
      navigate('/home?setup=new');
    }
  };

  const handleOpenVehiclesPage = () => {
    setIsSwitcherOpen(false);
    navigate('/vehicles');
  };

  const displayName = activeVehicle
    ? activeVehicle.nickname || `${activeVehicle.manufacturer} ${activeVehicle.model}`
    : 'No Vehicle';

  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6 pb-6 sm:pb-8 relative z-30 select-none">
      {/* Left: Brand Logo */}
      <div className="shrink-0 flex items-center">
        <DriveSenseLogo size="md" to="/home" />
      </div>

      {/* Center: Vehicle Information Tabs (on vehicle page) OR Standard Nav (on other pages) */}
      {isVehicleContext ? (
        <nav
          className="flex-1 flex items-center justify-start sm:justify-center gap-1 sm:gap-6 overflow-x-auto scrollbar-none px-1 py-1"
          aria-label="Vehicle information sections"
        >
          {vehicleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab && onSelectTab(tab.id)}
                className={`relative py-1.5 px-2 sm:px-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded ${
                  isActive
                    ? 'text-[#176B5B] font-semibold'
                    : 'text-[#66736F] hover:text-[#1F2927]'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="header-vehicle-tab-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#176B5B] rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      ) : (
        <nav className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `transition-colors duration-150 relative py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded ${
                isActive ? 'text-[#176B5B] font-semibold' : 'text-[#66736F] hover:text-[#1F2927]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Home</span>
                {isActive && (
                  <motion.div
                    layoutId="header-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#176B5B]"
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/vehicles"
            className={({ isActive }) =>
              `transition-colors duration-150 relative py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded ${
                isActive ? 'text-[#176B5B] font-semibold' : 'text-[#66736F] hover:text-[#1F2927]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>My Vehicles</span>
                {isActive && (
                  <motion.div
                    layoutId="header-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#176B5B]"
                  />
                )}
              </>
            )}
          </NavLink>
        </nav>
      )}

      {/* Right: Active Vehicle / User Switcher */}
      {vehicles.length > 0 && (
        <div ref={flyoutRef} className="shrink-0 relative">
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-cta bg-[#E8F5F1]/70 hover:bg-[#E8F5F1] text-xs sm:text-sm font-semibold text-[#176B5B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B5B] cursor-pointer"
            aria-expanded={isSwitcherOpen}
            aria-label="Active Vehicle / User Selector"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3C9A70]" />
            <span className="max-w-[110px] sm:max-w-[160px] truncate">{displayName}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isSwitcherOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Switcher Flyout */}
          <AnimatePresence>
            {isSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white border border-[#DCE7E3] rounded-ds shadow-subtle p-2 text-left z-50"
              >
                <div className="px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#66736F] font-bold">
                  Active Vehicle
                </div>

                <div className="divide-y divide-[#DCE7E3]/60 my-1 max-h-56 overflow-y-auto">
                  {vehicles.map((v) => {
                    const isCurrent = activeVehicle?.id === v.id;
                    const name = v.nickname || `${v.manufacturer} ${v.model}`;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVehicle(v)}
                        className={`
                          w-full px-2.5 py-2 text-left flex items-center justify-between rounded-cta
                          transition-colors text-xs sm:text-sm cursor-pointer
                          ${
                            isCurrent
                              ? 'bg-[#E8F5F1] text-[#176B5B] font-semibold'
                              : 'text-[#1F2927] hover:bg-[#FAFCFB]'
                          }
                        `}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="truncate">{name}</span>
                          <span className="text-[11px] text-[#66736F] font-mono">
                            {v.registrationNumber}
                          </span>
                        </div>
                        {isCurrent && (
                          <Check className="w-4 h-4 text-[#176B5B] stroke-[2.5] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Actions: View My Vehicles & Add Vehicle */}
                <div className="mt-1.5 pt-1.5 border-t border-[#DCE7E3] space-y-1">
                  <button
                    type="button"
                    onClick={handleOpenVehiclesPage}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-[#1F2927] hover:text-[#176B5B] hover:bg-[#E8F5F1]/40 rounded-cta flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Car className="w-3.5 h-3.5 text-[#176B5B]" />
                    <span>View all My Vehicles</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddClick}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-[#176B5B] hover:text-[#125247] hover:bg-[#E8F5F1]/40 rounded-cta flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Vehicle</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
