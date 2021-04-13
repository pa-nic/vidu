const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByYearByMonth` invoked");

exports.handler = async (event, context) => {

  // Get hits "x" months ago if query parm "month" is provided
  // ToDo: Query parm validy check and error handling

  const query = q.Count(
    q.Match(q.Index("entries_by_year_and_month"),
    q.ToInteger(event.queryStringParameters.year),
    q.ToInteger(event.queryStringParameters.month))
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