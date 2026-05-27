const urls = [
    {
        short: "abc123",
        original: "https://google.com",
        clicks: 248,
        node: "Node-A"
    },
    {
        short: "xyz789",
        original: "https://github.com",
        clicks: 132,
        node: "Node-B"
    },
    {
        short: "qwe456",
        original: "https://openai.com",
        clicks: 981,
        node: "Node-C"
    }
];

export default function UrlTable() {

    return (

        <div
            className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-6
                overflow-x-auto
            "
        >

            <h2 className="text-2xl font-bold mb-6">
                URL Distribution
            </h2>

            <table className="w-full">

                <thead>

                    <tr className="text-left text-gray-400 border-b border-zinc-800">

                        <th className="pb-4">Short URL</th>
                        <th className="pb-4">Original URL</th>
                        <th className="pb-4">Clicks</th>
                        <th className="pb-4">Assigned Node</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        urls.map((url) => (

                            <tr
                                key={url.short}
                                className="border-b border-zinc-800"
                            >

                                <td className="py-4 font-semibold">
                                    {url.short}
                                </td>

                                <td className="py-4 text-gray-300">
                                    {url.original}
                                </td>

                                <td className="py-4">
                                    {url.clicks}
                                </td>

                                <td className="py-4 text-green-400">
                                    {url.node}
                                </td>

                            </tr>
                        ))
                    }

                </tbody>

            </table>

        </div>
    );
}