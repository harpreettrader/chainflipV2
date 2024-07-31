import React from 'react';

interface HomeProps {
  setActiveComponent: (component: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveComponent }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h2 className="text-4xl font-bold mb-8">Dashboard Home</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <button
          onClick={() => setActiveComponent('Home')}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Home
        </button>
        <button
          onClick={() => setActiveComponent('Shop')}
          className=" bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Shop
        </button>
        <button
          onClick={() => setActiveComponent('Play')}
          className=" bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Play
        </button>
        <button
          onClick={() => setActiveComponent('Swap')}
          className=" bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Swap
        </button>
        <button
          onClick={() => setActiveComponent('Broker')}
          className=" bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Broker
        </button>
      </div>
    </div>
  );
};

export default Home;
