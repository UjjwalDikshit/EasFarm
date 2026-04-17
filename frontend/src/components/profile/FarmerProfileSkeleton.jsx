export function FarmerProfileSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-pulse">
      <div className="card bg-base-100 shadow border">

        <div className="card-body">
          <div className="flex items-center gap-4">
            
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>

            {/* Name */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="divider m-0"></div>

        <div className="card-body space-y-4">
          
          {/* Info blocks */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
          ))}

          {/* Orders */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}