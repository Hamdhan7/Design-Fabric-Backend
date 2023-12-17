


const mysql = require('mysql2');

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USERNAME:', process.env.DB_USERNAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_DBNAME:', process.env.DB_DBNAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,        // Your MySQL username
    password: process.env.DB_PASSWORD, // Your MySQL password
    database: process.env.DB_DBNAME, // Your database name
    port: process.env.DB_PORT
});

// const connection = mysql.createConnection({
//     host: 'sql.freedb.tech',
//     user: '0x2owp307d21wry57zur',        // Your MySQL username
//     password: 'pscale_pw_T0ZABkn2kuEQ70HefDsYPlzWSfm8FfoMr3OF6TkFFOe', // Your MySQL password
//     database: 'DesignFabric', // Your database name
// });

// const connection = mysql.createConnection(process.env.DATABASE_URL)

// const connection = async () => {
//     try {
//       const dbConnection = await mysql.createConnection({
//         uri: process.env.DATABASE_URL,
//         namedPlaceholders: true, // Important for using named placeholders
//       });
  
//       console.log('Connected to MySQL database');
//       return dbConnection;
//     } catch (err) {
//       console.error('Error connecting to MySQL:', err);
//       throw err;
//     }
//   };

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = connection;
