import { useState } from "react";
import { shortenUrl } from "../services/urlService";

export default function ShortenCard() {

    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_API_BASE_URL;


    async function handleShorten() {

        if (!url.trim()) {
            return;
        }

        try {

            setLoading(true);

            setShortUrl("");

            const shortCode =
                await shortenUrl(url);

            setShortUrl(
                `${backendUrl}/r/${shortCode}`
            );

        } catch (error) {

            console.error(error);

            alert("Failed to shorten URL");

        } finally {

            setLoading(false);
        }
    }

    return (

        <div
            className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-8
                shadow-2xl
                backdrop-blur-lg
            "
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
                    className="
                        flex-1
                        bg-black
                        border border-zinc-700
                        rounded-2xl
                        px-5 py-4
                        outline-none
                        text-white
                    "
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="
                    bg-white
                    text-black
                    font-semibold
                    px-6
                    py-4
                    rounded-2xl
                    hover:scale-105
                    transition
                    w-full
                    sm:w-auto
                "
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
                        className="
                            mt-6
                            bg-black
                            border border-zinc-800
                            rounded-2xl
                            p-5
                        "
                    >

                        <p className="text-gray-400 mb-2">
                            Generated Short URL
                        </p>

                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                text-blue-400
                                break-all
                            "
                        >
                            {shortUrl}
                        </a>

                    </div>
                )
            }

        </div>
    );
}