import { useState } from "react";
import { shortenUrl } from "../services/urlService";

export default function ShortenCard({ onShortenSuccess, onUrlClick, darkMode }) {

    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    async function handleShorten() {

        if (!url.trim()) {
            return;
        }

        try {

            setLoading(true);

            setShortUrl("");
            setShowQr(false);

            const shortCode =
                await shortenUrl(url);

            const generated = `${backendUrl}/r/${shortCode}`;
            setShortUrl(generated);

            if (onShortenSuccess) {
                onShortenSuccess({
                    shortCode,
                    originalUrl: url,
                    createdAt: new Date().toISOString(),
                    clicks: 0
                });
            }

        } catch (error) {

            console.error(error);

            alert("Failed to shorten URL");

        } finally {

            setLoading(false);
        }
    }

    return (

        <div
            className={`
                border rounded-3xl p-8 transition-colors duration-300
                ${darkMode ? "bg-zinc-900 border-zinc-800 text-white shadow-2xl backdrop-blur-lg" : "bg-white border-zinc-200 text-zinc-900 shadow-md"}
            `}
        >

            <h2 className="text-3xl font-bold mb-6">
                Create Short URL
            </h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleShorten();
                }}
                className="
                flex
                flex-col
                sm:flex-row
                gap-4
            "
            >

                <input
                    type="text"
                    placeholder="Enter URL..."
                    value={url}
                    onChange={(e) =>
                        setUrl(e.target.value)
                    }
                    className={`
                        flex-1 rounded-2xl px-5 py-4 outline-none transition-colors duration-300
                        ${darkMode ? "bg-black border border-zinc-700 text-white focus:border-zinc-500" : "bg-zinc-100 border border-zinc-300 text-zinc-900 focus:border-indigo-500"}
                    `}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        font-semibold px-6 py-4 rounded-2xl hover:scale-105 transition w-full sm:w-auto cursor-pointer
                        ${darkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"}
                    `}
                >

                    {
                        loading
                            ? "Creating..."
                            : "Shorten"
                    }

                </button>

            </form>

            {

                shortUrl && (

                    <div
                        className={`
                            mt-6 border rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-300
                            ${darkMode ? "bg-black border-zinc-800" : "bg-zinc-100 border-zinc-200"}
                        `}
                    >

                        <p className={`${darkMode ? "text-gray-400" : "text-zinc-500"} text-sm`}>
                            Generated Short URL
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <a
                                href={shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => onUrlClick && onUrlClick(shortUrl.substring(shortUrl.lastIndexOf('/') + 1))}
                                className="text-blue-500 hover:underline break-all font-semibold"
                            >
                                {shortUrl}
                            </a>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                        copied
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : darkMode
                                                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-750"
                                                : "bg-white hover:bg-zinc-50 text-zinc-750 border border-zinc-200 shadow-sm"
                                    }`}
                                    title="Copy to Clipboard"
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowQr(!showQr)}
                                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                        showQr
                                            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                            : darkMode
                                                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-750"
                                                : "bg-white hover:bg-zinc-50 text-zinc-750 border border-zinc-200 shadow-sm"
                                    }`}
                                    title="Show QR Code"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    QR Code
                                </button>
                            </div>
                        </div>

                        {showQr && (
                            <div className={`mt-3 p-4 rounded-xl flex flex-col items-center justify-center border transition-colors ${darkMode ? "bg-zinc-950 border-zinc-850" : "bg-white border-zinc-200 shadow-inner"}`}>
                                <p className={`text-xs mb-3 font-semibold ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>Scan with your camera to open</p>
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-200">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`}
                                        alt="QR Code"
                                        className="w-36 h-36"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                )
            }

        </div>
    );
}