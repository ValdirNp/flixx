const TMDB_BASE = 'https://api.themoviedb.org/3';

/** Only these TMDB routes are allowed through the proxy. */
function isAllowedPath(path) {
    return /^discover\/movie$/.test(path) || /^movie\/\d+$/.test(path);
}

function extractTmdbPath(eventPath) {
    const cleaned = (eventPath || '')
        .replace(/^\/\.netlify\/functions\/tmdb\/?/, '')
        .replace(/^\/api\/tmdb\/?/, '')
        .replace(/^\//, '');

    return cleaned.split('?')[0];
}

exports.handler = async function handler(event) {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ status_message: 'Method not allowed' }),
        };
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status_message: 'API_KEY is not configured on the server' }),
        };
    }

    const tmdbPath = extractTmdbPath(event.path);
    if (!tmdbPath || !isAllowedPath(tmdbPath)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status_message: 'Invalid or disallowed TMDB path' }),
        };
    }

    const params = new URLSearchParams(event.queryStringParameters || {});
    params.delete('api_key');
    params.set('api_key', apiKey);

    const url = TMDB_BASE + '/' + tmdbPath + '?' + params.toString();

    try {
        const response = await fetch(url);
        const body = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60',
            },
            body,
        };
    } catch (error) {
        return {
            statusCode: 502,
            body: JSON.stringify({
                status_message: 'Failed to reach TMDB',
                error: error.message,
            }),
        };
    }
};
