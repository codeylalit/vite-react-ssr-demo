import React from 'react';
import { LegalLayout } from '../components/LegalLayout';

const Privacy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 2025" seoConfig="privacy">
      <div className="space-y-6">
        <div>
          <p className="text-lg text-gray-700 mb-4">
            Shunya Labs ("Shunya Labs," "we," "our," or "us") is committed to protecting your
            privacy, including your rights under the Health Insurance Portability and Accountability
            Act of 1996 (HIPAA), where applicable.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">i</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Company Information</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    <strong>Company:</strong> Shunya Labs
                  </p>
                  <p>
                    <strong>Address:</strong> 2810 N Church Street, Wilmington, Delaware 19802, USA
                  </p>
                  <p>
                    <strong>Contact:</strong> privacy@shunyalabs.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>

          <h3 className="text-lg font-medium text-gray-800 mb-2">a. Information You Provide</h3>
          <p className="text-gray-700 mb-3">
            We may collect personal information directly from you when you:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Register for an account</li>
            <li>Contact us or request information</li>
            <li>Participate in surveys or research</li>
            <li>Apply for employment</li>
            <li>Sign up for newsletters or updates</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-2">
            b. Automatically Collected Information
          </h3>
          <p className="text-gray-700 mb-4">
            When you use our services, we may automatically collect information such as:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, features used)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Log files and analytics data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-3">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Personalize and improve your experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Information Sharing and Disclosure
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except as described in this policy.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mb-2">We may share your information:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>With service providers who assist us in operating our business</li>
            <li>To comply with legal obligations or respond to lawful requests</li>
            <li>To protect our rights, property, or safety, or that of others</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational security measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-3">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Email:</strong> privacy@shunyalabs.com
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> 2810 N Church Street, Wilmington, Delaware 19802, USA
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};

export default Privacy;
