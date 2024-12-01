import fauna from "./fauna/client";

console.log("Function `getHitsByUrlByYear` invoked");

export async function handler(event) {

    // Get hits by URL by year sorted by hits and limited to top 10
    // TODO: Do it in one "fold()"
    const query = fauna.fql`Object.entries(hits.byYear(Date.fromString(${event.queryStringParameters.date}).year).fold({}, (accumulator, value) => {
        let count = (accumulator[value.url] ?? 0) + 1
        let override = Object.fromEntries([[value.url, count]])
        Object.assign(accumulator, override)})).fold([], (acc, elm) => {
            let obj = Object.fromEntries([['url', elm.first()], ["hits", elm.last()]])
            acc.append(obj)
    }).order(desc(.hits)).take(10)`;

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