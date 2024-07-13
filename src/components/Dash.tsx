import React, { useState } from 'react';
import Sidebar from './SideBar';
import Home from './Home';
import Shop from './Shop';
import Play from './Play';
import Swap from './Swap';

const Dashboard: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('Swap');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <Home />;
      case 'Shop':
        return <Shop />;
      case 'Play':
        return <Play />;
      default:
        return <Swap />;
    }
  };

  return (
    <div className="flex">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex-1 p-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
