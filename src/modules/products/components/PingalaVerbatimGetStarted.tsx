import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const PingalaVerbatimGetStarted = () => {
  return (
    <>
      {/* Get Started */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Get Started</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Experience the speed and privacy of Pingala Verbatim
          </p>

          <div className="grid md:grid-cols-2 gap-8 mx-auto max-w-2xl">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
              <CardHeader>
                <Play className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <CardTitle>Live Demo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full">
                <CardDescription className="mb-2">Try it now—experience the speed</CardDescription>
                <Link to="/#hero-audio-sample" className="w-full mt-auto">
                  <Button className="w-full bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ">
                    Try Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Free Trial</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Test integrations with our SDK
                </CardDescription>
                <Button className="w-full">
                  Download SDK
                </Button>
              </CardContent>
            </Card> */}

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full">
                <CardDescription className="mb-2">
                  Get a personalized walkthrough of Pingala Verbatim
                </CardDescription>
                <Button
                  className="w-full bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl "
                  asChild
                >
                  <Link to="/contact">
                    Book a demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default PingalaVerbatimGetStarted;
