// This script creates the necessary database tables
require('dotenv').config();
const { createTables } = require('../src/lib/db/schema');

async function main() {
  try {
    console.log('Creating database tables...');
    await createTables();
    console.log('Database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating database tables:', error);
    process.exit(1);
  }
}

main(); 