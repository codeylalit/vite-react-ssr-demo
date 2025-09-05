import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/shared/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Check if any product routes are active
  const isProductActive = () => {
    const productRoutes = [
      '/product/verbatim',
      '/product/echo',
      '/product/reason',
      '/product/stream',
    ];
    return productRoutes.some(route => location.pathname === route);
  };

  // Check if any technology routes are active
  const isTechnologyActive = () => {
    const technologyRoutes = ['/pingala'];
    return technologyRoutes.some(route => location.pathname === route);
  };

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo-light.png" alt="Shunya Labs" className="w-auto h-10" />
            {/* <span className="font-bold text-xl text-midnight">Shunya Labs</span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center space-x-1 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isProductActive() ? 'text-primary' : 'text-foreground'} focus-visible:outline-none focus-visible:ring-0`}
              >
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 focus-visible:outline-none focus-visible:ring-0"
              >
                <DropdownMenuItem
                  asChild
                  className="group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Link to="/product/verbatim" className="w-full">
                    <div>
                      <div className="font-medium group-hover:text-white">Pingala V1</div>
                      <div className="text-sm text-muted-foreground group-hover:text-slate-100">
                        Automatic Speech Recognition
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Link to="/product/reason" className="w-full">
                    <div>
                      <div className="font-medium group-hover:text-white">B1</div>
                      <div className="text-sm text-muted-foreground group-hover:text-slate-100">
                        Text to Speech
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Link to="/product/echo" className="w-full">
                    <div>
                      <div className="font-medium group-hover:text-white">A1</div>
                      <div className="text-sm text-muted-foreground group-hover:text-slate-100">
                        Voice to Voice
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Link to="/product/stream" className="w-full">
                    <div>
                      <div className="font-medium group-hover:text-white">M1</div>
                      <div className="text-sm text-muted-foreground group-hover:text-slate-100">
                        Native Reasoning Engine
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center space-x-1 hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isTechnologyActive() ? 'text-primary' : 'text-foreground'} focus-visible:outline-none focus-visible:ring-0`}
              >
                <span>Technology</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 focus-visible:outline-none focus-visible:ring-0"
              >
                <DropdownMenuItem
                  asChild
                  className="group hover:bg-blue-400 focus:bg-blue-400 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Link to="/pingala" className="w-full">
                    <div>
                      <div className="font-medium group-hover:text-white">Pingala V1</div>
                      <div className="text-sm text-muted-foreground group-hover:text-slate-100">
                        Advanced Speech Technology
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/pricing"
              className={`hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isActive('/pricing') ? 'text-primary' : 'text-foreground'} pt-2`}
            >
              Pricing
            </Link>

            <Link
              to="/about"
              className={`hover:bg-accent/10 rounded-md px-2 py-1 transition-colors ${isActive('/about') ? 'text-primary' : 'text-foreground'} pt-2`}
            >
              About Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent/50">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 p-0" showDefaultClose={false}>
                <div className="flex flex-col h-full">
                  <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <img src="/logo-light.png" alt="Shunya Labs" className="w-auto h-10" />
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <X className="w-6 h-6" />
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <div className="px-6 py-4 space-y-4">
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="product" className="border-none">
                          <AccordionTrigger
                            className={`hover:no-underline py-3 px-0 ${isProductActive() ? 'text-primary' : 'text-foreground'}`}
                          >
                            Product
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-3 pl-4">
                              <SheetClose asChild>
                                <Link
                                  to="/product/verbatim"
                                  className={`block py-2 px-3 rounded-md transition-colors ${isActive('/product/verbatim') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                                  onClick={closeSheet}
                                >
                                  <div>
                                    <div className="font-medium">Pingala V1</div>
                                    <div className="text-sm text-muted-foreground">
                                      Automatic Speech Recognition
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>

                              <SheetClose asChild>
                                <Link
                                  to="/product/reason"
                                  className={`block py-2 px-3 rounded-md transition-colors ${isActive('/product/reason') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                                  onClick={closeSheet}
                                >
                                  <div>
                                    <div className="font-medium">B1</div>
                                    <div className="text-sm text-muted-foreground">
                                      Text to Speech
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  to="/product/echo"
                                  className={`block py-2 px-3 rounded-md transition-colors ${isActive('/product/echo') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                                  onClick={closeSheet}
                                >
                                  <div>
                                    <div className="font-medium">A1</div>
                                    <div className="text-sm text-muted-foreground">
                                      Voice to Voice
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  to="/product/stream"
                                  className={`block py-2 px-3 rounded-md transition-colors ${isActive('/product/stream') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                                  onClick={closeSheet}
                                >
                                  <div>
                                    <div className="font-medium">M1</div>
                                    <div className="text-sm text-muted-foreground">
                                      Native Reasoning Engine
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="technology" className="border-none">
                          <AccordionTrigger
                            className={`hover:no-underline py-3 px-0 ${isTechnologyActive() ? 'text-primary' : 'text-foreground'}`}
                          >
                            Technology
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-3 pl-4">
                              <SheetClose asChild>
                                <Link
                                  to="/pingala"
                                  className={`block py-2 px-3 rounded-md transition-colors ${isActive('/pingala') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                                  onClick={closeSheet}
                                >
                                  <div>
                                    <div className="font-medium">Pingala V1</div>
                                    <div className="text-sm text-muted-foreground">
                                      Advanced Speech Technology
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="space-y-2 pt-4 border-t">
                        <SheetClose asChild>
                          <Link
                            to="/pricing"
                            className={`block py-3 px-0 rounded-md transition-colors ${isActive('/pricing') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                            onClick={closeSheet}
                          >
                            Pricing
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/about"
                            className={`block py-3 px-0 rounded-md transition-colors ${isActive('/about') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent/50'}`}
                            onClick={closeSheet}
                          >
                            About Us
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
