const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByDateUnique` invoked");

exports.handler = async (event, context) => {

  let query;

  // Get unique hits by date if query parm "date" is provided
  // ToDo: Query parm validy check and error handling
  
  if (event.queryStringParameters.date) {
    query = q.Count(
      q.Join(
        q.Match(q.Index("entries_by_date"), q.ToDate(event.queryStringParameters.date)),
        q.Lambda(
          ["date", "ref"],
          q.Match(q.Index("id_by_ref"), q.Var("ref"))
        )
      )
    )
  } 
  // If no query parm provided, get todays unique hits
  else {
    query = q.Count(
      q.Join(
        q.Match(q.Index("entries_by_date"), q.ToDate(q.Now())),
        q.Lambda(
          ["date", "ref"],
          q.Match(q.Index("id_by_ref"), q.Var("ref"))
        )
      )
    )
  }

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