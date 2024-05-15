import lib from 'msgscan-lib'
const sql = lib.sql

async function checkTableExists(schema, tableName) {
  const exists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_schema = ${schema}
      AND    table_name   = ${tableName}
    );
  `
  return exists[0].exists
}

export { checkTableExists }
