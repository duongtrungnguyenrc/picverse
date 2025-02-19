import { Skeleton } from "@app/components";

const CloudLoading = () => {
  return (
    <div className="p-10 space-y-8">
      {/* Cloud Control Section */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-28" /> {/* "Cloud control" text */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-[150px] rounded-xl" />
          ))}
        </div>
      </div>

      {/* All Resources Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-28" /> {/* "All resources" text */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[240px]" /> {/* Search bar */}
            <Skeleton className="h-10 w-[160px]" /> {/* Filter dropdown */}
            <Skeleton className="h-10 w-10" /> {/* View toggle */}
            <Skeleton className="h-10 w-10" /> {/* View toggle */}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CloudLoading;
