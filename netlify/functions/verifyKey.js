export async function handler(event) {
    try {
        const { key } = JSON.parse(event.body);
        const validKey = process.env.DEV_KEY;

        return {
            statusCode: 200,
            body: JSON.stringify({ valid: key === validKey }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
