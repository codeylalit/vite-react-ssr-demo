const AryaEchoDevelopmentStatus = () => {
  return (
    <>
      {/* Development Status */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card border rounded-2xl p-12 shadow-lg">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">🚧</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Still in Progress</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A1 is in development. We&apos;re working on it, testing it, and making it better. You
              can join the journey.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AryaEchoDevelopmentStatus;
