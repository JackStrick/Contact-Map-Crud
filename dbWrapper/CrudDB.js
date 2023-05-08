require('dotenv').config();
const Database = require('dbcmps369');
const bcrypt = require('bcryptjs');

class CrudDB {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();

        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'phone', type: 'TEXT' },
            { name: 'email', type: 'TEXT' },
            { name: 'street', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'state', type: 'TEXT' },
            { name: 'zip', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'contact_by_email', type: 'NUMERIC' },
            { name: 'contact_by_phone', type: 'NUMERIC' },
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'user_name', type: 'TEXT' },
            { name: 'password', type: 'TEXT' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' }
        ], 'id');

        await this.db.schema('Place', [
            { name: 'id', type: 'INTEGER' },
            { name: 'label', type: 'TEXT' },
            { name: 'address', type: 'TEXT' },
            { name: 'lat', type: 'NUMERIC'},
            { name: 'lng', type: 'NUMERIC'}
        ], 'id');

        const initialUser = await this.db.read('Users', [{column: 'user_name', value: 'cmps369'}])

        if (initialUser.length == 0){
            this.createUser('Ramapo', 'College', 'cmps369', 'rcnj')
        }
   
    }

    async createContact(fname, lname, phone, email, street, city,  state, zip, country, contact_by_phone, contact_by_email) {
        const id = await this.db.create('Contact', [
            { column: 'first_name', value: fname },
            { column: 'last_name', value: lname },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_phone', value: contact_by_phone },
            { column: 'contact_by_email', value: contact_by_email }
        ])
    }

    async createUser(fname, lname, un, password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const id = await this.db.create('Users', [
            { column: 'first_name', value: fname},
            { column: 'last_name', value: lname},
            { column: 'user_name', value: un },
            { column: 'password', value: hash },
        ])
        return id;
    }

    async passwordAuthentication(givenPass, userPass) {
       return bcrypt.compareSync(givenPass, userPass)
    }


    async findContact(id, userId) {
        const games = await this.db.read('Game', [{ column: 'id', value: id }, { column: 'userId', value: userId }]);
        if (games.length > 0) return games[0];
        else {
            return undefined;
        }
    }

    async getAllContacts() {
        const contacts = await this.db.read('Contact', []);
        return contacts;
    }


    async findUserByUsername(username) {
        const us = await this.db.read('Users', [{ column: 'user_name', value: username }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findUserById(id) {
        const us = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async getContactById(id) {
        const con = await this.db.read('Contact', [{ column: 'id', value: id }]);
        if (con.length > 0) return con[0];
        else {
            return undefined;
        }
    }

    async updateContact(fname, lname, phone, email, street, city,  state, zip, country, contact_by_phone, contact_by_email, id) {
        await this.db.update('Contact', [
            { column: 'first_name', value: fname },
            { column: 'last_name', value: lname },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'street', value: street },
            { column: 'city', value: city },
            { column: 'state', value: state },
            { column: 'zip', value: zip },
            { column: 'country', value: country },
            { column: 'contact_by_phone', value: contact_by_phone },
            { column: 'contact_by_email', value: contact_by_email }], 
        
            [{ column: 'id', value: id }]
        );
    }

    async deleteContact(id){
        await this.db.delete('Contact',
        [{ column: 'id', value: id }])
    }

    async findPlaces() {
        const places = await this.db.read('Place', []);
        return places;
    }

    async createPlace(label, address, lat, lng) {
        const id = await this.db.create('Place', [
            { column: 'label', value: label },
            { column: 'address', value: address },
            { column: 'lat', value: lat },
            { column: 'lng', value: lng}
        ]);
        return id;
    }

    async deletePlace(id) {
        await this.db.delete('Place', [{ column: 'id', value: id }]);
    }

}

module.exports = CrudDB;