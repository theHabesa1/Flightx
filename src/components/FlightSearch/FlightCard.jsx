import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  makeStyles,
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '16px',
    transition: 'transform 0.2s',
    borderRadius: '12px', 
    maxWidth: '800px',
    margin: '0 auto', 
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: theme.shadows[5],
    },
  },
  price: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
  },
  carrierLogo: {
    width: '40px',
    marginRight: '8px',
  },
  infoText: {
    color: theme.palette.text.secondary,
  },
}));

const FlightCard = ({ flight, onSelect  }) => {
  const classes = useStyles();
  const { price, legs } = flight;
  const leg = legs[0]; 

  return (
    <Card variant="outlined" className={classes.card} onClick={onSelect} style={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography className={classes.price}>
          {price.formatted}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography className={classes.infoText}>
              <FlightTakeoffIcon fontSize="small" /> {leg.origin.name} ({leg.origin.displayCode})
            </Typography>
            <Typography className={classes.infoText}>
              <AccessTimeIcon fontSize="small" /> Departure: {new Date(leg.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography className={classes.infoText}>
              <FlightLandIcon fontSize="small" /> {leg.destination.name} ({leg.destination.displayCode})
            </Typography>
            <Typography className={classes.infoText}>
              <AccessTimeIcon fontSize="small" /> Arrival: {new Date(leg.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Grid>
        </Grid>
        <Typography className={classes.infoText}>
          Duration: {leg.durationInMinutes} minutes | Stops: {leg.stopCount}
        </Typography>
        <Grid container spacing={1} style={{ marginTop: '8px' }}>
          {leg.carriers.marketing.map((carrier) => (
            <Grid item xs={6} sm={4} key={carrier.alternateId}>
              <Box display="flex" alignItems="center">
                <img src={carrier.logoUrl} alt={carrier.name} className={classes.carrierLogo} />
                <Typography variant="body2">{carrier.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
