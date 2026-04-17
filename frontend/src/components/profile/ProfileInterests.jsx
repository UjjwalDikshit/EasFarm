export default function ProfileInterests({ farmer }) {
  if (!farmer.interests?.categories?.length) return null;

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="font-semibold">Interests</h3>

        <div className="flex flex-wrap gap-2">
          {farmer.interests.categories.map((c, i) => (
            <span key={i} className="badge badge-outline">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}