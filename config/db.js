import pkg from 'pg';
const { Pool } = pkg;


const connection = new Pool({
    host: 'localhost',
    port: 5432, 
    user: 'postgres',
    password: 'password',
    database: 'Node_PostgreSQl_Task'
})

export default connection;