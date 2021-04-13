const {q, client} = require("./utils/fauna")

console.log("Function `getHitsXDaysAgo` invoked");

exports.handler = async (event, context) => {

  // Get hits "x" days ago if query parm "days" is provided
  // ToDo: Query parm validy check and error handling
  
  const query = q.Count(
      q.Match(q.Index("entries_by_date"), q.TimeSubtract(
        q.ToDate(q.Now()),
        q.ToInteger(event.queryStringParameters.days),
        "days"))
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