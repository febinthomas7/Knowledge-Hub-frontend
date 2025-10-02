import { ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const ActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Team Activity Feed
        </h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <ClockIcon className="h-5 w-5 text-[var(--text-color-2)] mr-2" />
        <h3 className="text-lg font-medium text-[var(--text-color)]">
          Team Activity Feed
        </h3>
      </div>

      {activities?.length === 0 ? (
        <p className="text-[var(--text-color-2)] text-sm">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-color)]">
                  <span className="font-medium">
                    {activity?.updatedBy?.name}
                  </span>{" "}
                  updated <span className="font-medium">{activity?.title}</span>
                </p>
                <p className="text-xs text-[var(--text-color-2)]">
                  {new Date(activity?.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
