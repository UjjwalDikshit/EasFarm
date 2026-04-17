import { useEffect, useState } from "react";
import { getFarmerProfile } from "../components/profile/api";

export default function useFarmerProfile() {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getFarmerProfile(); // already returns clean data
        setFarmer(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { farmer, loading, error };
}