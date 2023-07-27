import express from 'express';
import Article from './../models/article.js';

export const router = express.Router();


router.get('/new', (req, res) => {
  const currentUser = req.session.currentUser
  res.render('articles/new', { article: new Article(), currentUser })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  const currentUser = req.session.currentUser
  res.render('articles/edit', { article: article, currentUser })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  const currentUser = req.session.currentUser
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article, currentUser })
})

router.post('/', async (req, res, next) => {
  const currentUser = req.session.currentUser
  req.article = new Article({
    author: currentUser._id
  })
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    const currentUser = req.session.currentUser
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    console.log("COUCOU");
    try {
      article = await article.save();
      console.log("OK");
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      console.log("PAS OK");
      console.log(e);
      res.render(`articles/${path}`, { article: article, currentUser: currentUser })
    }
  }
}

