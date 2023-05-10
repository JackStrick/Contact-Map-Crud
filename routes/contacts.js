const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });



const getGeo = async (address) => {
    console.log("Checking address: " + address);
    const location = geocoder.geocode(address);
    return location;
}



router.get('/', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    //console.log(contacts);
    res.render('contact', {contacts: contacts});
    console.log("Home page attempt")
});

router.get('/places', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    console.log(contacts);
    res.json({ contacts: contacts });
});



router.get('/create', async (req, res) => {
    console.log("CREATE NEW CONTACT");
    res.render('new_contact')
    
});

router.post('/create', async (req, res) => {
   // if (req.session.user !== undefined)
    console.log("CREATE NEW CONTACT");
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
    const contact_by_mail = req.body.contact_by_mail !== undefined ? 1 : 0;
    const contact_by_phone = req.body.contact_by_phone !== undefined ? 1 : 0;
    const contact_by_email = req.body.contact_by_email !== undefined ? 1 : 0;
    
    //GET LAT LNG
    const address = street + " " + city + " " + state + " " + zip + " " + country;
    const location = await getGeo(address);
    console.log(location);
    
    var lat;
    var lng;
    var new_street;
    var new_city;
    var new_state;
    var new_zip;
    var new_country;
    console.log(location);
    if (location[0])
    {    
        new_street = location[0].streetNumber + " " + location[0].streetName;
        new_city = location[0].city;
        new_state = location[0].state;
        new_zip = location[0].zipcode;
        new_country = location[0].country;
        lat = location[0].latitude;
        lng = location[0].longitude;
        await req.db.createContact(fname, lname, phone, email, new_street, new_city,  new_state, new_zip, new_country, contact_by_mail, contact_by_phone, contact_by_email, lat, lng);
        console.log("NEW CONTACT CREATED");
    }
    else {
        console.log("\n\n\n*********NO LOCATION FOUND***********\n\n\n");
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
    else {
        res.render('single_contact', {contact: contact});
    }
    
    
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
    const contact_by_mail = req.body.contact_by_mail !== undefined ? 1 : 0;
    const contact_by_phone = req.body.contact_by_phone !== undefined ? 1 : 0;
    const contact_by_email = req.body.contact_by_email !== undefined ? 1 : 0;

    //GET LAT LNG
    const address = street + " " + city + " " + state + " " + zip + " " + country;
    const location = await getGeo(address);
    
    var lat;
    var lng;
    var new_street;
    var new_city;
    var new_state;
    var new_zip;
    var new_country;
    console.log(location);
    if (location[0])
    {    
        new_street = location[0].streetNumber + " " + location[0].streetName;
        new_city = location[0].city;
        new_state = location[0].state;
        new_zip = location[0].zipcode;
        new_country = location[0].country;
        lat = location[0].latitude;
        lng = location[0].longitude;
        await req.db.updateContact(fname, lname, phone, email, new_street, new_city,  new_state, new_zip, new_country, contact_by_mail, contact_by_phone, contact_by_email, lat, lng, id);
    }
    else {
        console.log("\n\n\n*********NO LOCATION FOUND***********\n\n\n");
    }

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