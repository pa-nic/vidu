const faunadb = require("faunadb")

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  // keepAlive: false
});
const q = faunadb.query;

module.exports = {
  client,
  q
}