const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByBrowserByYear` invoked");

exports.handler = async (event, context) => {

  // Get hits for each browser by year

  const query = q.Map(
    q.Paginate(q.Distinct(q.Match(q.Index("browsers"))), {size:100000}),
    q.Lambda(
      "browser",
      q.Merge(
        {browser: q.Var("browser")},
        {hits: q.Count(
          q.Range(
            q.Match(q.Index("entries_by_browser"), q.Var("browser")),
            ["","",q.Date(q.Concat([event.queryStringParameters.year, "-01-01"]))],
            q.Date(q.Concat([event.queryStringParameters.year, "-12-31"]))
          )
        )}
      )
    )
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