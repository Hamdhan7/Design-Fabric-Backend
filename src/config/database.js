


const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_hamdhan',        // Your MySQL username
    password: '$4$yY%CcKSA8jN#', // Your MySQL password
    database: 'freedb_DesignFabric', // Your database name
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
