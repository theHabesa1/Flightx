// src/components/Footer/Footer.js
import React from 'react';
import { Grid, Typography, Link } from '@material-ui/core';
//import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">About</Typography>
          <ul>
            <li><Link href="#">Company</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Press</Link></li>
          </ul>
        </Grid>
        {/* Add more footer sections like "Help", "Legal", "Social" */}
      </Grid>
      <div className="footer-bottom">
        <Typography variant="body2">© 2023 Flyox. All rights reserved.</Typography>
      </div>
    </footer>
  );
};

export default Footer;