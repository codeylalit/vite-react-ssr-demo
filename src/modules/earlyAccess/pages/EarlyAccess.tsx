import Navigation from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '@/shared/hooks/useSEO';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// Add this TypeScript declaration above the component to extend window
// and avoid linter/type errors for window.initEmbed

declare global {
  interface Window {
    initEmbed?: (id: string) => void;
  }
}

const EarlyAccess = () => {
  // Apply SEO configuration for Early Access page
  useSEO(SEO_CONFIGS.earlyAccess);

  // Noteforms script injection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scriptId = 'noteforms-iframe-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'text/javascript';
        script.src = 'https://noteforms.com/widgets/iframe.min.js';
        script.onload = function () {
          if (typeof window.initEmbed === 'function') {
            window.initEmbed('contact-us-harlgv');
          }
        };
        document.body.appendChild(script);
      } else if (typeof window.initEmbed === 'function') {
        window.initEmbed('contact-us-harlgv');
      }
    }
  }, []);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Handle iframe loading and scrolling issues
  useEffect(() => {
    const iframe = document.getElementById('contact-us-harlgv') as HTMLIFrameElement;
    if (iframe) {
      const handleIframeLoad = () => {
        // Ensure the iframe container is scrollable
        const container = iframe.parentElement;
        if (container) {
          container.style.overflow = 'auto';
          container.style.maxHeight = '100vh';
          container.classList.add('iframe-container');
        }

        // Try to inject custom CSS into iframe for validation error positioning
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            const style = iframeDocument.createElement('style');
            style.textContent = `
              /* Force validation modals/overlays to appear from top */
              .modal, .overlay, .error-modal, .validation-popup, [class*="modal"], [class*="overlay"], [class*="popup"] {
                position: fixed !important;
                top: 20px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 9999 !important;
                animation: slideInFromTop 0.3s ease-out !important;
              }
              
              @keyframes slideInFromTop {
                from {
                  opacity: 0;
                  transform: translateX(-50%) translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(-50%) translateY(0);
                }
              }
              
              /* Ensure any error messages appear at top of visible area */
              .error, .validation-error, [class*="error"], [class*="validation"] {
                position: sticky !important;
                top: 10px !important;
                z-index: 1000 !important;
              }
            `;
            iframeDocument.head?.appendChild(style);
          }
        } catch (error) {
          // Cross-origin restrictions might prevent iframe modification
          console.warn('Could not modify iframe content due to cross-origin restrictions');
        }
      };

      iframe.addEventListener('load', handleIframeLoad);

      // Monitor for validation errors and scroll to top when they occur
      const handleScroll = () => {
        // Ensure the page can scroll when form validation occurs
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      };

      // Listen for iframe content changes that might indicate validation errors
      const observeIframeChanges = () => {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            const observer = new MutationObserver(mutations => {
              mutations.forEach(mutation => {
                // Check if validation error elements are added
                mutation.addedNodes.forEach(node => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    if (
                      element.classList.contains('error') ||
                      element.classList.contains('validation') ||
                      element.classList.contains('modal') ||
                      element.textContent?.toLowerCase().includes('error') ||
                      element.textContent?.toLowerCase().includes('required')
                    ) {
                      // Scroll iframe to top when validation errors appear
                      iframe.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                });
              });
            });

            observer.observe(iframeDocument.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['class', 'style'],
            });

            return () => observer.disconnect();
          }
        } catch (error) {
          console.warn('Could not observe iframe changes due to cross-origin restrictions');
        }
      };

      // Set up iframe change observation after load
      iframe.addEventListener('load', observeIframeChanges);

      window.addEventListener('scroll', handleScroll);

      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
        iframe.removeEventListener('load', observeIframeChanges);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="py-24 bg-gradient-to-br from-soft-white via-white to-blue-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-midnight mb-4">Welcome to the Future!</h1>
              <p className="text-xl text-gray-600">
                Thank you for joining our early access program. We'll be in touch soon with your API
                credentials and getting started guide.
              </p>
            </div>
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">API Access</p>
                      <p className="text-sm text-gray-600">
                        You'll receive your API keys within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Documentation</p>
                      <p className="text-sm text-gray-600">
                        Complete setup guide and code examples
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Discord Invite</p>
                      <p className="text-sm text-gray-600">Join our community of early adopters</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen scroll-smooth">
      <Navigation />

      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-24 min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #10B981 2px, transparent 0), radial-gradient(circle at 75px 75px, #14B8A6 2px, transparent 0)`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-30 blur-lg animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 hidden">
            <h1 className="text-4xl font-bold text-midnight mb-4">Join Early Access</h1>
            <p className="text-xl text-gray-600">
              Be among the first to experience CPU-first voice AI. Get free access to all four
              models during beta.
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur shadow-xl hidden">
            <CardHeader>
              <CardTitle>Early Access Application</CardTitle>
              <CardDescription>
                Tell us about your use case and we'll get you set up quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">What is your name? *</Label>
                  <Input id="name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">What is your company name? *</Label>
                  <Input id="company" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">What is your email address? *</Label>
                  <Input type="email" id="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">What country are you based in? *</Label>
                  <Input id="country" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">What is your Annual Recurring Revenue? *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your ARR range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50k">£0 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m+">$1,000,000 +</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newsletter">
                    Would you look to subscribe to our newsletter to be kept in the loop on Shunya
                    Lab developments? *
                  </Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-600">
                  By subscribing, you are agreeing to our Privacy Policy.
                </div>

                <Button type="submit" className="w-full">
                  Submit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Noteforms Embed Start */}
          <div className="relative overflow-auto rounded-3xl shadow-md bg-white max-h-screen iframe-container">
            <iframe
              style={{
                border: 'none',
                width: '100%',
                height: '920px',
                display: 'block',
              }}
              id="contact-us-harlgv"
              src="https://noteforms.com/forms/contact-us-bh3a3d"
              title="Early Access Form"
              scrolling="yes"
            ></iframe>
            {/* Noteforms Embed End */}
          </div>

          {/* Custom CSS to override validation modal positioning */}
          <style>{`
            /* Override Noteforms validation modal positioning to appear from top */
            iframe#contact-us-harlgv {
              scroll-behavior: smooth !important;
              position: relative;
            }
            
            /* Container positioning for better modal control */
            .iframe-container {
              position: relative;
              scroll-snap-type: y mandatory;
              overflow-anchor: none;
            }
            
            .iframe-container iframe {
              scroll-snap-align: start;
              position: relative;
            }
            
            /* Force any overlay content to position from top */
            .iframe-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 0;
              z-index: 1;
              pointer-events: none;
            }
            
            /* Global styles for iframe scrollbar */
            iframe#contact-us-harlgv::-webkit-scrollbar {
              width: 8px;
            }
            
            iframe#contact-us-harlgv::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            
            iframe#contact-us-harlgv::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 4px;
            }
            
            iframe#contact-us-harlgv::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
            
            /* CSS to attempt forcing third-party modal positioning */
            iframe#contact-us-harlgv {
              /* These properties might help with external modal positioning */
              transform-style: preserve-3d;
              backface-visibility: hidden;
            }
            
            /* Animation for smooth top positioning */
            @keyframes slideFromTop {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            /* Force any detected modal elements to animate from top */
            iframe#contact-us-harlgv * {
              /* This is a broad selector but necessary for iframe content */
              animation-timing-function: ease-out !important;
            }
          `}</style>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EarlyAccess;
