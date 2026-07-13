export default function UrlTable({ urls = [], onUrlClick, darkMode }) {
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    return (
        <div
            className={`
                border rounded-3xl p-8 overflow-x-auto transition-colors duration-300
                ${darkMode ? "bg-zinc-900 border-zinc-800 text-white shadow-2xl backdrop-blur-lg" : "bg-white border-zinc-200 text-zinc-900 shadow-md"}
            `}
        >
            <h2 className="text-2xl font-bold mb-1">
                Recent URLs
            </h2>
            <p className={`${darkMode ? "text-zinc-500" : "text-zinc-400"} text-xs mb-6`}>
                Session-only history, local to this browser tab.
            </p>

            {urls.length === 0 ? (
                <div className={`${darkMode ? "text-zinc-500" : "text-zinc-400"} text-center py-8 text-sm`}>
                    No shortened URLs in this session yet.
                </div>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className={`text-left border-b ${darkMode ? "text-zinc-400 border-zinc-800" : "text-zinc-500 border-zinc-200"}`}>
                            <th className="pb-4 font-semibold">Short Link</th>
                            <th className="pb-4 font-semibold">Original URL</th>
                            <th className="pb-4 font-semibold">Created</th>
                            <th className="pb-4 font-semibold text-right">Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((url) => {
                            const link = `${backendUrl}/r/${url.shortCode}`;
                            return (
                                <tr
                                    key={url.shortCode}
                                    className={`border-b last:border-0 hover:bg-zinc-800/20 transition-colors ${darkMode ? "border-zinc-800" : "border-zinc-200"}`}
                                >
                                    <td className="py-4 font-semibold text-blue-400 max-w-[150px] truncate">
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => onUrlClick && onUrlClick(url.shortCode)}
                                            className="hover:underline"
                                        >
                                            {url.shortCode}
                                        </a>
                                    </td>
                                    <td className={`py-4 ${darkMode ? "text-zinc-300" : "text-zinc-700"} max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl truncate`} title={url.originalUrl}>
                                        {url.originalUrl}
                                    </td>
                                    <td className={`py-4 text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                        {new Date(url.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                    </td>
                                    <td className="py-4 text-right font-mono text-emerald-400">
                                        {url.clicks || 0}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}