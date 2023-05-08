const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


router.get('/logout', async(req, res) => {
    req.session.user = undefined;
    res.redirect('/login')
})

router.get('/login', async (req, res) =>  {
    res.render('login', {hide_login: true});
});

router.post('/login', async (req, res) => {
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const user = await req.db.findUserByUsername(username);

    if (user && await req.db.passwordAuthentication(p1, user.password)){
    //if (user && bcrypt.compareSync(p1, user.password)){
        req.session.user = user;
        res.redirect('/');
        return;
    } else {
        res.render('login', {hide_login: true, message: 'Could not authenticate'});
        return;
    }
});

router.get('/signup',  async (req, res) => {
    res.render('signup', {hide_login: true});
});

router.post('/signup', async (req, res) => {
    const fname = req.body.firstname.trim();
    const lname = req.body.lastname.trim();
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();
    if (p1 != p2) {
        res.render('signup', {hide_login: true, message: "Passwords don't match"});
        return;
    }
    const user = await req.db.findUserByUsername(username);
    if (user) {
        res.render('signup', {hide_login: true, message: "Username already in use"});
        return;
    }

    const id = await req.db.createUser(fname, lname, username, p1);
    req.session.user = await req.db.findUserById(id);
    res.redirect('/login');
});

module.exports = router;