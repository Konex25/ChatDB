const getPostgresDDL = async (connection) => {
  const pool = connection.pool;

  const query = `
    SELECT
      table_name,
      table_type
    FROM
      information_schema.tables
    WHERE
      table_schema = 'public'
  `;

  let allTables;

  allTables = (await pool.query(query)).rows;

  const ddls = [];

  for (const table of allTables) {
    const columns = [];

    const columnsQuery = `
      SELECT
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM
        information_schema.columns
      WHERE
        table_name = '${table.table_name}'
    `;

    const columnsResult = (await pool.query(columnsQuery)).rows;

    for (const column of columnsResult) {
      const columnStr = [
        column.column_name,
        column.data_type,
        column.character_maximum_length ? `(${column.character_maximum_length})` : '',
        column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL',
        column.column_default ? `DEFAULT ${column.column_default}` : '',
      ].join(' ');

      columns.push(columnStr);
    }

    const ddlStr = [
      `CREATE TABLE ${table.table_name} (`,
      columns.join(',\n'),
      ');',
    ].join('\n');

    ddls.push(ddlStr);
  }

  return ddls.join('\n\n');
};

module.exports = getPostgresDDL;
