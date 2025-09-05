import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

const MadaStreamCollabrate = () => {
  return (
    <>
      {/* Try It or Collaborate */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Try It or Collaborate</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Logic meets learning. Build with real understanding.
          </p>

          <div className="grid gap-8  mx-auto max-w-sm">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Get Early Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Be the first to experience the power of M1
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

            {/* <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Sample Proof Walkthrough</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Explore step-by-step mathematical reasoning
                </CardDescription>
                <Button className="w-full">
                  View Walkthrough
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Join as Research Partner</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6">
                  Collaborate on advancing logical reasoning AI
                </CardDescription>
                <Button className="w-full" asChild>
                  <Link to="/contact">
                    Partner With Us
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

export default MadaStreamCollabrate;
