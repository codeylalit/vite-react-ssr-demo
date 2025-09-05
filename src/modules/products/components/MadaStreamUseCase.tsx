import { MadaStreamUseCases as useCases } from '../data/MadaStream';

const MadaStreamUseCase = () => {
  return (
    <>
      {/* Use Cases */}
      <section className="py-20 bg-blue-50">
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
                      Domain
                    </th>
                    <th className="px-8 py-6 text-left text-lg font-semibold text-foreground">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {useCases.map((useCase, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="p-3 md:px-8 md:py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <useCase.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="md:text-lg font-semibold text-foreground">
                              {useCase.domain}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 md:px-8 md:py-6">
                        <p className="md:text-lg text-muted-foreground">{useCase.example}</p>
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

export default MadaStreamUseCase;
