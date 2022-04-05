const { Pool } = require("pg");
const types = require("pg").types;
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432",
  ssl: process.env.DATABASE_URL
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  end: () => {
    pool.end();
  },
};
