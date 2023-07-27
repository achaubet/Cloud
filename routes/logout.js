import express from 'express';
export const routerLogout = express.Router();

routerLogout.post('/', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});