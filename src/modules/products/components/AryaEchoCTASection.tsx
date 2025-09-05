import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

const AryaEchoCTASection = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Want to Try It Later?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Let&apos;s build the future of voice + language AI—together.
          </p>

          <div className="grid gap-8 mx-auto max-w-sm">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Join the Waitlist</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Be the first to know when A1 is ready
                </CardDescription>
                <Button
                  className="w-full bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl "
                  asChild
                >
                  <Link to="/early-access">Join Waitlist</Link>
                </Button>
              </CardContent>
            </Card>

            {/* <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Request Early Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Get priority access to beta testing
                </CardDescription>
                <Button className="w-full" asChild>
                  <Link to="/early-access">
                    Request Access
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <HeadphonesIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Partner With Us</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Collaborate on development and integration
                </CardDescription>
                <Button className="w-full" asChild>
                  <Link to="/contact">
                    Contact Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default AryaEchoCTASection;
