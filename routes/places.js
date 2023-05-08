const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });


router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json({ places: places });
});

router.put('/', async (req, res) => {
    const location = await geocoder.geocode(req.body.address);
    console.log(location);
    if (location[0]){
        
        const address = location[0].formattedAddress;
        const lat = location[0].latitude;
        const lng = location[0].longitude;
        const id = await req.db.createPlace(req.body.label, address, lat, lng);
        res.json({ 
            id: id, 
            label: req.body.label, 
            address: address, 
            lat: lat, 
            lng: lng 
        });
    }
    
});

router.delete('/:id', async (req, res) => {
    await req.db.deletePlace(req.params.id);
    res.status(200).send();
})

module.exports = router;