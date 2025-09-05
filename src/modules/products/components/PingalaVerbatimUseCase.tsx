import { pingalaVerbatimUseCases as useCases } from '../data/PingalaVerbatim';
const PingalaVerbatimUseCase = () => {
  return (
    <>
      {/* Use Cases */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Use Cases</h2>
          </div>

          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50 border-b border-border">
                    <th className="px-8 py-6 text-left text-lg font-semibold text-foreground">
                      Scenario
                    </th>
                    <th className="px-8 py-6 text-left text-lg font-semibold text-foreground">
                      Why Pingala V1?
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {useCases.map((useCase, index) => (
                    <tr key={index} className="hover:bg-blue-100 transition-colors">
                      <td className="p-3 md:px-8 md:py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <useCase.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="md:text-lg font-semibold text-foreground">
                              {useCase.scenario}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 md:px-8 md:py-6">
                        <p className="md:text-lg text-muted-foreground">{useCase.reason}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PingalaVerbatimUseCase;
