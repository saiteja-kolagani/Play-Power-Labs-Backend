const express = require('express');
const router = express.Router();
const db = require('../models/database');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, (req, res) => {
    db.all('SELECT * FROM assignments', [], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({assignments: rows});
    });
});

router.post('/', authenticateToken, (req, res) => {
    const {title, description} = req.body;
    const sql = 'INSERT INTO assignments (title, description) VALUES (?, ?)';
    const params = [title, description];
    db.run(sql, params, function(err){
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({id: this.lastID});
    });
});

router.put('/:id', authenticateToken, (req, res) => {
    const {title, description} = req.body;
    const {id} = req.params;
    const sql = 'UPDATE assignments SET title = ?, description = ? WHERE id = ?';
    const params = [title, description, id];
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({message: 'Assignment Updated'})
    });
});

router.delete('/:id', authenticateToken, (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM assignments WHERE id = ?';
    db.run(sql, id, function(err){
        if (err) {
            res.status(500).json({error: err.message});
        }
        res.json({message: 'Assignment Deleted'})
    });
});

module.exports = router;