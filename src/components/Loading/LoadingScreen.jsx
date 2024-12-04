import React from 'react';
import './LoadingScreen.css'; // Import the CSS file
import { PropagateLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <PropagateLoader color="#e63333" />
    </div>
  );
};

export default LoadingScreen;
