import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Check,
  Plus,
  Car,
  User,
  Lock,
  LogOut,
  Edit2,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  Bell,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DriveSenseLogo } from './DriveSenseLogo';
import {
  getVehicles,
  getActiveVehicle,
  setActiveVehicleId,
  getUser,
  saveUser,
} from '../services/vehicleStorage';

/**
 * AppHeader: Main navigation bar for DriveSense.
 *
 * Header Features:
 * 1. Brand Logo (left)
 * 2. Navigation:
 *    - In Vehicle Context (/home with active vehicle): Tabs (Overview, Tyres, Battery, Fluids, Temperature, Motion)
 *    - In Standard Context (/vehicles, etc.): Home | My Vehicles
 * 3. Right-side Actions:
 *    - Smart Health Alerts Bell (with active badge count) & Notifications Popover
 *    - Active Vehicle Switcher Flyout
 *    - My Profile Popover (Account view, Name edit with validation, Password edit with validation, Logout)
 *    - Mutual exclusivity across all popovers
 *    - Closes on Escape key or outside click
 */
export const AppHeader = ({
  isVehicleContext = false,
  activeTab = 'overview',
  abnormalConditions = [],
  vehicles: propVehicles,
  activeVehicle: propActiveVehicle,
  onSelectTab,
  onVehicleSwitch,
  onAddNewVehicle,
}) => {
  const navigate = useNavigate();
  const [internalVehicles, setInternalVehicles] = useState([]);
  const [internalActiveVehicle, setInternalActiveVehicle] = useState(null);
  const [user, setUser] = useState(getUser());

  const vehicles = propVehicles !== undefined ? propVehicles : internalVehicles;
  const activeVehicle = propActiveVehicle !== undefined ? propActiveVehicle : internalActiveVehicle;

  // Popover open states (mutually exclusive: switcher, profile, notifications)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Profile modal/popover view mode: 'view' | 'edit-name' | 'edit-password'
  const [profileMode, setProfileMode] = useState('view');
  const [editNameValue, setEditNameValue] = useState('');
  const [nameError, setNameError] = useState(null);

  // Password edit state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Small quiet confirmation feedback state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  const flyoutRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

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
    setInternalVehicles(list);
    setInternalActiveVehicle(current);
    setUser(getUser());
  };

  useEffect(() => {
    refreshData();
  }, [propVehicles, propActiveVehicle]);

  // Handle outside click & Escape key for popovers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setIsSwitcherOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
        setProfileMode('view');
        setNameError(null);
        setPasswordError(null);
        setSaveSuccessMsg(null);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSwitcherOpen(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setProfileMode('view');
        setNameError(null);
        setPasswordError(null);
        setSaveSuccessMsg(null);
      }
    };

    if (isSwitcherOpen || isProfileOpen || isNotificationsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSwitcherOpen, isProfileOpen, isNotificationsOpen]);

  // Mutually exclusive popover toggles
  const toggleSwitcher = () => {
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    if (!isSwitcherOpen) {
      refreshData();
    }
    setIsSwitcherOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setIsSwitcherOpen(false);
    setIsNotificationsOpen(false);
    if (!isProfileOpen) {
      refreshData();
      setProfileMode('view');
      setNameError(null);
      setPasswordError(null);
      setSaveSuccessMsg(null);
    }
    setIsProfileOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setIsSwitcherOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleSelectVehicle = (vehicle) => {
    setActiveVehicleId(vehicle.id);
    setInternalActiveVehicle(vehicle);
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

  // Profile actions
  const handleStartEditName = () => {
    setEditNameValue(user?.name || '');
    setNameError(null);
    setProfileMode('edit-name');
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    const trimmed = editNameValue.trim();
    if (!trimmed) {
      setNameError('Please enter your name.');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Name is too short.');
      return;
    }

    const updated = saveUser({ name: trimmed });
    setUser(updated);
    setSaveSuccessMsg('Name updated');

    setTimeout(() => {
      setSaveSuccessMsg(null);
      setProfileMode('view');
    }, 900);
  };

  const handleStartEditPassword = () => {
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordError(null);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setProfileMode('edit-password');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwordForm;

    if (!newPassword) {
      setPasswordError('Please enter a password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    saveUser({ password: newPassword });
    setSaveSuccessMsg('Password updated');

    setTimeout(() => {
      setSaveSuccessMsg(null);
      setProfileMode('view');
    }, 900);
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    navigate('/login');
  };

  const displayName = activeVehicle
    ? activeVehicle.nickname || `${activeVehicle.manufacturer} ${activeVehicle.model}`
    : 'No Vehicle';

  const userInitials = (user?.name || 'Alex Morgan')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const totalAbnormalCount = abnormalConditions.length;
  const hasCritical = abnormalConditions.some((a) => a.severity === 'Critical');

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

      {/* Right Actions: Notifications Bell + Active Vehicle Selector + Profile Popover */}
      <div className="shrink-0 flex items-center gap-2 sm:gap-3">
        {/* 1. Vehicle Health Notifications Bell (if vehicle context) */}
        {isVehicleContext && (
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B5B] cursor-pointer ${
                isNotificationsOpen
                  ? 'bg-[#176B5B] text-white shadow-xs'
                  : 'bg-[#FAFCFB] hover:bg-[#E8F5F1] text-[#66736F] hover:text-[#176B5B] border border-[#DCE7E3]'
              }`}
              aria-expanded={isNotificationsOpen}
              aria-label="Vehicle Health Alerts"
              title="Vehicle Health Alerts"
            >
              <Bell className="w-3.5 h-3.5" />
              {totalAbnormalCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white border-2 border-white ${
                    hasCritical ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                  }`}
                >
                  {totalAbnormalCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#DCE7E3] rounded-2xl shadow-xl p-3.5 text-left z-50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#DCE7E3] pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F2927]">
                      Vehicle Alerts ({totalAbnormalCount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[#66736F] hover:text-[#1F2927] p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {totalAbnormalCount === 0 ? (
                    <div className="py-4 text-center space-y-1">
                      <div className="w-8 h-8 rounded-full bg-[#E8F5F1] text-[#176B5B] flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-[#1F2927]">All systems nominal</p>
                      <p className="text-[11px] text-[#66736F]">
                        No active warnings for this vehicle.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto divide-y divide-[#DCE7E3]/60">
                      {abnormalConditions.map((issue) => {
                        const isCrit = issue.severity === 'Critical';
                        return (
                          <div
                            key={issue.id}
                            className="pt-2 first:pt-0 space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                {isCrit ? (
                                  <ShieldAlert className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                                )}
                                <span className="text-xs font-bold text-[#1F2927]">
                                  {issue.title}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  isCrit
                                    ? 'bg-[#FEF2F2] text-[#B91C1C]'
                                    : 'bg-[#FFF7ED] text-[#B45309]'
                                }`}
                              >
                                {issue.severity}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#66736F] font-mono">
                              {issue.currentReading}
                            </p>

                            <button
                              type="button"
                              onClick={() => {
                                setIsNotificationsOpen(false);
                                onSelectTab && onSelectTab(issue.tabId);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#176B5B] hover:text-[#125247] hover:underline cursor-pointer"
                            >
                              <span>{issue.actionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 2. Active Vehicle Switcher (Flyout) */}
        {vehicles.length > 0 && (
          <div ref={flyoutRef} className="relative">
            <button
              type="button"
              onClick={toggleSwitcher}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-cta bg-[#E8F5F1]/70 hover:bg-[#E8F5F1] text-xs sm:text-sm font-semibold text-[#176B5B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B5B] cursor-pointer"
              aria-expanded={isSwitcherOpen}
              aria-label="Active Vehicle Selector"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3C9A70]" />
              <span className="max-w-[100px] sm:max-w-[140px] truncate">{displayName}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isSwitcherOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Vehicle Switcher Flyout */}
            <AnimatePresence>
              {isSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white border border-[#DCE7E3] rounded-2xl shadow-lg p-2.5 text-left z-50"
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
                            w-full px-2.5 py-2 text-left flex items-center justify-between rounded-xl
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
                      className="w-full px-2.5 py-1.5 text-xs font-semibold text-[#1F2927] hover:text-[#176B5B] hover:bg-[#E8F5F1]/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Car className="w-3.5 h-3.5 text-[#176B5B]" />
                      <span>View all My Vehicles</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddClick}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold text-[#176B5B] hover:text-[#125247] hover:bg-[#E8F5F1]/40 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
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

        {/* 3. My Profile Button & Popover */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={toggleProfile}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B5B] cursor-pointer ${
              isProfileOpen
                ? 'bg-[#176B5B] text-white ring-2 ring-[#176B5B]/30'
                : 'bg-[#E8F5F1] text-[#176B5B] hover:bg-[#176B5B] hover:text-white'
            }`}
            aria-expanded={isProfileOpen}
            aria-label="My Profile"
            title="My Profile"
          >
            {userInitials || <User className="w-4 h-4" />}
          </button>

          {/* Profile Popover */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#DCE7E3] rounded-2xl shadow-lg p-4 text-left z-50 space-y-4"
              >
                {/* MODE 1: VIEW PROFILE */}
                {profileMode === 'view' && (
                  <div className="space-y-4">
                    {/* Header with Close */}
                    <div className="flex items-center justify-between border-b border-[#DCE7E3] pb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                        My Profile
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsProfileOpen(false)}
                        className="text-[#66736F] hover:text-[#1F2927] p-1 rounded-lg transition-colors cursor-pointer"
                        aria-label="Close Profile"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* User Identity Card */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8F5F1] text-[#176B5B] flex items-center justify-center font-extrabold text-sm shrink-0">
                        {userInitials}
                      </div>
                      <div className="space-y-0.5 truncate flex-1">
                        <div className="text-sm font-bold text-[#1F2927] truncate">
                          {user?.name || 'Alex Morgan'}
                        </div>
                        <div className="text-xs text-[#66736F] truncate">
                          {user?.email || 'alex.morgan@example.com'}
                        </div>
                        <div className="text-xs text-[#66736F] font-mono truncate">
                          {user?.phone || '+91 98765 43210'}
                        </div>
                      </div>
                    </div>

                    {/* Registered Vehicles Stat */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAFCFB] border border-[#DCE7E3]/60 text-xs">
                      <span className="text-[#66736F] font-medium">Registered Vehicles</span>
                      <span className="font-bold text-[#176B5B] bg-[#E8F5F1] px-2 py-0.5 rounded-full text-[11px]">
                        {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
                      </span>
                    </div>

                    {/* Action Items */}
                    <div className="space-y-1 pt-2 border-t border-[#DCE7E3]">
                      <button
                        type="button"
                        onClick={handleStartEditName}
                        className="w-full px-2.5 py-2 text-xs font-semibold text-[#1F2927] hover:bg-[#FAFCFB] hover:text-[#176B5B] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#176B5B]" />
                        <span>Edit Name</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStartEditPassword}
                        className="w-full px-2.5 py-2 text-xs font-semibold text-[#1F2927] hover:bg-[#FAFCFB] hover:text-[#176B5B] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#176B5B]" />
                        <span>Change Password</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="pt-2 border-t border-[#DCE7E3]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full px-2.5 py-2 text-xs font-semibold text-[#B45309] hover:bg-[#FFF7ED] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 2: EDIT NAME */}
                {profileMode === 'edit-name' && (
                  <form onSubmit={handleSaveName} className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#DCE7E3] pb-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setProfileMode('view')}
                          className="text-[#66736F] hover:text-[#1F2927] p-1 rounded transition-colors cursor-pointer"
                          aria-label="Back to profile"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[#1F2927]">Edit Name</span>
                      </div>

                      {saveSuccessMsg && (
                        <span className="text-[11px] font-semibold text-[#176B5B] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {saveSuccessMsg}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="profile-name-input" className="text-[11px] font-semibold text-[#66736F] block">
                        Full Name
                      </label>
                      <input
                        id="profile-name-input"
                        type="text"
                        value={editNameValue}
                        onChange={(e) => {
                          setEditNameValue(e.target.value);
                          if (nameError) setNameError(null);
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-xl border bg-white text-[#1F2927] focus:outline-none transition-all ${
                          nameError
                            ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#DCE7E3] focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]'
                        }`}
                        placeholder="Your full name"
                        autoFocus
                      />
                      {nameError && (
                        <p className="text-[11px] text-red-600 font-medium">{nameError}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setProfileMode('view')}
                        className="px-3 py-1.5 text-xs font-semibold text-[#66736F] hover:text-[#1F2927] rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!!saveSuccessMsg}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#176B5B] hover:bg-[#125247] text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {/* MODE 3: CHANGE PASSWORD */}
                {profileMode === 'edit-password' && (
                  <form onSubmit={handleSavePassword} className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#DCE7E3] pb-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setProfileMode('view')}
                          className="text-[#66736F] hover:text-[#1F2927] p-1 rounded transition-colors cursor-pointer"
                          aria-label="Back to profile"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[#1F2927]">Change Password</span>
                      </div>

                      {saveSuccessMsg && (
                        <span className="text-[11px] font-semibold text-[#176B5B] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {saveSuccessMsg}
                        </span>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <label htmlFor="new-pass-input" className="text-[11px] font-semibold text-[#66736F] block">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-pass-input"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => {
                            setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }));
                            if (passwordError) setPasswordError(null);
                          }}
                          className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-[#DCE7E3] bg-white text-[#1F2927] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B] transition-all"
                          placeholder="Min. 6 characters"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66736F] hover:text-[#1F2927] p-0.5 cursor-pointer"
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label htmlFor="confirm-pass-input" className="text-[11px] font-semibold text-[#66736F] block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-pass-input"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => {
                            setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                            if (passwordError) setPasswordError(null);
                          }}
                          className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-[#DCE7E3] bg-white text-[#1F2927] focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B] transition-all"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66736F] hover:text-[#1F2927] p-0.5 cursor-pointer"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-[11px] text-red-600 font-medium">{passwordError}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setProfileMode('view')}
                        className="px-3 py-1.5 text-xs font-semibold text-[#66736F] hover:text-[#1F2927] rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!!saveSuccessMsg}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#176B5B] hover:bg-[#125247] text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Save Password
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
