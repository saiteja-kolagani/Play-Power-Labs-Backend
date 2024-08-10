const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../db/sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('Error opening database:', err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            }
        });
        
        db.run('CREATE TABLE IF NOT EXISTS assignments (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)', (err) => {
            if (err) {
                console.log('Error creating table:', err.message);
            }
        });
    }
});

module.exports = db;