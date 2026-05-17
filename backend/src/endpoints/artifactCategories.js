const express = require ("express");
const endpoint = express.Router();
const pool = require('../db');


endpoint.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT c.categoryid, c.categoryname, ac.artifactid FROM categories c LEFT JOIN artifactcategories ac ON c.categoryid = ac.categoryid AND ac.artifactid = $1 ORDER BY c.categoryid;', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

endpoint.post('/', async (req,res) => {
    const {categoryId, artifactId} = req.body

    try{
        const result = await pool.query('INSERT INTO artifactcategories (artifactid,categoryid) VALUES ($1,$2)',[artifactId,categoryId]);

        res.status(201).json({
            message: "Artifact Successfully Categorized",
        });

    } catch (err) {
        console.error('DB ERROR:', err)
        res.status(500).json({ error: err.message })
    }
});

endpoint.delete('/', async (req,res) => {
    const {categoryId, artifactId} = req.body

    try{
        const result = await pool.query('DELETE FROM artifactcategories WHERE artifactId = $1 AND categoryId = $2',[artifactId,categoryId]);

        res.status(201).json({
            message: "Artifact Successfully Uncategorized",
        });

    } catch (err) {
        console.error('DB ERROR:', err)
        res.status(500).json({ error: err.message })
    }

});



//endpoint.post()


module.exports = endpoint;
