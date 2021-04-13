const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByUrlByYear` invoked");

exports.handler = async (event, context) => {

  // Get hits for each url by year

  const query = q.Map(
    q.Paginate(q.Distinct(q.Match(q.Index("urls"))), {size:100000}),
    q.Lambda(
      "url",
      q.Merge(
        {url: q.Var("url")},
        {hits: q.Count(
          q.Range(
            q.Match(q.Index("entries_by_url"), q.Var("url")),
            ["","",q.Date(event.queryStringParameters.year + "-01-01")],
            q.Date(event.queryStringParameters.year + "-12-31")
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