import axios from "axios";

const BASE_URL = "http://localhost:8080";

export async function shortenUrl(url) {

    const response = await axios.post(
        `${BASE_URL}/shorten`,
        {
            url: url
        }
    );

    return response.data;
}