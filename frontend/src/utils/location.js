const LOCATION_KEY = "user_location";
const LOCATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export  const getUserLocation = () => {
  const stored = localStorage.getItem(LOCATION_KEY);

  if (stored) {
    const parsed = JSON.parse(stored);
    const isExpired = Date.now() - parsed.timestamp > LOCATION_EXPIRY;

    if (!isExpired) {
      return Promise.resolve(parsed);
    }
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: Date.now()
        };

        localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
        resolve(location);
      },
      (err) => reject(err),
      { enableHighAccuracy: true }
    );
  });
};

// navigator.geolocation.getCurrentPosition(
//   successCallback,
//   errorCallback,
//   options
// );
