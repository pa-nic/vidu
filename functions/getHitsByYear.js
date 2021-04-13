const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByYear` invoked");

exports.handler = async (event, context) => {

  // Get hits for whole year
  // ToDo: Query parm validy check and error handling
  
  const query = q.Count(
    q.Match(q.Index("entries_by_year"),
    q.ToInteger(event.queryStringParameters.year))
  );

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