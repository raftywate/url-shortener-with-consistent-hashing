import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function RedirectChart({
    chartData,
    darkMode
}) {

    return (

        <div
            className={`
                border rounded-3xl p-6 mt-10 transition-colors duration-300
                ${darkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900 shadow-md"}
            `}
        >

            <h2
                className="
                    text-2xl
                    font-bold
                    mb-6
                "
            >
                Redirect Activity
            </h2>

            <div className="h-80">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={chartData}>

                        <CartesianGrid
                            stroke={darkMode ? "#27272a" : "#e4e4e7"}
                        />

                        <XAxis dataKey="time" stroke={darkMode ? "#71717a" : "#a1a1aa"} />

                        <YAxis stroke={darkMode ? "#71717a" : "#a1a1aa"} />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? "#18181b" : "#ffffff",
                                borderColor: darkMode ? "#27272a" : "#e4e4e7",
                                color: darkMode ? "#ffffff" : "#09090b"
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="redirects"
                            stroke="#4ade80"
                            strokeWidth={3}
                            dot={false}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}