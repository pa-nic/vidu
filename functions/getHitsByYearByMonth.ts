import fauna from "./fauna/client";

console.log("Function `getHitsByYearByMonth` invoked");

export async function handler(event) {

    // Get hits by year and month
    const year = Number(event.queryStringParameters.year);
    const month = Number(event.queryStringParameters.month);
    const query = fauna.fql`hits.byYearByMonth(${year},${month}).count()`;
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