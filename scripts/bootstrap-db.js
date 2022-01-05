/* idempotent operation to bootstrap database */
const faunadb = require("faunadb");
const chalk = require("chalk");

const q = faunadb.query;

/*  */
function setupFaunaDB() {
  console.log(chalk.yellow("Attempting to create the DB schemas..."));

  let key = checkForFaunaKey();

  const client = new faunadb.Client({
    secret: key
  });

  /* Based on your requirements, change the schema here */
  return client
    .query(
      q.CreateCollection({
        name: "hits"
      })
    )
    .then(() =>
      client.query(
        q.Do(
          q.CreateIndex({
            name: "urls",
            source: q.Collection("hits"),
            values: [
              {
                field: ["data", "url"]
              }
            ]
          }),
          q.CreateIndex({
            name: "id_by_ref",
            source: q.Collection("hits"),
            terms: [
              {
                field: ["ref"]
              }
            ],
            values: [
              {
                field: ["data", "id"]
              }
            ]
          }),
          q.CreateIndex({
            name: "browsers",
            source: q.Collection("hits"),
            values: [
              {
                field: ["data", "browser_name"]
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_url",
            source: q.Collection("hits"),
            terms: [
              {
                field: ["data", "url"]
              }
            ],
            values: [
              {
                field: ["data", "url"]
              },
              {
                field: ["data", "time"]
              },
              {
                field: ["ref"]
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_language",
            source: q.Collection("hits"),
            terms: [
              {
                field: ["data", "language"]
              }
            ],
            values: [
              {
                field: ["data", "language"]
              },
              {
                field: ["data", "time"]
              },
              {
                field: ["ref"]
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_browser",
            source: q.Collection("hits"),
            terms: [
              {
                field: ["data", "browser_name"]
              }
            ],
            values: [
              {
                field: ["data", "browser_name"]
              },
              {
                field: ["data", "time"]
              },
              {
                field: ["ref"]
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_year_and_month",
            source: [
              {
                collection: q.Collection("hits"),
                fields: {
                  year: q.Query(
                    q.Lambda("entry", q.Year(q.Select(["data", "time"], q.Var("entry"))))
                  ),
                  month: q.Query(
                    q.Lambda("entry", q.Month(q.Select(["data", "time"], q.Var("entry"))))
                  )
                }
              }
            ],
            terms: [
              {
                binding: "year"
              },
              {
                binding: "month"
              }
            ],
            values: [
              {
                binding: "year"
              },
              {
                binding: "month"
              },
              {
                field: ["ref"]
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_date",
            source: [
              {
                collection: q.Collection("hits"),
                fields: {
                  date: q.Query(
                    q.Lambda("entry", q.ToDate(q.Select(["data", "time"], q.Var("entry"))))
                  )
                }
              }
            ],
            terms: [
              {
                binding: "date"
              }
            ],
            values: [
              {
                binding: "date"
              },
              {
                field: ["ref"]
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_year",
            source: [
              {
                collection: q.Collection("hits"),
                fields: {
                  year: q.Query(
                    q.Lambda("entry", q.Year(q.Select(["data", "time"], q.Var("entry"))))
                  )
                }
              }
            ],
            terms: [
              {
                binding: "year"
              }
            ],
            values: [
              {
                binding: "year"
              },
              {
                field: ["ref"]
              }
            ]
          }),
          q.CreateIndex({
            name: "languages",
            source: q.Collection("hits"),
            values: [
              {
                field: ["data", "language"]
              }
            ]
          }),
          q.CreateIndex({
            name: "os",
            source: [
              {
                collection: q.Collection("hits"),
                fields: {
                  os_version: q.Query(
                    q.Lambda(
                      "entry",
                      q.Concat(
                        [
                          q.Select(["data", "os_name"], q.Var("entry")),
                          q.Select(
                            ["data", "os_versionName"],
                            q.Var("entry"),
                            q.Select(["data", "os_version"], q.Var("entry"))
                          )
                        ],
                        " "
                      )
                    )
                  )
                }
              }
            ],
            terms: [],
            values: [
              {
                binding: "os_version"
              }
            ]
          }),
          q.CreateIndex({
            name: "entries_by_os",
            source: [
              {
                collection: q.Collection("hits"),
                fields: {
                  os_version: q.Query(
                    q.Lambda(
                      "entry",
                      q.Concat(
                        [
                          q.Select(["data", "os_name"], q.Var("entry")),
                          q.Select(
                            ["data", "os_versionName"],
                            q.Var("entry"),
                            q.Select(["data", "os_version"], q.Var("entry"))
                          )
                        ],
                        " "
                      )
                    )
                  )
                }
              }
            ],
            terms: [
              {
                binding: "os_version"
              }
            ],
            values: [
              {
                binding: "os_version"
              },
              {
                field: ["data", "time"]
              },
              {
                field: ["ref"]
              }
            ]
          })
        )
      )
    )
    .catch(e => {
      if (e.message === "instance already exists") {
        console.log("Schemas are already created... skipping");
        process.exit(0);
      } else {
        console.error("There was a problem bootstrapping the db", e);
        throw e;
      }
    });
}

function checkForFaunaKey() {
  if (!process.env.FAUNA_SECRET) {
    console.log(
      chalk.bold.red(
        "Required 'FAUNA_SECRET' environment variable not found."
      )
    );
    console.log(
      chalk.yellow.bold(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~
    You can create a your fauna db server secret by following this:
      - https://docs.fauna.com/fauna/current/tutorials/authentication/user.html#setup-server-key
    
    Then ensure you have added the server secret into your Netlify site as an environment variable 
    with the key 'FAUNA_SECRET'.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `)
    );
    process.exit(1);
  }

  console.log(
    chalk.green(
      `Found FAUNA_SECRET environment variable in Netlify site`
    )
  );
  return process.env.FAUNA_SECRET;
}

setupFaunaDB()
  .then(() => {
    console.log(chalk.green(`Bootstraping DB scheamas was successful!`));
  })
  .catch(err => {
    console.log(
      chalk.red.bold(
        `There was an issue bootstrapping the DB scheamas due to: ${err}`
      )
    );
    process.exit(1);
  });
