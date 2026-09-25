import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { LegalSection } from '../components/LegalSection';
import { PageTransition } from '../components/PageTransition';

/**
 * Privacy Policy Page
 * Numbered sections (01 to 10), framed appropriately for a student engineering prototype.
 */
export const PrivacyPage = () => {
  return (
    <PageTransition>
      <LegalPageLayout
        title="Privacy Policy"
        subtitle="Transparent information handling principles for the DriveSense vehicle health monitoring prototype."
        lastUpdated="September 2026"
      >
        {/* Section 01 */}
        <LegalSection number="01" title="Information We Collect">
          <p>
            DriveSense processes minimal data required to evaluate vehicle health monitoring algorithms and companion interface usability. We distinguish between basic account details, vehicle telemetry, and device diagnostic logs.
          </p>
        </LegalSection>

        {/* Section 02 */}
        <LegalSection number="02" title="Account Information">
          <p>
            When registering for a test account, the system receives:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#687384]">
            <li>Full Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Account credentials (handled safely for testing)</li>
          </ul>
        </LegalSection>

        {/* Section 03 */}
        <LegalSection number="03" title="Vehicle & Sensor Data">
          <p>
            In subsequent development phases when hardware telemetry is enabled, the ESP32 microcontrollers and connected sensors will process vehicle metrics such as:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#687384]">
            <li>Tire pressure and temperature levels (TPMS)</li>
            <li>Electrical current sensing for battery health</li>
            <li>Thermal engine/fluid-related measurements</li>
            <li>IMU / gyroscope vehicle motion dynamics</li>
            <li>Onboard diagnostic metrics (OBD / hardware bus)</li>
          </ul>
          <p>
            During this introductory frontend phase, no active physical telemetry streams are transmitted.
          </p>
        </LegalSection>

        {/* Section 04 */}
        <LegalSection number="04" title="How Data Is Used">
          <p>
            Information is used strictly for academic evaluation, interface validation, algorithm development, and demonstrative vehicle companion testing. Data is never monetized or sold to third-party advertisers.
          </p>
        </LegalSection>

        {/* Section 05 */}
        <LegalSection number="05" title="Data Storage">
          <p>
            Prototype data is stored in localized development environments and project database instances managed by the multidisciplinary student engineering team for research evaluations.
          </p>
        </LegalSection>

        {/* Section 06 */}
        <LegalSection number="06" title="Data Sharing">
          <p>
            We do not share your personal account or vehicle sensor details with outside marketing entities or commercial third parties. Data access is restricted to the student project researchers and academic faculty supervisors.
          </p>
        </LegalSection>

        {/* Section 07 */}
        <LegalSection number="07" title="Data Security">
          <p>
            We adopt standard development security practices to safeguard test accounts and sensor logs. As this is an educational prototype rather than an enterprise certified production platform, users should avoid reusing highly sensitive credentials.
          </p>
        </LegalSection>

        {/* Section 08 */}
        <LegalSection number="08" title="User Choices">
          <p>
            Users participating in prototype testing may request account deletion or data purge at any point by contacting the project team.
          </p>
        </LegalSection>

        {/* Section 09 */}
        <LegalSection number="09" title="Changes to This Policy">
          <p>
            This privacy policy may be refined as hardware modules, backend APIs, and sensor networks are progressively integrated in future project phases.
          </p>
        </LegalSection>

        {/* Section 10 */}
        <LegalSection number="10" title="Contact">
          <p>
            For questions or requests regarding data handling in the DriveSense prototype, please contact:
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#4B7BEC]">
            privacy@drivesense-project.edu
          </p>
        </LegalSection>
      </LegalPageLayout>
    </PageTransition>
  );
};

export default PrivacyPage;
