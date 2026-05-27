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
    chartData
}) {

    return (

        <div
            className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-6
                mt-10
            "
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
                            stroke="#27272a"
                        />

                        <XAxis dataKey="time" />

                        <YAxis />

                        <Tooltip />

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