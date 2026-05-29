import { useState } from "react";

import ShortenCard from "../components/ShortenCard";

import StatsCards from "../components/dashboard/StatsCards";

import HashRing from "../components/dashboard/HashRing";

import NodeControls from "../components/dashboard/NodeControls";

import UrlTable from "../components/dashboard/UrlTable";

import { useEffect } from "react";

import AnalyticsCards
    from "../components/dashboard/AnalyticsCards";
import RedirectChart
    from "../components/dashboard/RedirectChart";

import {
    getCacheAnalytics,
    getRedirectAnalytics,
    getShardAnalytics
} from "../services/analyticsService";

export default function Dashboard() {
    const [chartData, setChartData] =
        useState([]);

    const [cacheData, setCacheData] =
        useState({});

    const [redirectData, setRedirectData] =
        useState({});

    const [shardData, setShardData] =
        useState({});

    const [nodes, setNodes] = useState([
        {
            name: "Node-A",
            angle: 0
        },
        {
            name: "Node-B",
            angle: 90
        },
        {
            name: "Node-C",
            angle: 180
        },
        {
            name: "Node-D",
            angle: 270
        }
    ]);

    useEffect(() => {

        async function loadAnalytics() {

            try {

                const cache =
                    await getCacheAnalytics();

                const redirects =
                    await getRedirectAnalytics();

                const shards =
                    await getShardAnalytics();

                setCacheData(cache);

                setRedirectData(redirects);

                setChartData((prev) => {

                    const next = [

                        ...prev,

                        {
                            time:
                                new Date()
                                    .toLocaleTimeString(),

                            redirects:
                                redirects.totalRedirects
                        }
                    ];

                    if (next.length > 15) {
                        next.shift();
                    }

                    return next;
                });

                setShardData(shards);

            } catch (error) {

                console.error(
                    "Failed to load analytics",
                    error
                );
            }
        }

        loadAnalytics();
        const interval =
            setInterval(
                loadAnalytics,
                3000
            );

        return () =>
            clearInterval(interval);


    }, []);

    return (

        <div className="min-h-screen bg-black text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-5xl font-bold mb-3">
                    Distributed URL Shortener
                </h1>

                <p className="text-gray-400 text-lg mb-10">
                    Consistent Hashing + Redis + Sharding
                </p>

                <AnalyticsCards
                    cacheData={cacheData}
                    redirectData={redirectData}
                    shardData={shardData}
                    nodes={nodes}
                />

                <div className="mt-10">
                    <ShortenCard />
                </div>


                <div className="mt-10">

                    <NodeControls
                        nodes={nodes}
                        setNodes={setNodes}
                    />

                </div>

                <div className="mt-10">

                    <HashRing
                        nodes={nodes}
                    />

                    <RedirectChart
                        chartData={chartData}
                    />

                </div>
                
                {/* <div className="mt-10">
                    <UrlTable />
                </div> */}

            </div>

        </div>
    );
}