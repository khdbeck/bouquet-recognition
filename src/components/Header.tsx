import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <a href="/" className="pe-5 text-2xl  font-semibold text-green-500">
            Bouquets
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;
