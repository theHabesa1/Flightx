const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = "sky-scrapper.p.rapidapi.com";

const fetchAirportData = async (query) => {
  if (query.length < 3) return [];
  try {
    const response = await fetch(
      `https://${API_HOST}/api/v1/flights/searchAirport?query=${query}&locale=en-US`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );
    const data = await response.json();
    if (data.status) {
      return data.data.map((item) => ({
        id: item.skyId,
        entityId: item.entityId,
        name: item.presentation.title,
        subtitle: item.presentation.subtitle,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching airport data:', error);
    return [];
  }
};

const searchFlights = async (params) => {
  const {
    fromSkyId,
    toSkyId,
    fromEntityId,
    toEntityId,
    departDate,
    travelers,
  } = params;

  try {
    const response = await fetch(
      `https://${API_HOST}/api/v1/flights/searchFlights?originSkyId=${fromSkyId}&destinationSkyId=${toSkyId}&originEntityId=${fromEntityId}&destinationEntityId=${toEntityId}&date=${departDate}&cabinClass=economy&adults=${travelers}&sortBy=best&currency=USD&market=en-US&countryCode=US`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );
    const data = await response.json();
    return data.data.itineraries || [];
  } catch (error) {
    console.error('Error searching for flights:', error);
    return [];
  }
};

const getFlightDetails = async (params) => {
  const {
    itineraryId,
    sessionId,
    legs
  } = params;

  try {
    // Encode the legs parameter
    const encodedLegs = encodeURIComponent(JSON.stringify(legs));

    const response = await fetch(
      `https://${API_HOST}/api/v1/flights/getFlightDetails?` + 
      `itineraryId=${itineraryId}&` +
      `sessionId=${sessionId}&` +
      `legs=${encodedLegs}&` +
      `adults=1&currency=USD&locale=en-US&market=en-US&countryCode=US`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
      }
    );
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching flight details:', error);
    return null;
  }
};

export { fetchAirportData, searchFlights,getFlightDetails  };
