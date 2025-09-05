import React from 'react';
import { LegalLayout } from '../components/LegalLayout';

const Terms: React.FC = () => {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="July 2025" seoConfig="terms">
      <div className="space-y-6">
        <div>
          <p className="text-lg text-gray-700 mb-4">
            These Terms and Conditions ("Terms") govern your use of the Shunya Labs website and
            services. By accessing or using our services, you agree to be bound by these Terms.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using our services, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-3">
            Permission is granted to temporarily download one copy of the materials on Shunya Labs'
            website for personal, non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on Shunya Labs' website are provided on an 'as is' basis. Shunya Labs
            makes no warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or non-infringement of intellectual
            property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Limitations</h2>
          <p className="text-gray-700 mb-4">
            In no event shall Shunya Labs or its suppliers be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on Shunya Labs' website, even
            if Shunya Labs or a Shunya Labs authorized representative has been notified orally or in
            writing of the possibility of such damage. Because some jurisdictions do not allow
            limitations on implied warranties, or limitations of liability for consequential or
            incidental damages, these limitations may not apply to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Accuracy of Materials</h2>
          <p className="text-gray-700 mb-4">
            The materials appearing on Shunya Labs' website could include technical, typographical,
            or photographic errors. Shunya Labs does not warrant that any of the materials on its
            website are accurate, complete, or current. Shunya Labs may make changes to the
            materials contained on its website at any time without notice. However, Shunya Labs does
            not make any commitment to update the materials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Links</h2>
          <p className="text-gray-700 mb-4">
            Shunya Labs has not reviewed all of the sites linked to our website and is not
            responsible for the contents of any such linked site. The inclusion of any link does not
            imply endorsement by Shunya Labs of the site. Use of any such linked website is at the
            user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Modifications</h2>
          <p className="text-gray-700 mb-4">
            Shunya Labs may revise these terms of service for its website at any time without
            notice. By using this website, you are agreeing to be bound by the then current version
            of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of
            Delaware, USA, and you irrevocably submit to the exclusive jurisdiction of the courts in
            that state or location.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms & Conditions, please contact us at:
          </p>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Email:</strong> legal@shunyalabs.com
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

export default Terms;
