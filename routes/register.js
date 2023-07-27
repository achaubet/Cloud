import express from 'express';
import User from './../models/user.js';

export const routerRegister = express.Router();

routerRegister.get('/', (req, res) => {
    res.render('authentication/register');
});

routerRegister.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    try {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('This user is already registered !');
      }
      const newUser = new User({
        username: username,
        password: password
      });
      await newUser.save();
      console.log(newUser);
      console.log(password);
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
});