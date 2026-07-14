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

    const [recentUrls, setRecentUrls] = useState([]);
    const [simulatedRedirects, setSimulatedRedirects] = useState(0);

    const [darkMode, setDarkMode] = useState(() => {
        const stored = sessionStorage.getItem("darkMode");
        return stored !== "false"; // default to dark theme
    });

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            sessionStorage.setItem("darkMode", !prev);
            return !prev;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setSimulatedRedirects(prev => prev + Math.floor(Math.random() * 2) + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const stored = JSON.parse(sessionStorage.getItem("myShortenedUrls") || "[]");
        setRecentUrls(stored);
    }, []);

    const handleShortenSuccess = (newUrl) => {
        setRecentUrls((prev) => {
            const updated = [newUrl, ...prev.filter(item => item.shortCode !== newUrl.shortCode)].slice(0, 10);
            sessionStorage.setItem("myShortenedUrls", JSON.stringify(updated));
            return updated;
        });
    };

    const handleUrlClick = (shortCode) => {
        setRecentUrls((prev) => {
            const updated = prev.map(item => {
                if (item.shortCode === shortCode) {
                    return { ...item, clicks: (item.clicks || 0) + 1 };
                }
                return item;
            });
            sessionStorage.setItem("myShortenedUrls", JSON.stringify(updated));
            return updated;
        });
    };

    const [nodes, setNodes] = useState([
        {
            name: "Node-A",
            angle: 0,
            failed: false
        },
        {
            name: "Node-B",
            angle: 90,
            failed: false
        },
        {
            name: "Node-C",
            angle: 180,
            failed: false
        },
        {
            name: "Node-D",
            angle: 270,
            failed: false
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

                const currentTotalRedirects = (redirects.totalRedirects || 0) + simulatedRedirects;

                setCacheData(cache);

                setRedirectData({
                    ...redirects,
                    totalRedirects: currentTotalRedirects
                });

                setChartData((prev) => {
                    if (prev.length === 0) {
                        const baseVal = currentTotalRedirects;
                        const points = [];
                        const now = new Date();
                        for (let i = 14; i >= 0; i--) {
                            const pointTime = new Date(now.getTime() - i * 3000);
                            const jitter = Math.round(i * (1.2 + Math.random() * 1.8));
                            points.push({
                                time: pointTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                                redirects: Math.max(0, baseVal - jitter)
                            });
                        }
                        return points;
                    }

                    const next = [

                        ...prev,

                        {
                            time:
                                new Date()
                                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),

                            redirects:
                                currentTotalRedirects
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

        <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${darkMode ? "bg-black text-white" : "bg-zinc-50 text-zinc-900"}`}>

            <div
                className="
                max-w-screen-2xl
                mx-auto
                px-4
                md:px-6
                py-6
                md:py-10
            "
            >

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-1">
                            Distributed URL Shortener
                        </h1>
                        <p className={`text-base md:text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Consistent Hashing + Redis + Sharding
                        </p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-3 rounded-full border transition-colors ${darkMode ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-yellow-400" : "bg-white border-zinc-200 hover:bg-zinc-100 text-indigo-600 shadow-md"}`}
                        aria-label="Toggle Theme"
                        title="Toggle Light/Dark Theme"
                    >
                        {darkMode ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Top Section */}

                <div
                    className="
        grid
        grid-cols-1
        xl:grid-cols-5
        gap-8
        mb-10
    "
                >

                    <div className="xl:col-span-2">
                        <ShortenCard onShortenSuccess={handleShortenSuccess} onUrlClick={handleUrlClick} darkMode={darkMode} />
                    </div>

                    <div className="xl:col-span-3">
                        <AnalyticsCards
                            cacheData={cacheData}
                            redirectData={redirectData}
                            shardData={shardData}
                            nodes={nodes}
                            darkMode={darkMode}
                        />
                    </div>

                </div>

                {/* Recent URLs Section */}
                <div className="mb-10">
                    <UrlTable urls={recentUrls} onUrlClick={handleUrlClick} darkMode={darkMode} />
                </div>

                {/* Hash Ring */}

                <div className="mb-10">

                    <HashRing
                        nodes={nodes}
                        setNodes={setNodes}
                        liveUrls={recentUrls}
                        darkMode={darkMode}
                    />

                </div>

                {/* Redirect Chart */}

                <div className="mb-10">

                    <RedirectChart
                        chartData={chartData}
                        darkMode={darkMode}
                    />

                </div>

            </div>

        </div>

    );
}