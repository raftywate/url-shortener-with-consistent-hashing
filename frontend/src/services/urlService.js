import axios from "axios";

const BASE_URL =  import.meta.env.VITE_API_BASE_URL;

export async function shortenUrl(url) {

    const response = await axios.post(
        `${BASE_URL}/shorten`,
        {
            url: url
        }
    );

    return response.data;
}