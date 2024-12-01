import fauna from "./fauna/client";

console.log("Function `getHitsOverall` invoked");

export async function handler() {

    // Get overall hits
    const query = fauna.fql`hits.all().count()`;
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