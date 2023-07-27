import express from 'express';
import User from './../models/user.js';
export const routerLogin = express.Router();

routerLogin.get('/', (req, res) => {
    res.render('authentication/login');
});

routerLogin.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        req.session.currentUser = {
            _id: user._id,
            username:  user.username,
            profilePictureUrl: user.profilePictureUrl
        };
        console.log(req.session.currentUser);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
    }
});