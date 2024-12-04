import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        {/* Plane Icon (SVG) */}
        <svg
          className="plane-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 16v-2c0-1.1-.9-2-2-2h-2.59L9 3H7v7L3 8H2v2l5 3H3v2h4v7h2l7.41-7H19c1.1 0 2-.9 2-2zm-7.41-2L9 18.59V5.41L13.59 10H19v2h-4.41z"
          />
        </svg>
        <span className="header-title">Flyox</span>
      </div>
      <nav className="header-buttons">
        <button className="header-button">Home</button>
        <button className="header-button">Search Flights</button>
        <button className="header-button">Book a Trip</button>
      </nav>
    </header>
  );
};

export default Header;
