import fauna from "./fauna/client";

console.log("Function `getHitsByYear` invoked");

export async function handler(event) {

    // Get hits by year
    const year = Number(event.queryStringParameters.year);
    const query = fauna.fql`hits.byYear(${year}).count()`;
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