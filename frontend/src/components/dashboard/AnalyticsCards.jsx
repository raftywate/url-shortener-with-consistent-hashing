export default function AnalyticsCards({
    cacheData,
    redirectData,
    shardData,
    nodes
}) {

    const totalShards =
        Object.keys(shardData).length;
    const activeNodes =
        nodes.length;

    return (

        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-4
                gap-6
                mb-10
            "
        >

            <div
                className="
                    bg-zinc-900
                    border border-zinc-800
                    rounded-3xl
                    p-6
                "
            >

                <p className="text-gray-400 mb-3">
                    Total Redirects
                </p>

                <h2 className="text-5xl font-bold">
                    {
                        redirectData
                            .totalRedirects || 0
                    }
                </h2>

            </div>

            <div
                className="
                    bg-zinc-900
                    border border-zinc-800
                    rounded-3xl
                    p-6
                "
            >

                <p className="text-gray-400 mb-3">
                    Cache Hit Rate
                </p>

                <h2 className="text-5xl font-bold">
                    {
                        cacheData.hitRate
                            ?.toFixed(1) || 0
                    }%
                </h2>

            </div>

            <div
                className="
                    bg-zinc-900
                    border border-zinc-800
                    rounded-3xl
                    p-6
                "
            >

                <p className="text-gray-400 mb-3">
                    Cache Hits
                </p>

                <h2 className="text-5xl font-bold">
                    {
                        cacheData.cacheHits || 0
                    }
                </h2>

            </div>

            <div
                className="
                    bg-zinc-900
                    border border-zinc-800
                    rounded-3xl
                    p-6
                "
            >

                <p className="text-gray-400 mb-3">
                    Active Shards
                </p>

                <h2 className="text-5xl font-bold">
                    {activeNodes}
                </h2>

            </div>

        </div>
    );
}