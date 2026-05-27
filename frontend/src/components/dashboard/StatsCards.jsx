import { useEffect, useState } from "react";

import {
    getCacheAnalytics,
    getRedirectAnalytics,
    getShardAnalytics
} from "../../services/analyticsService";

export default function StatsCards() {

    const [stats, setStats] =
        useState(null);

    useEffect(() => {

        async function loadStats() {

            try {

                const cacheData =
                    await getCacheAnalytics();

                const redirectData =
                    await getRedirectAnalytics();

                const shardData =
                    await getShardAnalytics();

                const activeNodes =
                    Object.keys(shardData).length;

                const totalUrls =
                    Object.values(shardData)
                        .reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        );

                setStats({
                    totalUrls,
                    totalClicks:
                        redirectData.totalRedirects,
                    hitRate:
                        cacheData.hitRate.toFixed(2),
                    activeNodes
                });

            } catch (error) {

                console.error(
                    "Failed to load analytics",
                    error
                );
            }
        }

        loadStats();

    }, []);

    if (!stats) {

        return (

            <div className="text-gray-400">
                Loading analytics...
            </div>
        );
    }

    const cards = [
        {
            title: "Total URLs",
            value: stats.totalUrls
        },
        {
            title: "Total Redirects",
            value: stats.totalClicks
        },
        {
            title: "Cache Hit Rate",
            value: `${stats.hitRate}%`
        },
        {
            title: "Active Nodes",
            value: stats.activeNodes
        }
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {

                cards.map((card) => (

                    <div
                        key={card.title}
                        className="
                            bg-zinc-900
                            border border-zinc-800
                            rounded-3xl
                            p-6
                            shadow-xl
                        "
                    >

                        <p className="text-gray-400 text-sm mb-3">
                            {card.title}
                        </p>

                        <h2 className="text-4xl font-bold">
                            {card.value}
                        </h2>

                    </div>
                ))
            }

        </div>
    );
}