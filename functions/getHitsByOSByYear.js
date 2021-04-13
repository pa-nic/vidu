const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByOSByYear` invoked");

exports.handler = async (event, context) => {

  // Get hits for each os by year

  const query = q.Map(
    q.Paginate(q.Distinct(q.Match(q.Index("os"))), {size:100000}),
    q.Lambda(
      "os",
      q.Merge(
        {os: q.Var("os")},
        {hits: q.Count(
          q.Range(
            q.Match(q.Index("entries_by_os"), q.Var("os")),
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