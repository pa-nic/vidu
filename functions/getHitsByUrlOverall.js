const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByUrlOverall` invoked");

exports.handler = async (event, context) => {

  // Get over all hits for each url

  const query = q.Map(
    q.Paginate(q.Distinct(q.Match(q.Index("urls"))), {size:100000}),
    q.Lambda(
      "url",
      q.Merge(
        {url: q.Var("url")},
        {hits: q.Count(q.Match(q.Index("entries_by_url"), q.Var("url")))}
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