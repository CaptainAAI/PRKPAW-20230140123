const path = require('path');
const db = require(path.join(__dirname, '..', 'models'));

(async () => {
  try {
    const sequelize = db.sequelize;
    const qi = sequelize.getQueryInterface();

    console.log('Listing tables:');
    const tables = await qi.showAllTables();
    console.log(tables);

    const tableName = 'Presensis';
    if (tables.includes(tableName) || tables.includes(tableName.toLowerCase())) {
      console.log(`\nDescribing table ${tableName}:`);
      const desc = await qi.describeTable(tableName).catch(e => {
        console.error('describeTable error:', e.message);
        return null;
      });
      console.log(desc);

      // Query information_schema for foreign keys
      const [results] = await sequelize.query(`SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = :db AND TABLE_NAME = :table AND REFERENCED_TABLE_NAME IS NOT NULL`, {
        replacements: { db: sequelize.config.database, table: tableName },
        type: sequelize.QueryTypes.SELECT
      }).catch(e => { console.error('FK query error:', e.message); return []; });

      console.log('\nForeign keys referencing other tables:');
      console.log(results.length ? results : results);
    } else {
      console.log(`\nTable ${tableName} not found in database.`);
    }

    await sequelize.close();
  } catch (err) {
    console.error('Error inspecting DB:', err.message);
    process.exit(1);
  }
})();
