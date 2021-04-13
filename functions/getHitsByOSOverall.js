const {q, client} = require("./utils/fauna")

console.log("Function `getHitsByOSOverall` invoked");

exports.handler = async (event, context) => {

  // Get over all hits for each OS

  const query = q.Map(
    q.Paginate(q.Distinct(q.Match(q.Index("os"))), {size:100000}),
    q.Lambda(
      "os",
      q.Merge(
        {os: q.Var("os")},
        {hits: q.Count(q.Match(q.Index("entries_by_os"), q.Var("os")))}
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