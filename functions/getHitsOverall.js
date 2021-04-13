const {q, client} = require("./utils/fauna")

console.log("Function `getHitsOverall` invoked");

exports.handler = async (event, context) => {

  // Get overall hits

  const query = q.Count(q.Documents(q.Collection("hits")));

  try {
    const response = await client.query(query);
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