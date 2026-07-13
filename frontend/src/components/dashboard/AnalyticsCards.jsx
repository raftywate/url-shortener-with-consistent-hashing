export default function AnalyticsCards({
    cacheData,
    redirectData,
    shardData,
    nodes,
    darkMode
}) {

    const activeNodes =
        nodes.length;

    const hitRate = cacheData.hitRate || 0;

    return (

        <div
            className="
                grid
                grid-cols-2
                xl:grid-cols-4
                gap-6
            "
        >

            <AnalyticsCard
                title="Total Redirects"
                value={
                    redirectData
                        .totalRedirects || 0
                }
                darkMode={darkMode}
            />

            <AnalyticsCard
                title="Cache Hit Rate"
                value={`${hitRate.toFixed(1)}%`}
                darkMode={darkMode}
                isGauge={true}
                hitRate={hitRate}
            />

            <AnalyticsCard
                title="Cache Hits"
                value={
                    cacheData.cacheHits || 0
                }
                darkMode={darkMode}
            />

            <AnalyticsCard
                title="Active Shards"
                value={activeNodes}
                darkMode={darkMode}
            />

        </div>
    );
}

function AnalyticsCard({
    title,
    value,
    darkMode,
    isGauge = false,
    hitRate = 0
}) {

    return (

        <div
            className={`
                border rounded-3xl p-6 min-h-[180px] flex flex-col justify-between overflow-hidden transition-colors duration-300
                ${darkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900 shadow-md"}
            `}
        >

            <p className={`${darkMode ? "text-gray-400" : "text-zinc-500"} text-sm`}>
                {title}
            </p>

            <div className="flex items-center justify-between gap-2 mt-2 w-full">
                <h2
                    className="
                        font-bold
                        leading-none
                        whitespace-nowrap
                        text-3xl
                        sm:text-4xl
                    "
                >
                    {value}
                </h2>
                
                {isGauge && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className={darkMode ? "text-zinc-800" : "text-zinc-200"}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className={`${
                                    hitRate >= 70 ? "text-emerald-500" :
                                    hitRate >= 40 ? "text-amber-500" : "text-rose-500"
                                } transition-all duration-1000 ease-out`}
                                stroke="currentColor"
                                strokeDasharray={`${hitRate}, 100`}
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}