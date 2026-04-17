import { Phone, Mail, MapPin } from "lucide-react";
import InfoItem from "./InfoItem";

export default function ProfileInfoGrid({ farmer }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <InfoItem icon={<Phone size={16} />} label="Mobile" value={farmer.mobileNumber} />
      <InfoItem icon={<Mail size={16} />} label="Email" value={farmer.emailId} />
      <InfoItem icon={<MapPin size={16} />} label="City" value={farmer.villageOrCity} />
      <InfoItem label="District" value={farmer.district} />
      <InfoItem label="State" value={farmer.state} />
      <InfoItem label="Pincode" value={farmer.pincode} />
    </div>
  );
}