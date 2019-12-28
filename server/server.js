//Express Basic Template
const express = require('express'); // Routing
const mongoose = require('mongoose'); //Mongoose - DB util
const CronJob = require('cron').CronJob;

new CronJob('0 */30 * * * *', function () {
    const d = new Date();
    console.log('Every 30 minutes:', d);
    aarfhoustonScrapeLinks();
    aarfhoustonScrapePets();
}, null, true, 'America/Chicago');

//Scrapers
const scraper_aarfhouston = require('./scraper-aarfhouston');

//App Config
const config = require('./config/config').get(process.env.NODE_ENV)
const app = express(); // Express App

//DB Config
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

//DB Models
const { petModel } = require('./models/pet');
const { petLink } = require('./models/pet_link');


//Get Static Files
app.use(express.static(__dirname + './../public/'))

///////////////////////////////////////////////////////////////////////////////////////

function aarfhoustonScrapeLinks() {
    console.log("Start: Method aarfhoustonScrapeLinks");
    scraper_aarfhouston.scrapePetLinks((petList) => {
        petList.forEach(pet => { //loop
            const petLinkObj = new petLink({
                petId: pet.petId,
                petURI: pet.petURI,
                domain: pet.domain
            })

            petLink.find({ petId:pet.petId }, (err, docs) => {
                if (err) return console.log(err);
                if (!(docs.length > 0)) {
                    //console.log("Doc Not Found! Lets add it")
                    petLinkObj.save((err, doc) => {
                        if (err) return console.log(err);
                        console.log("New link Added to Database:");
                        console.log(doc);
                    })
                }else{
                    console.log('No new Links to add!');
                }
            });
        }); //EOF loop
    })
}

function aarfhoustonScrapePets() {
    console.log("Start: Method aarfhoustonScrapePets");
    petLink.find({ domain: "aarfhouston.org" }, (err, petLinks) => {
        if (err) return console.log(err);

        scraper_aarfhouston.scrapePets(petLinks,(pets)=>{
            //if (pets) console.log('We got ',pets.length,' pets');

            pets.forEach(pet => { //loop
                const petObj = new petModel({
                    petId: pet.petId,
                    petURI: pet.petURI,
                    name: pet.petName,
                    breed: pet.breed,
                    age: pet.age,
                    sex: pet.sex
                })
                // console.log(pet);
                // console.log(petObj);

                petModel.find({ petId: pet.petId }, (err, docs) => {
                    if (err) return console.log(err);
                    if (docs.length<1) {
                        //console.log("Pet Not Found! Lets add it")
                        petObj.save((err, doc) => {
                            if (err) return console.log(err);
                            console.log("New pet Added to Database:");
                            console.log(doc);
                        })
                    }
                    else {
                        
                        petModel.findOneAndUpdate(
                            {petId: pet.petId},
                            {
                                $set: {
                                    name: pet.petName,
                                    breed: pet.breed,
                                    age: pet.age,
                                    sex: pet.sex
                                }
                            },
                            {
                                new: true
                            },
                            (err, doc) => {
                                if (err) return console.log(err);
                                console.log("Pet Updated:", pet.petId);
                            })
                    }
                });
            }); //EOF loop
        });
    });
}

app.get('/', (req, res) => {
    res.send("Hello Pets!")
})

app.get('/search', (req, res) => {
    petLink.find({}, (err, docs) => {
        if (err) return console.log(err);
        if (docs.length > 0) {
            res.send(docs)
        } else {
            res.send('No Documents found')
        }
    });
})

// aarfhoustonScrapeLinks();
// aarfhoustonScrapePets();

//Start Server
app.listen(config.PORT, () => {
    console.log(`Server up on port ${config.PORT}`)
});