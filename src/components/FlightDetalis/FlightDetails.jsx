import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Button
} from '@material-ui/core';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import { getFlightDetails } from '../../utils/apiService';

const FlightDetails = ({ open, onClose, flight, sessionId }) => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (open && flight) {
        setIsLoading(true);
        try {
          // Prepare legs from the flight object
          const legs = flight.legs.map(leg => ({
            origin: leg.origin.code,
            destination: leg.destination.code,
            date: flight.departureDate // Assuming this is available in the flight object
          }));

          const details = await getFlightDetails({
            itineraryId: flight.id,
            sessionId: sessionId,
            legs: legs
          });

          setFlightDetails(details);
        } catch (error) {
          console.error('Error fetching flight details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDetails();
  }, [open, flight, sessionId]);

  if (!flight) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Flight Details</Typography>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Loading flight details...</Typography>
        ) : flightDetails ? (
          <Box>
            {/* Basic Flight Info */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <FlightTakeoffIcon />
                  <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                    Departure: {flight.legs[0].origin.name}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {flight.legs[0].departure.time}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <FlightLandIcon />
                  <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                    Arrival: {flight.legs[0].destination.name}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {flight.legs[0].arrival.time}
                </Typography>
              </Grid>
            </Grid>

            <Divider style={{ margin: '16px 0' }} />

            {/* Price Details */}
            <Typography variant="h6">Pricing</Typography>
            <Typography>
              Total Price: {flight.price.formatted}
            </Typography>

            {/* Additional Details from API Response */}
            {/* You can expand this based on the actual API response */}
            {flightDetails && (
              <Box mt={2}>
                <Typography variant="h6">Additional Details</Typography>
                <pre>{JSON.stringify(flightDetails, null, 2)}</pre>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>Unable to fetch flight details.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlightDetails;