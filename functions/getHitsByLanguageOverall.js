const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByLanguageOverall` invoked");

exports.handler = async (event, context) => {

  // Get over all hits for each language

  const query = q.Map(
    q.Paginate(q.Distinct(q.Match(q.Index("languages"))), {size:100000}),
    q.Lambda(
      "language",
      q.Merge(
        {language: q.Var("language")},
        {hits: q.Count(q.Match(q.Index("entries_by_language"), q.Var("language")))}
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