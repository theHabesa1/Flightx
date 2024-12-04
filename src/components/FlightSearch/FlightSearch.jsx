import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  Collapse,
  Slider,
  Checkbox,
  FormGroup,
  ListItem,
  Typography,
} from '@material-ui/core';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FilterListIcon from '@material-ui/icons/FilterList';
import FlightCard from './FlightCard'; // Import the FlightCard component
import './FlightSearch.css';
import CloseIcon from '@material-ui/icons/Close';
import LoadingScreen from '../Loading/LoadingScreen';



const FlightSearch = () => {
  const [tripType, setTripType] = useState('roundTrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromSkyId, setFromSkyId] = useState('');
  const [toSkyId, setToSkyId] = useState('');
  const [fromEntityId, setFromEntityId] = useState('');
  const [toEntityId, setToEntityId] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [flights, setFlights] = useState([]); 
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAirportData = async (query, isFromField) => {
    if (query.length < 3) return;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '04255f6525mshbcfa91250673d25p1aa87djsn3e5f8cb1fdb8', // Replace with your actual API key
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${query}&locale=en-US`, options);
      const data = await response.json();

      if (data.status) {
        const suggestions = data.data.map(item => ({
          id: item.skyId,
          entityId: item.entityId,
          name: item.presentation.title,
          subtitle: item.presentation.subtitle,
        }));

        if (isFromField) {
          setFromSuggestions(suggestions);
        } else {
          setToSuggestions(suggestions);
        }
      }
    } catch (error) {
      console.error('Error fetching airport data:', error);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchAirportData(from, true);
    }, 300);
    return () => clearTimeout(debounceFetch);
  }, [from]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchAirportData(to, false);
    }, 300);
    return () => clearTimeout(debounceFetch);
  }, [to]);

  const handleSearch = async () => {
    setIsLoading(true);
    console.log('Searching for flights...');

    // Check for empty fields
    if (!fromSkyId || !toSkyId || !departDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const options = {
      method: 'GET',
      hostname: 'sky-scrapper.p.rapidapi.com',
      port: null,
      path: `/api/v1/flights/searchFlights?originSkyId=${fromSkyId}&destinationSkyId=${toSkyId}&originEntityId=${fromEntityId}&destinationEntityId=${toEntityId}&date=${departDate}&cabinClass=economy&adults=${travelers}&sortBy=best&currency=USD&market=en-US&countryCode=US`,
      headers: {
        'x-rapidapi-key': '04255f6525mshbcfa91250673d25p1aa87djsn3e5f8cb1fdb8',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    };

    // Make the request using fetch
    try {
      const response = await fetch(`https://${options.hostname}${options.path}`, {
        method: options.method,
        headers: options.headers,
      });
      const data = await response.json();
      console.log(data); 
      setIsLoading(false);
      setFlights(data.data.itineraries); 
    } catch (error) {
      console.error('Error searching for flights:', error);
    }
  };

  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    stops: {
      nonstop: false,
      oneStop: false,
      multiStop: false,
    },
    airlines: {},
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState([]);

  // New method to apply filters
  const applyFilters = () => {
    if (!flights.length) return [];

    return flights.filter(flight => {
      // Convert price to a number and add some debugging
      const price = Number(flight.price.raw);
      console.log('Price filtering:', {
        flightPrice: price,
        filterMin: filters.priceRange[0],
        filterMax: filters.priceRange[1]
      });
  
      const isPriceInRange = 
        price >= filters.priceRange[0] && 
        price <= filters.priceRange[1];
  
      // Rest of the filtering logic remains the same
      const stopCount = flight.legs[0].stopCount;
      const isStopsMatch = 
        (filters.stops.nonstop && stopCount === 0) ||
        (filters.stops.oneStop && stopCount === 1) ||
        (filters.stops.multiStop && stopCount > 1) ||
        (!filters.stops.nonstop && !filters.stops.oneStop && !filters.stops.multiStop);
  
      const airlines = flight.legs[0].carriers.marketing.map(carrier => carrier.name);
      const isAirlineMatch = 
        Object.keys(filters.airlines).length === 0 || 
        airlines.some(airline => filters.airlines[airline]);
  
      return isPriceInRange && isStopsMatch && isAirlineMatch;
    });
  };

  // Effect to update filtered flights when filters or flights change
  useEffect(() => {
    const updatedFilteredFlights = applyFilters();
    setFilteredFlights(updatedFilteredFlights);
  }, [flights, filters]);

  // Method to handle price range change
  const handlePriceChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  // Method to handle stops filter
  const handleStopsChange = (event) => {
    setFilters(prev => ({
      ...prev,
      stops: {
        ...prev.stops,
        [event.target.name]: event.target.checked
      }
    }));
  };

  // Method to handle airlines filter
  const handleAirlineChange = (airlineName) => {
    setFilters(prev => ({
      ...prev,
      airlines: {
        ...prev.airlines,
        [airlineName]: !prev.airlines[airlineName]
      }
    }));
  };

  // Extract unique airlines from flights
  const extractUniqueAirlines = () => {
    const airlines = new Set();
    flights.forEach(flight => {
      flight.legs[0].carriers.marketing.forEach(carrier => {
        airlines.add(carrier.name);
      });
    });
    return Array.from(airlines);
  };
  return (
    <>
      {isLoading && <LoadingScreen />}
    <Box className="flight-search-container">
      <Box className="search-box">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="tripType"
                name="tripType"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                row
              >
                <FormControlLabel value="roundTrip" control={<Radio color="primary" />} label="Round Trip" />
                <FormControlLabel value="oneWay" control={<Radio color="primary" />} label="One Way" />
                <FormControlLabel value="multiCity" control={<Radio color="primary" />} label="Multi-City" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="From"
              variant="outlined"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              fullWidth
            />
            {fromSuggestions.length > 0 && (
              <List>
                {fromSuggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.id}
                    button
                    onClick={() => {
                      setFrom(suggestion.name);
                      setFromSkyId(suggestion.id);
                      setFromEntityId(suggestion.entityId);
                      setFromSuggestions([]); // Clear suggestions on selection
                    }}
                  >
                    {suggestion.name} ({suggestion.subtitle})
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          <Grid item xs={12} sm={1} container justifyContent="center" alignItems="center">
            <FlightTakeoffIcon style={{ fontSize: 40 }} />
          </Grid>

          <Grid item xs={12} sm={5}>
            <TextField
              label="To"
              variant="outlined"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              fullWidth
            />
            {toSuggestions.length > 0 && (
              <List>
                {toSuggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.id}
                    button
                    onClick={() => {
                      setTo(suggestion.name);
                      setToSkyId(suggestion.id);
                      setToEntityId(suggestion.entityId);
                      setToSuggestions([]); // Clear suggestions on selection
                    }}
                  >
                    {suggestion.name} ({suggestion.subtitle})
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Departure Date"
              type="date"
              variant="outlined"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Return Date (optional)"
              type="date"
              variant="outlined"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Travelers"
              type="number"
              variant="outlined"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search Flights
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Render Flight Cards below the search box */}
     
    </Box>
     {/* Filter Button */}
     <Box textAlign="center" my={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={() => setIsFilterModalOpen(true)}
        >
          Show Filters
        </Button>
      </Box>

      {/* Filter Modal */}
      <Dialog
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="left">
            <Typography variant="h6">Flight Filters</Typography>
            <Button 
              onClick={() => setIsFilterModalOpen(false)}
              color="secondary"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Price Range Filter */}
          <Box mb={3}>
            <Typography id="price-range-slider" gutterBottom>
              Price Range (USD)
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              aria-labelledby="price-range-slider"
              min={0}
              max={1000}
            />
          </Box>

          {/* Stops Filter */}
          <Box mb={3}>
            <Typography gutterBottom>Stops</Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.stops.nonstop}
                    onChange={handleStopsChange}
                    name="nonstop"
                  />
                }
                label="Non-stop"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.stops.oneStop}
                    onChange={handleStopsChange}
                    name="oneStop"
                  />
                }
                label="1 Stop"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.stops.multiStop}
                    onChange={handleStopsChange}
                    name="multiStop"
                  />
                }
                label="2+ Stops"
              />
            </FormGroup>
          </Box>

          {/* Airlines Filter */}
          <Box mb={3}>
            <Typography gutterBottom>Airlines</Typography>
            <FormGroup row>
              {extractUniqueAirlines().map(airline => (
                <FormControlLabel
                  key={airline}
                  control={
                    <Checkbox
                      checked={!!filters.airlines[airline]}
                      onChange={() => handleAirlineChange(airline)}
                    />
                  }
                  label={airline}
                />
              ))}
            </FormGroup>
          </Box>

          {/* Apply Filters Button */}
          <Box textAlign="center" mt={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    <Box mt={9}>
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))
        ) : (
          <Typography variant="body1">No flights match your filters.</Typography>
        )}
      </Box>
   </>
  );
};

export default FlightSearch;
