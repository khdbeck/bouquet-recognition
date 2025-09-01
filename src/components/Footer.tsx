import type React from 'react';

const Footer: React.FC = () => {
  return (
      <footer className="bg-gray-600 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold">Learn More</h3>
              <ul className="space-y-2">
                <li><a href="/model-details" className="text-gray-300 hover:text-white">Model Overview</a></li>
                <li><a href="/applications" className="text-gray-300 hover:text-white">Use Cases</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Get Started</h3>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact us</a></li>
                <li><a href="/demo" className="text-gray-300 hover:text-white">Live Demo</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Developers</h3>
              <ul className="space-y-2">
                <li><a href="/docs" className="text-gray-300 hover:text-white">Model Docs</a></li>
                <li><a href="/api" className="text-gray-300 hover:text-white">API Reference</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Project</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white">About the Project</a></li>
                <li><a href="/blog" className="text-gray-300 hover:text-white">Development Blog</a></li>
                <li><a href="mailto:support@bouquetai.com" className="text-gray-300 hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between border-t border-gray-500 pt-6 md:flex-row">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-300">© {new Date().getFullYear()} BouquetAI | <a href="/privacy" className="hover:text-white">Privacy Policy</a> | <a href="/terms" className="hover:text-white">Terms</a></p>
            </div>

            <div className="flex space-x-4">
              <a href="https://github.com/khdbeck" aria-label="BouquetAI on Github" className="text-gray-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
