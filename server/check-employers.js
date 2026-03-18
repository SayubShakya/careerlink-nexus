const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkEmployers() {
    try {
        const res = await pool.query('SELECT "companyName", profile_picture FROM employer_users WHERE profile_picture NOT LIKE \'http%\' AND profile_picture IS NOT NULL');
        console.log('Employers Data:');
        console.table(res.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        await pool.end();
    }
}

checkEmployers();
