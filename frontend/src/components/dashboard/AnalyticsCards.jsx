export default function AnalyticsCards({
    cacheData,
    redirectData,
    shardData,
    nodes
}) {

    const activeNodes =
        nodes.length;

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
            />

            <AnalyticsCard
                title="Cache Hit Rate"
                value={`${cacheData.hitRate
                    ?.toFixed(1) || 0
                    }%`}
            />

            <AnalyticsCard
                title="Cache Hits"
                value={
                    cacheData.cacheHits || 0
                }
            />

            <AnalyticsCard
                title="Active Shards"
                value={activeNodes}
            />

        </div>
    );
}

function AnalyticsCard({
    title,
    value
}) {

    return (

        <div
            className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-8
                min-h-[180px]
                flex
                flex-col
                justify-between
                overflow-hidden
            "
        >

            <p className="text-gray-400">
                {title}
            </p>

            <h2
                className="
                    font-bold
                    leading-none
                    whitespace-nowrap
                    overflow-hidden
                    text-ellipsis
                    text-[clamp(2rem,4vw,4rem)]
                "
            >
                {value}
            </h2>
        </div>
    );
}