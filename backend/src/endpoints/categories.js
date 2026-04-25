const express = require ("express");
const endpoint = express.Router();
const pool = require('../db');

//GET ALL CATEGORIES

endpoint.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM categories ",
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Category does not exists"})
    }
});

// POST Category
endpoint.post('/', async (req, res) => {
  const {categoryname} = req.body || {}

  if (!categoryname) {
    return res.status(400).json({ error: 'categoryname is required' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (categoryname) VALUES ($1) RETURNING *',
      [categoryname]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('DB ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

//DELETE Category
endpoint.delete('/:id', async (req, res) => {
  console.log('req.body:', req.body)  
  const {categoryid} = req.body

  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE categoryid=$1 RETURNING *',
      [categoryid]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    res.status(201).json({message: "category deleted"})
  } catch (err) {
    console.error('DB ERROR:', err)
    res.status(404).json({ error: err.message })
  }
})
module.exports = endpoint;