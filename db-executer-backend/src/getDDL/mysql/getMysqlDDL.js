const getMysqlDDL = async (connection) => {
  const conn = connection.conn;

  const query = `
    SELECT
      TABLE_NAME
    FROM
      INFORMATION_SCHEMA.TABLES
    WHERE
      TABLE_SCHEMA = '${conn.config.database}'
  `;

  let allTables;

  allTables = (await conn.query(query))[0];

  const ddls = [];

  for (const table of allTables) {
    const ddlQuery = `
      SHOW CREATE TABLE ${table.TABLE_NAME}
    `;

    const ddl = (await conn.query(ddlQuery))[0][0]['Create Table'];

    ddls.push(ddl);
  }

  return ddls.join('\n\n');
};

module.exports = getMysqlDDL;
