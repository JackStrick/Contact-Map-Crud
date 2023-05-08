var markers = [];
var map;


const loadMap = async () => {
    const response = await axios.get('/places');
    const firstLoc = response.data.places[0];
    //Sets the view at the newest location in list
    map = L.map('map').setView([firstLoc ? firstLoc.lat : 41, firstLoc ? firstLoc.lng : -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}


const addPlace = async () => {
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    await axios.put('/places', { label: label, address: address });
    await loadPlaces();
    const response = await axios.get('/places');
    var i = 0;
    for (const place of response.data.places){
        i += 1;
    }
    const newest = response.data.places[i-1];
    if (i >= 0){
        map.flyTo(new L.LatLng(newest.lat, newest.lng));
    }
    
    
}

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    await loadPlaces();
}

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
        for (var i = 0; i < markers.length; i++) {
            map.removeLayer(markers[i]);
        }
    }

    if (response && response.data && response.data.places) {
        for (const place of response.data.places) {
            
            const tr = document.createElement('tr');
            if (place.lat && place.lng) {
                const marker = L.marker([place.lat, place.lng]).addTo(map).bindPopup(`<b>${place.label}</b><br/>${place.address}`);
                markers.push(marker);
                tr.dataset.lat = place.lat;
                tr.dataset.lng = place.lng;
            }
            tr.onclick = on_row_click;
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        }

    }
}

const on_row_click = (e) => {
    console.log(e.target) // this is the element clicked
    console.log(e.target.tagName) // prints the element type (ie. TD)
    let row = e.target;
    if (e.target.tagName.toUpperCase() === 'TD') {
        row = e.target.parentNode;
    }
    if (row.dataset.lat && row.dataset.lng) {
        const lat = row.dataset.lat;
        const lng = row.dataset.lng;
        map.flyTo(new L.LatLng(lat, lng));
    }
    
}