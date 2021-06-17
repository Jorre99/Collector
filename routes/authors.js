const express = require('express')
const required = require('express-required-fields')
const author = require('../models/author')
const router = express.Router()
const Author = require('../models/author')

// Get all authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    //use regular expressions to search the authors
    if(req.query.name != null && req.query.name != ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors, 
            searchOptions: req.query})
    }catch{
        res.redirect('/')
    }

})

// add author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new author() })
})

// process add author Route
router.post('/', required(['name']), async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router