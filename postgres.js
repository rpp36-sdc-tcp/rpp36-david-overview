const login = process.env;
var Pool = require('pg-pool')


const config = {
  user: login.user,
  password: login.pass,
  host: 'localhost',
  port: 5432,
  database: 'sdc'
};

const pool = new Pool(config)

pool.on('connect', (client) => {
})

pool.on('error', (err, client) => {
  console.error('Error connecting to DB', err);
});


module.exports.query = (text, values) => {
  return pool.query(text, values)
}
