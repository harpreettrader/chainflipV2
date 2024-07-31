import React from 'react';

interface SidebarProps {
  setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent }) => {
  return (
      <div className="w-64 bg-gray-500 text-white min-h-screen flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Sidebar</h2>
      <button
        onClick={() => setActiveComponent('Home')}
        className="mb-2 py-2 px-4 bg-gray-800 rounded hover:bg-gray-600 transition duration-300"
      >
        Home
      </button>
      <button
        onClick={() => setActiveComponent('Shop')}
        className="mb-2 py-2 px-4  bg-gray-800 hover:bg-gray-600 transition duration-300"
      >
        Shop
      </button>
      <button
        onClick={() => setActiveComponent('Play')}
        className="mb-2 py-2 px-4  bg-gray-800 hover:bg-gray-600 transition duration-300"
      >
        Play
      </button>
      <button
        onClick={() => setActiveComponent('Swap')}
        className="mb-2 py-2 px-4  bg-gray-800 hover:bg-gray-600 transition duration-300"
      >
        Swap
      </button>
      <button
        onClick={() => setActiveComponent('Broker')}
        className="mb-2 py-2 px-4  bg-gray-800 hover:bg-gray-600 transition duration-300"
      >
        Broker
      </button>
    </div>
  );
};

export default Sidebar;
