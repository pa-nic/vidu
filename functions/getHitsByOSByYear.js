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
            [q.Var("os"), q.Time(q.Concat([event.queryStringParameters.year, "-01-01T00:00:00Z"]))],
            [q.Var("os"), q.Time(q.Concat([event.queryStringParameters.year, "-12-31T00:00:00Z"]))]
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