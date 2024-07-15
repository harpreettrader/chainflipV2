import React from 'react';

interface SidebarProps {
  setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4">
        <ul className="mt-4">
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => setActiveComponent('Home')}>Home</li>
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => setActiveComponent('Shop')}>Shop</li>
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => setActiveComponent('Play')}>Play</li>
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => setActiveComponent('Swap')}>Swap</li>
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => setActiveComponent('Broker')}>Broker</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
