const express = require ("express");
const endpoint = express.Router();
const pool = require('../db');

//GET ALL CATEGORIES

endpoint.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Categories ",
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Category does not exists"})
    }
});

// POST Category
endpoint.post('/', async (req, res) => {
  const {categoryName} = req.body || {}

    if (!categoryName) {
      return res.status(400).json({ error: 'categoryName is required' })
    }

    try {
      const result = await pool.query(
        'INSERT INTO Categories (categoryName) VALUES ($1) RETURNING *',
        [categoryName]
      )
      res.status(201).json(result.rows[0])
    } catch (err) {
      console.error('DB ERROR:', err)
      res.status(500).json({ error: err.message })
    }
})

// PUT Category
endpoint.put('/:id', async (req, res) => {
  const {id} = req.params
  const {categoryName} = req.body || {}

  if (!categoryName) {
    return res.status(400).json({ error: 'categoryName is required' })
  }

  try {
    const result = await pool.query(
      'UPDATE Categories SET categoryName = $1 WHERE categoryID = $2 RETURNING *',
      [categoryName, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('DB ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})


//DELETE Category
endpoint.delete('/:id', async (req, res) => {
  console.log('req.body:', req.body)  
  const {categoryID} = req.body

  try {
    const result = await pool.query(
      'DELETE FROM Categories WHERE categoryID=$1 RETURNING *',
      [categoryID]
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