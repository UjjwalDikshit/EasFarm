import ProfileHeader from "./ProfileHeader";
import ProfileInfoGrid from "./ProfileInfoGrid";
import ProfileOrders from "./ProfileOrders";
import ProfileInterests from "./ProfileInterests";
import ProfileActions from "./ProfileActions";

export default function FarmerProfile({ farmer }) {
  if (!farmer) return null;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <ProfileHeader farmer={farmer} />
      <ProfileActions farmer={farmer} />
      <ProfileInfoGrid farmer={farmer} />
      <ProfileInterests farmer={farmer} />
      <ProfileOrders /> {/* no farmer.myOrders */}
    </div>
  );
}