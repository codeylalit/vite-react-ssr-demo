import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BharaReasonGetStarted = () => {
  return (
    <>
      {/* Get Started */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Get Started</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Bring voice to life—with emotion, rhythm, and soul.
          </p>

          <div className="grid gap-8  mx-auto max-w-sm">
            {/* <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>🎤 Hear a Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Experience the emotional depth of our voice synthesis
                </CardDescription>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Listen Now
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Copy className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>🧬 Clone a Voice</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Create custom voices with emotional accuracy
                </CardDescription>
                <Button className="w-full">
                  Start Cloning
                </Button>
              </CardContent>
            </Card> */}

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Get Early Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Be the first to hear when B1 launches
                </CardDescription>
                <Button
                  className="w-full bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl "
                  asChild
                >
                  <Link to="/early-access">
                    Join Waitlist
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

export default BharaReasonGetStarted;
