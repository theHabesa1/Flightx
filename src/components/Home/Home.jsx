// src/pages/Home/Home.js
import React from 'react';
import Header from '../../components/Head/Header';
import FlightSearch from '../../components/FlightSearch/FlightSearch';
import Footer from '../../components/Footer/Footer';
//import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <FlightSearch />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;