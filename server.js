import express, { urlencoded } from 'express';
import session from 'express-session';
import { connect } from 'mongoose';
import { find } from './models/article.js';
import { router } from './routes/articles.js';
import { routerLogin } from './routes/login.js';
import methodOverride from 'method-override';
import { routerRegister } from './routes/register.js';
import { routerLogout } from './routes/logout.js';
import { routerProfile } from './routes/profile.js';
const bdd = 'mongodb://localhost/blog'; // Set your MongoDB Server URL here

const app = express()
const port = process.env.PORT || 3000;

connect(bdd, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))

app.use(session({
  secret: 'ZXE9DLqurIkZTmbhkBld',
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs')
app.use(urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await find();
  const currentUser = req.session.currentUser
  res.render('articles/index', { articles: articles, currentUser: currentUser })
})

app.use('/articles', router)
app.use('/login', routerLogin)
app.use('/logout', routerLogout)
app.use('/register', routerRegister)
app.use('/profile', routerProfile)

app.listen(port, () => console.log(`Server started on port ${port}`));
