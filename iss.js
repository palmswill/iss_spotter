const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      callback(null, JSON.parse(body));
    }
  });
};

const fetchCoordsByIp = (IP, callback) => {
  const geokey = `3bb6d1e0-7aee-11ec-bb4f-0f77bd018d09`;
  const geoApiUrl = `https://api.freegeoip.app/json`;
  request(`${geoApiUrl}/${IP}?apikey=${geokey}`, (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching Coords. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      callback(null, JSON.parse(body));
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  // ...
  
  const { latitude, longitude } = coords;
  request(
    `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`,
    (err, res, body) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (res.statusCode !== 200) {
        const msg = `Status Code ${res.statusCode} when fetching using Coords. Response: ${body}`;
        callback(Error(msg), null);
        return;
      } else {
        callback(null, JSON.parse(body).response);
      }
    }
  );
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  // empty for now
  fetchMyIP((error, myIp) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    fetchCoordsByIp(myIp.ip, (error, coords) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes(coords, callback)


    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIp, fetchISSFlyOverTimes,nextISSTimesForMyLocation };
