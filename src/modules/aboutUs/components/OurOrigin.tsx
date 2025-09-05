const OurOrigin = () => {
  return (
    <>
      {/* Our Origin */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-midnight mb-8 text-center">Our Origin</h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600 leading-relaxed">
              When co-founders Ritu Mehrotra and Sourav Banerjee battled their own mental-health
              hurdles, they hit a broken system: scarce clinicians, sky-high costs, and black-box
              AI. So they built United We Care—a platform powered by a home-grown speech engine and
              the world's largest clinical knowledge graph, proving precision doesn't need Big-Tech
              budgets.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              That same CPU-first engine became Shunya Labs: a pure deep-tech spin-out focused on
              voice, language, and reasoning at the edge.
            </p>
          </div>

          <img
            src={
              'https://www.unitedwecare.com/wp-content/uploads/al_opt_content/IMAGE/www.unitedwecare.com/wp-content/uploads/2025/02/Sourav_Ritu.jpg.bv.webp?bv_host=www.unitedwecare.com'
            }
            alt="Our Origin"
            className="w-full h-auto aspect-auto onject-contain mt-12 max-w-3xl mx-auto"
          />
        </div>
      </section>
    </>
  );
};

export default OurOrigin;
