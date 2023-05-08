const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    console.log(contacts);
    res.render('contact', {contacts: contacts});
    console.log("Home page attempt")
});



router.get('/create', async (req, res) => {
    res.render('new_contact')
});

router.post('/create', async (req, res) => {
    if (req.session.user !== undefined) {
        console.log("Signed in and creating");
        const fname = req.body.first_name.trim();
        const lname = req.body.last_name.trim();
        const phone = req.body.phone.trim();
        const email = req.body.email.trim();
        const street = req.body.street.trim();
        const city = req.body.city.trim();
        const state = req.body.state.trim();
        const zip = req.body.zip.trim();
        const country = req.body.country.trim();
        const contact_by_phone = req.body.contact_by_phone !== undefined ? 1 : 0;
        const contact_by_email = req.body.contact_by_email !== undefined ? 1 : 0;
        
        await req.db.createContact(fname, lname, phone, email, street, city,  state, zip, country, contact_by_phone, contact_by_email);
    }
    else {
        console.log("Not signed in");
    }
    res.redirect('/');
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.getContactById(id);
    if (!contact) {
        console.log("Contact not found");
        res.redirect('/');
    } 
    res.render('single_contact', {contact: contact});
    
});

router.get('/:id/edit', async (req, res) => {
    if (req.session.user !== undefined) {
        const id = req.params.id;
        const contact = await req.db.getContactById(id);
        res.render('update_contact', {contact: contact, id: id});
    }
    else {
        res.status(401).send("Not Authorized")
    }
});

router.post('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const fname = req.body.first_name.trim();
    const lname = req.body.last_name.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const street = req.body.street.trim();
    const city = req.body.city.trim();
    const state = req.body.state.trim();
    const zip = req.body.zip.trim();
    const country = req.body.country.trim();
    const contact_by_phone = req.body.contact_by_phone !== undefined ? 1 : 0;
    const contact_by_email = req.body.contact_by_email !== undefined ? 1 : 0;

    await req.db.updateContact(fname, lname, phone, email, street, city,  state, zip, country, contact_by_phone, contact_by_email, id);
    res.redirect('/' + id);
});


router.get('/:id/delete', async (req, res) => {
    if (req.session.user !== undefined) {
        const id = req.params.id
        const contact = await req.db.getContactById(id)
        res.render('delete', {contact: contact, id: id})
    }
    else {
        res.status(401).send("Not Authorized")
    }
});

router.post('/:id/delete', async (req, res) => {
    const id = req.params.id
    await req.db.deleteContact(id);
    res.redirect('/');
});

module.exports = router;