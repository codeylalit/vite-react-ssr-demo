import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { AryaEchoAncientInspiration as ancientInspiration } from '../data/PingalaVerbatim';

const AncientIndianInspiration = () => {
  return (
    <>
      {/* Ancient Indian Inspiration */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Inspired by Ancient Indian Genius
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A1 is built with ideas from Indian science
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ancientInspiration.map((item, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AncientIndianInspiration;
