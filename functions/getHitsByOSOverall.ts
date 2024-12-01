import fauna from "./fauna/client";

console.log("Function `getHitsByOSOverall` invoked");

export async function handler() {

    // Get hits by OS overall sorted by hits and limited to top 10
    // TODO: Do it in one "fold()"
    const query = fauna.fql`Object.entries(hits.all().fold({}, (accumulator, value) => {
        let count = (accumulator[value.os] ?? 0) + 1
        let override = Object.fromEntries([[value.os, count]])
        Object.assign(accumulator, override)})).fold([], (acc, elm) => {
            let obj = Object.fromEntries([['os', elm.first()], ["hits", elm.last()]])
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