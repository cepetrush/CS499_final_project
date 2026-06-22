const boardingEndpoint = 'http://localhost:3000/api/boarding';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}

var fs = require('fs');
var boarding = JSON.parse(fs.readFileSync('./data/boarding.json','utf8'));

/* GET pet view*/
const pet = (req, res) => {
    res.render('pet', {title: 'Pet Getaways', boarding});
};


module.exports = {
    pet
};