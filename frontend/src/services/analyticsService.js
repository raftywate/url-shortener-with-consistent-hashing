import axios from "axios";

const BASE_URL =
    "http://localhost:8080";

export async function getCacheAnalytics() {

    const response =
        await axios.get(
            `${BASE_URL}/analytics/analytics/cache`
        );

    return response.data;
}

export async function getRedirectAnalytics() {

    const response =
        await axios.get(
            `${BASE_URL}/analytics/analytics/redirects`
        );

    return response.data;
}

export async function getShardAnalytics() {

    const response =
        await axios.get(
            `${BASE_URL}/analytics/analytics/shards`
        );

    return response.data;
}