var Pool = require('pg-pool')

const config = {
  user: 'root',
  password: 'test123',
  host: 'localhost',
  port: 5432,
  database: 'sdc'
};

const pool = new Pool(config)

pool.on('connect', (client) => {
  console.log('Connected to DB')
})

pool.on('error', (err, client) => {
  console.error('Error connecting to DB', err);
});

// module.exports.query = (text, values, callback) => {
//   console.log('query:', text, values)
//   return pool.query(text, values, (err, results) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, results);
//     }
//     // pool.end(() => {
//     //   console.log('pool has ended')
//     // })
//   })
// }

module.exports.query = (text, values) => {
  console.log('query:', text, values)
  return pool.query(text, values)
}

//.env
//PGDATABASE=my_db
// PGUSER=username
// PGPASSWORD="my awesome password"
// PGPORT=5432