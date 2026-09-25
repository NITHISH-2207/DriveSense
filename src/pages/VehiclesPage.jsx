import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { PageTransition } from '../components/PageTransition';
import {
  getVehicles,
  getActiveVehicleId,
  setActiveVehicleId,
  deleteVehicle,
} from '../services/vehicleStorage';

/**
 * VehiclesPage: "My Vehicles" view at /vehicles.
 * Refined Open Canvas list interface with active vehicle switching and addition.
 */
export const VehiclesPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const loadData = () => {
    setVehicles(getVehicles());
    setActiveId(getActiveVehicleId());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectActive = (id) => {
    setActiveVehicleId(id);
    setActiveId(id);
    navigate('/home');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = deleteVehicle(id);
    setVehicles(updated);
    setActiveId(getActiveVehicleId());
  };

  const handleAddNew = () => {
    navigate('/home?setup=new');
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-[#FAFCFB] open-canvas-gradient flex flex-col justify-between py-8 sm:py-12 px-6 sm:px-12 lg:px-20 relative overflow-hidden">
        {/* Top Minimal Header */}
        <AppHeader />

        {/* Main Content Area */}
        <main className="w-full max-w-4xl mx-auto my-auto relative z-10 py-6 text-left">
          {/* Section Heading */}
          <div className="border-b border-[#DCE7E3] pb-6 mb-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
              My Vehicles
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#687384]">
              Manage registered vehicles. The active vehicle is monitored in your DriveSense Home.
            </p>
          </div>

          {/* Vehicle List (Open Canvas Line Items) */}
          {vehicles.length === 0 ? (
            <div className="py-12 space-y-4">
              <p className="text-base text-[#687384]">No vehicles registered yet.</p>
              <button
                type="button"
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125247]"
              >
                <Plus className="w-4 h-4" />
                <span>Add your first vehicle</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#DCE7E3]">
              {vehicles.map((v) => {
                const isActive = activeId === v.id;
                const displayName = v.nickname || `${v.manufacturer} ${v.model}`;

                return (
                  <motion.div
                    key={v.id}
                    layout
                    onClick={() => handleSelectActive(v.id)}
                    className={`
                      py-5 px-3 rounded-ds transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      ${isActive ? 'bg-[#E8F5F1]/50' : 'hover:bg-[#FAFCFB]'}
                    `}
                  >
                    {/* Vehicle Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg sm:text-xl font-bold text-[#1F2927]">
                          {displayName}
                        </h2>
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#176B5B] text-white">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#687384] font-mono tracking-wider uppercase">
                        {v.registrationNumber} • {v.year} • {v.type} • {v.fuelType}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleSelectActive(v.id)}
                          className="text-xs font-semibold text-[#176B5B] hover:text-[#125247] hover:underline"
                        >
                          Make Active
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, v.id)}
                        className="p-1.5 text-[#687384] hover:text-[#D86666] transition-colors rounded focus:outline-none"
                        title="Remove Vehicle"
                        aria-label={`Remove ${displayName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Add Vehicle Row */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125247] transition-colors py-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add another vehicle</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Minimal Bottom Spacer */}
        <div className="w-full max-w-4xl mx-auto opacity-0 pointer-events-none text-xs">
          DriveSense
        </div>
      </div>
    </PageTransition>
  );
};

export default VehiclesPage;
