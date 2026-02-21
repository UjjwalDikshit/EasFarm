// const LOCATION_KEY = "user_location";
// const LOCATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// export  const getUserLocation = () => {
//   const stored = localStorage.getItem(LOCATION_KEY);

//   if (stored) {
//     const parsed = JSON.parse(stored);
//     const isExpired = Date.now() - parsed.timestamp > LOCATION_EXPIRY;

//     if (!isExpired) {
//       return Promise.resolve(parsed);
//     }
//   }

//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject("Geolocation not supported");
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const location = {
//           lat: pos.coords.latitude,
//           lon: pos.coords.longitude,
//           timestamp: Date.now()
//         };

//         localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
//         resolve(location);
//       },
//       (err) => reject(err),
//       { enableHighAccuracy: true }
//     );
//   });
// };

// navigator.geolocation.getCurrentPosition(
//   successCallback,
//   errorCallback,
//   options
// );

// utils/location.js (updated with better error handling)
const LOCATION_KEY = "user_location";
const LOCATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    // Check localStorage first
    const stored = localStorage.getItem(LOCATION_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const isExpired = Date.now() - parsed.timestamp > LOCATION_EXPIRY;

        if (!isExpired && parsed.lat && parsed.lon) {
          return resolve(parsed);
        }
      } catch (e) {
        // Invalid stored data, ignore and get new location
        localStorage.removeItem(LOCATION_KEY);
      }
    }

    // Get fresh location
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: Date.now()
        };

        try {
          localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
        } catch (e) {
          console.warn('Failed to cache location:', e);
        }

        resolve(location);
      },
      (err) => {
        let errorMessage = "Failed to get your location";
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        reject(new Error(errorMessage));
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};