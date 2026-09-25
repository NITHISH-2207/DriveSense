import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

/**
 * VehicleAlertModal: Smart threshold alert modal overlay.
 *
 * Appears when abnormal conditions exist on the active vehicle upon home load or vehicle switch.
 * Dismissing persists per vehicle + condition for the current browser session.
 */
export const VehicleAlertModal = ({
  isOpen = false,
  alert = null,
  totalIssues = 1,
  onDismiss,
  onViewTab,
}) => {
  if (!isOpen || !alert) return null;

  const isCritical = alert.severity === 'Critical';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Subtle Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 bg-[#182433]/30 backdrop-blur-[2px] transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white border border-[#DCE7E3] rounded-2xl shadow-xl p-6 sm:p-7 text-left z-10 space-y-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-modal-title"
        >
          {/* Top Bar: Severity Badge + Close Button */}
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCritical
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#EF4444]/30'
                  : 'bg-[#FFF7ED] text-[#B45309] border border-[#F59E0B]/30'
              }`}
            >
              {isCritical ? (
                <ShieldAlert className="w-3.5 h-3.5 text-[#B91C1C]" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
              )}
              <span>{isCritical ? 'CRITICAL ATTENTION' : 'ATTENTION REQUIRED'}</span>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="text-[#66736F] hover:text-[#1F2927] p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-1">
            <h3
              id="alert-modal-title"
              className="text-xl sm:text-2xl font-bold text-[#1F2927] tracking-tight"
            >
              {alert.headline}
            </h3>
            <p className="text-xs sm:text-sm text-[#66736F] leading-relaxed">
              {alert.explanation}
            </p>
          </div>

          {/* Value Highlight Box */}
          <div className="bg-[#FAFCFB] border border-[#DCE7E3] rounded-xl p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
                Current reading
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2927] tracking-tight">
                {alert.currentReading}
              </span>
            </div>

            {alert.recommendedRange && (
              <div className="pt-2 border-t border-[#DCE7E3]/60 flex items-center justify-between text-xs text-[#66736F]">
                <span>Recommended safe range</span>
                <span className="font-semibold text-[#1F2927] font-mono">
                  {alert.recommendedRange}
                </span>
              </div>
            )}
          </div>

          {/* Suggestion Line */}
          {alert.suggestion && (
            <div className="text-xs text-[#66736F]">
              <span className="font-semibold text-[#1F2927]">Suggestion · </span>
              {alert.suggestion}
            </div>
          )}

          {/* Multi-Issue Summary Note if applicable */}
          {totalIssues > 1 && (
            <div className="pt-1 text-[11px] text-[#66736F] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>
                {totalIssues} conditions currently require your attention on this vehicle.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onDismiss}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#66736F] hover:text-[#1F2927] hover:bg-[#FAFCFB] rounded-xl transition-colors cursor-pointer text-center"
            >
              Dismiss
            </button>

            <button
              type="button"
              onClick={() => onViewTab && onViewTab(alert.tabId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#176B5B] hover:bg-[#125247] text-white rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>{alert.actionLabel || 'View Subsystem'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleAlertModal;
