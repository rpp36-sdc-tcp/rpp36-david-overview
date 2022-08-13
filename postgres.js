var Pool = require('pg-pool')

const config = {
  user: 'root',
  password: 'test123',
  host: 'localhost',
  port: 5432,
  database: 'sdc'
  // ssl: true
};

const pool = new Pool(config)

pool.on('connect', (client) => {
  console.log('Connected to DB')
})

pool.on('error', (err, client) => {
  console.error('Error connecting to DB', err);
});

module.exports.query = (text, values) => {
  console.log('query:', text, values)
  return pool.query(text, values)
}


//.env
//PGDATABASE=my_db
// PGUSER=username
// PGPASSWORD="my awesome password"
// PGPORT=5432