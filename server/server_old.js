//Express Basic Template
const express = require('express'); // Routing
const mongoose = require('mongoose'); //Mongoose - DB util
const scraper = require('./scraper');
const scraper_aarfhouston = require('./scraper-aarfhouston');


const url = 'https://www.aarfhouston.org/animals/browse?Status=Available&Page=';

//App Config
const config = require('./config/config').get(process.env.NODE_ENV)
const app = express(); // Express App

//DB Config
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

//DB Models
const { searchResult } = require('./models/search_result');


//Get Static Files
app.use(express.static(__dirname + './../public/'))

///////////////////////////////////////////////////////////////////////////////////////

/*
scraper_aarfhouston.searchPets((pets) => {
    pets.forEach(pet => { //loop
        const search_result = new searchResult({
            petURI: pet.petURI,
            petId: pet.petId,
            name: pet.name,
            breed: pet.breed,
            sex: pet.sex,
            img: pet.img
        })

        searchResult.find({ petId:pet.petId }, (err, docs) => {
            if (err) return console.log(err);
            if (!(docs.length > 0)) {
                console.log("Doc Not Found! Lets add it")
                search_result.save((err, doc) => {
                    if (err) return console.log(err);
                    console.log(doc);
                })
            }
            else {
                console.log("Doc Found! Update!")
            }
        });
    }); //EOF loop
    //check for more pages
})
*/

scraper.searchPets(url, 1, (pets) => {
    pets.forEach(pet => { //loop
        const petId = pet.petId;
        const name = pet.name;
        console.log(pet);
        const search_result = new searchResult({
            petId,
            name
        })

        searchResult.find({ petId }, (err, docs) => {
            if(err) return console.log(err);
            if (!(docs.length > 0)) {
                console.log("Doc Not Found! Lets add it")
                search_result.save((err, doc) => {
                    if (err) return console.log(err);
                    console.log('Doc',doc);
                })
            } 
            // else {
            //     console.log("Doc Found! Update!")
            // }
        });
    }); //EOF loop

    //check for more pages
})

app.get('/search', (req, res) => {
    searchResult.find({}, (err, docs) => {
        if (err) return console.log(err);
        if (docs.length > 0) {
            res.send(docs)
        } else {
            res.send('No Documents found')
        }
    });
})


//Start Server
app.listen(config.PORT, () => {
    console.log(`Server up on port ${config.PORT}`)
});