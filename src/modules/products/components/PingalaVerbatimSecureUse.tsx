import { Shield } from 'lucide-react';

const PingalaVerbatimSecureUse = () => {
  return (
    <>
      {/* Built for Secure Use */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card border rounded-2xl p-12 shadow-lg">
            <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Built for Secure Use</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Run everything on your own machines—no cloud service means no third‑party data access.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PingalaVerbatimSecureUse;
