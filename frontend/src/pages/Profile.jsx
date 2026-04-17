import FarmerProfile from "../components/profile/FarmerProfile";
import { FarmerProfileSkeleton } from "../components/profile/FarmerProfileSkeleton";
import useFarmerProfile from "../hooks/useFarmerProfile";

export default function FarmerProfilePage() {
  const { farmer, loading, error } = useFarmerProfile();

  if (loading) return <FarmerProfileSkeleton />;

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load profile
      </div>
    );
  }

  return <FarmerProfile farmer={farmer} />;
}