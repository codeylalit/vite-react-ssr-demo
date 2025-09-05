import React from 'react';
import { LegalLayout } from '../components/LegalLayout';

const Security: React.FC = () => {
  return (
    <LegalLayout title="Security Policy" lastUpdated="July 2025">
      <div className="space-y-6">
        <div>
          <p className="text-lg text-gray-700 mb-4">
            At Shunya Labs, we take the security of your data and our systems seriously. This
            Security Policy outlines the measures we take to protect your information and our
            commitment to maintaining the highest security standards.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Data Encryption</h2>
          <p className="text-gray-700 mb-3">We implement robust encryption practices:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>
              <strong>Data in Transit:</strong> All data transmitted between your device and our
              servers is encrypted using TLS 1.3
            </li>
            <li>
              <strong>Data at Rest:</strong> All stored data is encrypted using AES-256 encryption
            </li>
            <li>
              <strong>Audio Processing:</strong> Audio files are encrypted during processing and
              securely deleted after transcription
            </li>
            <li>
              <strong>Database Security:</strong> All database connections use encrypted protocols
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Infrastructure Security</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Cloud Security</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                <li>Hosted on secure, SOC 2 compliant cloud infrastructure</li>
                <li>Regular security audits and penetration testing</li>
                <li>Automated security monitoring and threat detection</li>
                <li>Multi-factor authentication for all administrative access</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Network Security</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                <li>Firewall protection and intrusion detection systems</li>
                <li>Regular security patches and updates</li>
                <li>Network segmentation and access controls</li>
                <li>DDoS protection and rate limiting</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Access Controls</h2>
          <p className="text-gray-700 mb-3">We maintain strict access controls:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Role-based access control (RBAC) for all systems</li>
            <li>Regular access reviews and privilege management</li>
            <li>Secure authentication mechanisms</li>
            <li>Audit logging of all system access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Privacy & Retention</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Audio Data Handling</h3>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>Audio files are processed in real-time and not permanently stored</li>
              <li>Temporary processing files are securely deleted within 24 hours</li>
              <li>No audio content is retained after transcription is complete</li>
              <li>Only aggregated, non-identifiable usage statistics are retained</li>
            </ul>
          </div>

          <p className="text-gray-700 mb-3">Our data retention practices:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Minimal data collection - only what's necessary for service delivery</li>
            <li>Automated data deletion policies</li>
            <li>Right to data deletion upon request</li>
            <li>Regular data purging of expired information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Compliance & Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Standards Compliance</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>SOC 2 Type II compliance</li>
                <li>GDPR compliance for EU users</li>
                <li>CCPA compliance for California users</li>
                <li>ISO 27001 security framework</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-purple-800 mb-2">Healthcare Compliance</h3>
              <ul className="list-disc list-inside space-y-1 text-purple-700 text-sm">
                <li>HIPAA compliance for healthcare clients</li>
                <li>Business Associate Agreements (BAA)</li>
                <li>Protected Health Information (PHI) safeguards</li>
                <li>Audit trails for healthcare use cases</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Incident Response</h2>
          <p className="text-gray-700 mb-3">Our incident response process includes:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>24/7 security monitoring and alerting</li>
            <li>Rapid incident response team activation</li>
            <li>Immediate containment and mitigation procedures</li>
            <li>Transparent communication with affected users</li>
            <li>Post-incident analysis and improvement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Employee Security</h2>
          <p className="text-gray-700 mb-3">All team members undergo:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
            <li>Background checks and security clearance</li>
            <li>Regular security training and awareness programs</li>
            <li>Signed confidentiality and security agreements</li>
            <li>Principle of least privilege access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Responsible Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We welcome security researchers and the community to help us maintain the security of
            our platform. If you discover a security vulnerability, please report it responsibly.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">Report Security Issues</h3>
            <p className="text-red-700 mb-2">Please report security vulnerabilities to:</p>
            <p className="text-red-700">
              <strong>Email:</strong> security@shunyalabs.com
            </p>
            <p className="text-red-700 text-sm mt-2">
              We commit to acknowledging your report within 24 hours and providing regular updates
              on our progress toward a resolution.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about our security practices or policies, please contact us:
          </p>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Security Team:</strong> security@shunyalabs.com
            </p>
            <p className="text-gray-700">
              <strong>General Inquiries:</strong> privacy@shunyalabs.com
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

export default Security;
