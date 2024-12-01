import fauna from "./fauna/client";

console.log("Function `getHitsByDate` invoked");

export async function handler(event) {

    // Get hits by date
    const query = fauna.fql`hits.byDate(Date.fromString(${event.queryStringParameters.date})).count()`;
    try {
        const response = await fauna.client.query(query);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        };
    }
}