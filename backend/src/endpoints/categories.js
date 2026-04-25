const express = require('express')
const pool = require('../db.js')

const router = express.Router()


// POST Category
router.post('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
module.exports = router