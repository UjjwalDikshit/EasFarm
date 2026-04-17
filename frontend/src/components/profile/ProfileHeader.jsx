import { ShieldCheck, User } from "lucide-react";

export default function ProfileHeader({ farmer }) {
  if (!farmer) return null;

  // Get first letter and ensure it's Uppercase
  const initial = farmer.fullName?.trim().charAt(0).toUpperCase() || null;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200/20">
      <div className="card-body p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          {/* LEFT: Avatar + Info */}
          <div className="flex items-center gap-5">
            
            {/* AVATAR SECTION */}
            <div className="avatar placeholder">
              {/* Note: Added flex, items-center, and justify-center directly here */}
              <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center ring ring-primary ring-offset-base-100 ring-offset-2">
                <span className="text-2xl font-bold leading-none flex items-center justify-center select-none">
                  {initial || <User size={28} />}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {farmer.fullName || "User Name"}
              </h2>
              
              <div className="flex flex-col">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  {farmer.role || "FARMER"}
                </p>
                {farmer.emailId && (
                  <p className="text-sm text-gray-400 mt-1">
                    {farmer.emailId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Status Badge */}
          <div className="flex items-center">
            {farmer.hasCompletedOnboarding && (
              <div className="badge badge-outline badge-success px-4 py-3 gap-2 font-semibold">
                <ShieldCheck size={16} className="text-success" />
                Verified
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}