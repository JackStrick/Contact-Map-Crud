
var markers = [];
var map;


const loadMap = async () => {
    const response = await axios.get('/places');
    console.log("\n\n*******LOADING MAP********\n");
    console.log(response);
    var size = 1;
    if (response.data.contacts[0])
    {
        size = response.data.contacts.length;
    }
    const firstLoc = response.data.contacts[size - 1];
    console.log(firstLoc);
    //Sets the view at the newest location in list
    map = L.map('map').setView([firstLoc ? firstLoc.lat : 41, firstLoc ? firstLoc.lng : -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
        console.log(i);
    }

    for (const place of response.data.contacts)
    {
        if (place.lat && place.lng) 
        {
            const marker = L.marker([place.lat, place.lng]).addTo(map).bindPopup(`<b>${place.first_name} ${place.last_name}</b><br/>${place.street}, ${place.city}, ${place.state} ${place.country ? place.country : ''}`);
            markers.push(marker);
        }
    }
}

const on_row_click = (e) => {
    const lat = e.getAttribute("lat");
    const lng = e.getAttribute("lng")
    
    if (lat && lng) {
        map.flyTo(new L.LatLng(lat, lng));
    }
    
}