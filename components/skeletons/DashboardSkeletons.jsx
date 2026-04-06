// components/skeletons/DashboardSkeletons.jsx
export const StatsCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-950/10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
        </div>
    );
};

export const ChartSkeleton = ({ height = "h-64", title = true }) => {
    return (
        <div className="bg-white dark:bg-gray-950/10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            {title && <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-4"></div>}
            <div className={`${height} bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center`}>
                <div className="text-gray-400 dark:text-gray-500">Loading chart...</div>
            </div>
        </div>
    );
};

export const PieChartSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-950/10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-4"></div>
            <div className="flex justify-center">
                <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <div className="mt-6 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const BudgetOverviewSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-950/10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-4"></div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RecentTransactionsSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-950/10 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-4"></div>
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                            </div>
                        </div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};