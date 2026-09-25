import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { LegalSection } from '../components/LegalSection';
import { PageTransition } from '../components/PageTransition';

/**
 * Terms & Conditions Page
 * Numbered sections (01, 02...), generous whitespace, framed as student project prototype.
 */
export const TermsPage = () => {
  return (
    <PageTransition>
      <LegalPageLayout
        title="Terms & Conditions"
        subtitle="Guidelines and operating parameters for the DriveSense vehicle health monitoring prototype."
        lastUpdated="September 2026"
      >
        {/* Section 01 */}
        <LegalSection number="01" title="Introduction">
          <p>
            Welcome to <strong className="text-[#182433]">DriveSense</strong>. DriveSense is an academic multidisciplinary engineering project prototype developed jointly by an Information Technology (IT) and Electronics & Communication Engineering (ECE) student team.
          </p>
          <p>
            By accessing or interacting with the DriveSense prototype, you acknowledge that this software and connected hardware architecture are built strictly for educational, evaluation, and experimental testing purposes.
          </p>
        </LegalSection>

        {/* Section 02 */}
        <LegalSection number="02" title="Use of DriveSense">
          <p>
            DriveSense provides vehicle health insights, telemetry visualization, and assistive diagnostics. The platform is designed to assist vehicle owners and test drivers in understanding sensor trends and potential maintenance items in a calm, stress-free manner.
          </p>
          <p>
            You agree to use this prototype interface solely for lawful monitoring and evaluation purposes and not to attempt any reverse engineering or tampering with the data capture protocols.
          </p>
        </LegalSection>

        {/* Section 03 */}
        <LegalSection number="03" title="Account Responsibilities">
          <p>
            When creating a DriveSense prototype account, you agree to provide accurate basic contact details (such as full name, email address, and phone number). You are responsible for safeguarding your credentials during project testing sessions.
          </p>
        </LegalSection>

        {/* Section 04 */}
        <LegalSection number="04" title="Vehicle & Sensor Data">
          <p>
            The DriveSense architecture interfaces with ESP32-based microcontroller modules to capture sensor metrics including tire pressure monitoring (TPMS), electrical currents for battery monitoring, thermal readings, motion kinematics (IMU), and onboard diagnostics.
          </p>
          <p>
            Sensor telemetry collected during prototype testing is utilized to evaluate algorithm accuracy and improve diagnostic algorithms. Because this is an academic prototype, sensor calibrations and telemetry transmission depend on prototype hardware conditions.
          </p>
        </LegalSection>

        {/* Section 05 */}
        <LegalSection number="05" title="Alerts & Information">
          <p>
            Alerts, status indications, and threshold notifications presented in DriveSense are advisory in nature. They are designed to enhance driver awareness and promote preventative care.
          </p>
          <div className="p-4 rounded-xl bg-[#EAF1FF] border border-[#4B7BEC]/20 text-xs sm:text-sm text-[#182433]">
            <strong className="text-[#4B7BEC]">Prototype Notice:</strong> DriveSense is an assistive student project prototype and is not a certified replacement for professional automotive mechanical inspections, original equipment manufacturer (OEM) dashboard safety indicators, or emergency road services.
          </div>
        </LegalSection>

        {/* Section 06 */}
        <LegalSection number="06" title="Service Availability">
          <p>
            As an ongoing college multidisciplinary project, features, interfaces, and demonstration servers may undergo updates, experimental iterations, or brief downtime without prior formal notice.
          </p>
        </LegalSection>

        {/* Section 07 */}
        <LegalSection number="07" title="User Responsibilities">
          <p>
            Users and vehicle operators must always prioritize safe driving habits, local traffic laws, and road safety regulations. Never interact with the DriveSense user interface or mobile screen while actively operating a moving vehicle.
          </p>
        </LegalSection>

        {/* Section 08 */}
        <LegalSection number="08" title="Changes to Service">
          <p>
            The project team reserves the right to modify, refine, or expand system parameters, sensor features, or interface specifications as project research requirements evolve.
          </p>
        </LegalSection>

        {/* Section 09 */}
        <LegalSection number="09" title="Contact">
          <p>
            For questions, feedback, or academic inquiries regarding DriveSense, please contact the student project development team:
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#4B7BEC]">
            team@drivesense-project.edu (Academic Project Representative)
          </p>
        </LegalSection>
      </LegalPageLayout>
    </PageTransition>
  );
};

export default TermsPage;
