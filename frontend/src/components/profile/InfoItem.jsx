export default function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      {icon && <div className="text-primary">{icon}</div>}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}