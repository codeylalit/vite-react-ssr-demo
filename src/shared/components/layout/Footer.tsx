import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, MessageCircle, Twitter, MessageSquare } from 'lucide-react';
import { getLanguageStatistics } from '../../../modules/landing/utils/languageStats';

const Footer = () => {
  const languageStats = getLanguageStatistics();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="grid md:grid-cols-4 gap-8">
          Company Info
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              <img
                src="/logo-light.png"
                alt="Shunya Labs"
                className="h-12 w-auto hover:opacity-80 transition-opacity duration-200"
              />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Advanced speech recognition technology enabling seamless multilingual communication
              across {languageStats.totalLanguages}+ languages with precision and cultural understanding.
            </p>

            United We Care Description
            <div className="space-y-2 pt-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Shunya Labs: A Deeptech Venture by{' '}
                <a
                  href="https://unitedwecare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  United We Care
                </a>
              </p>
            </div>
          </div>

          Product
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product</h3>
            <div className="space-y-2 text-gray-600">
              <button
                onClick={() =>
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="block hover:text-gray-900 transition-colors"
              >
                Demo
              </button>
              <button
                onClick={() =>
                  document.getElementById('benchmarks')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="block hover:text-gray-900 transition-colors"
              >
                Benchmarks
              </button>
              <button
                onClick={() =>
                  document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="block hover:text-gray-900 transition-colors"
              >
                Documentation
              </button>
            </div>
          </div>

          Contact
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <div className="space-y-2 text-gray-600">
              <a
                href="mailto:0@shunyalabs.ai"
                className="flex items-center space-x-2 hover:text-gray-900 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>0@shunyalabs.ai</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-gray-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discord</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-gray-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div> */}

        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/logo-light.png"
                alt="Shunya Labs"
                className="h-12 w-auto hover:opacity-80 transition-opacity duration-200"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A Deeptech Venture by United We Care.
            </p>
            <div className="flex space-x-4 hidden">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/product/verbatim"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Pingala V1
                  <p className="text-gray-400">Automatic Speech Recognition</p>
                </Link>
              </li>
              <li>
                <Link
                  to="/product/reason"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  B1
                  <p className="text-gray-400">Text to Speech</p>
                </Link>
              </li>
              <li>
                <Link
                  to="/product/echo"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  A1
                  <p className="text-gray-400">Voice to Voice</p>
                </Link>
              </li>

              <li>
                <Link
                  to="/product/stream"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  M1
                  <p className="text-gray-400">Native Reasoning Engine</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="font-semibold mb-4">Technology</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/pingala" className="text-gray-600 hover:text-black transition-colors">
                  Pingala V1
                  <p className="text-gray-400">Advanced Speech Technology</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-semibold mb-4">Pricing</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-black transition-colors">
                  View Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-black transition-colors">
                  Our Story
                </Link>
              </li>
              {/* <li>
                <Link to="/pr-news" className="text-gray-600 hover:text-black transition-colors">
                  PR News
                  <p className="text-gray-400">Press Releases & Media Coverage</p>
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">© 2025 Shunya Labs. All rights reserved.</div>
          <div className="flex space-x-6 text-sm text-gray-600 mt-4 md:mt-0">
            <Link to="/legal/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <Link to="/legal/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <Link to="/legal/security" className="hover:text-gray-900 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
