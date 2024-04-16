const {
  Client,
  TransitMode,
  TransitRoutingPreference,
  TravelMode,
} = require("@googlemaps/google-maps-services-js");

async function getDirection(req, res, next) {
  try {
    const {
      origin,
      destination,
      origin_shelter: originShelter,
      destination_shelter: destinationShelter,
    } = req.body;

    const client = new Client({});

    const response = await client.directions({
      params: {
        origin: originShelter || origin,
        destination,
        key: process.env.GOOGLE_API_KEY,
        mode: TravelMode.transit,
        alternatives: true,
        transitMode: TransitMode.bus,
        transit_routing_preference: TransitRoutingPreference.fewer_transfers,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDirection,
};
