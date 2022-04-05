const db = require("./db");

module.exports = {
  getData: async () => {
    try {
      const result = await db.query(`SELECT * FROM tracker`);
      return result.rows;
    } catch (e) {
      throw Error(`Database query failed: ${e.message}`);
    }
  },

  createNewEntry: async (mood) => {
    try {
      const newEntry = await db.query(
        `INSERT INTO tracker
          (mood)
         VALUES
          ($1)
         RETURNING *;
        `,
        [mood]
      );
      return newEntry.rows[0];
    } catch (e) {
      throw Error(`Database query failed: $e.message`);
    }
  },
};
