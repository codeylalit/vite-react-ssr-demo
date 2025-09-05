const PricingFAQ = () => {
  return (
    <>
      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-midnight mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-lg mb-2">How is pricing calculated?</h4>
              <p className="text-gray-600">
                Pingala V1 pricing is based on usage per hour of audio processed. We offer three
                model variants: English Verbatim ($0.065-0.08/hr), English Enhanced ($0.08-0.10/hr),
                and Multilingual ($0.11-0.14/hr). Real-time processing costs 30% more than batch
                processing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">What's included in the free trial?</h4>
              <p className="text-gray-600">
                First 10,000 hours of English Verbatim transcription per organization – completely
                FREE. No credit card required, no API throttling. Perfect for testing and
                evaluation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Can I run Pingala on-premises?</h4>
              <p className="text-gray-600">
                Yes, Pingala can be deployed on-premises. We offer two self-hosted models to choose
                from: Pingala V1 – English Verbatim at $0.04 per hour, and Pingala V1 – Universal
                (216 Languages) at $0.06 per hour. Perfect for healthcare, defense, telco,
                education, and enterprise transcription with data privacy requirements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">What languages are supported?</h4>
              <p className="text-gray-600">
                Pingala V1 supports 216 languages including all major Indian languages and global
                languages. Our multilingual model provides auto-normalized output with semantic
                enhancement across all supported languages.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">How do you achieve CPU optimization?</h4>
              <p className="text-gray-600">
                Pingala is engineered to run efficiently on CPUs, eliminating the need for expensive
                GPU infrastructure. Our CPU-first architecture delivers WER as low as 3.4% in Indian
                languages while maintaining cost-effectiveness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">
                What's the difference between Verbatim and Enhanced?
              </h4>
              <p className="text-gray-600">
                Verbatim mode retains all filler words and provides exact transcription. Enhanced
                mode includes semantic cleanup, punctuation, formatting, and filler word removal for
                cleaner, more readable transcripts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">How do I get a custom quote?</h4>
              <p className="text-gray-600">
                Contact us at partner@shunyalabs.ai for custom pricing, enterprise deployments, or
                specialized requirements. We can mix and match features based on your specific
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingFAQ;
