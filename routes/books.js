const express = require('express')
const required = require('express-required-fields')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)

// should use img MimeTypes check, not yet implemented 
// const imageMimeTypes = ['images/jpeg', 'images/png', 'image/gif']
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, uploadPath)
    
    },
    filename: (req, file, cb) => {
        console.log("The file: " + file.originalname)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

// Get all books Route
router.get('/', async (req, res) => {
    res.send('All Books')
})

// add book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())

})

// process add book Route
router.post('/', upload.single('cover'), async (req, res) => {
    //uploadfile check -> multer
    const fileName = req.file.filename != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try{
        const newBook = await book.save()
        res.redirect(`books`)
        // res.redirect(`books/${newBook.id}`)
    }catch{
        console.log("the book can't be saved")
        renderNewPage(res, book, true)
    }
})

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'error Creating book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

module.exports = router