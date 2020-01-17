//Express Basic Template
const express = require('express'); // Routing
const mongoose = require('mongoose'); //Mongoose - DB util
const CronJob = require('cron').CronJob;

new CronJob('0 */30 * * * *', function () {
    const d = new Date();
    console.log('Every 30 minutes:', d);
    aarfhoustonScrapeLinks();
    aarfhoustonScrapePets();
    houstonspcaScrapeLinks();
}, null, true, 'America/Chicago');

//Scrapers
const scraper_aarfhouston = require('./scrapers/scraper-aarfhouston');
const scraper_houstonspca = require('./scrapers/scraper-houstonspca');

//App Config
const config = require('./config/config').get(process.env.NODE_ENV)
const app = express(); // Express App

//DB Config
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false 
});

//DB Models
const { Pet } = require('./models/pet');


//Get Static Files
app.use(express.static(__dirname + './../public/'))

///////////////////////////////////////////////////////////////////////////////////////

function aarfhoustonScrapeLinks() {
    console.log("Start: Method aarfhoustonScrapeLinks");

    scraper_aarfhouston.scrapePetLinks((petList) => {
        petList.forEach(pet => { //loop
            const petLinkObj = new Pet({
                petId: pet.petId,
                petURI: pet.petURI,
                domain: pet.domain
            })
            Pet.find({ petId: pet.petId, domain: pet.domain }, (err, docs) => {
                if (err) return console.log(err);
                if (docs.length < 1) {
                    petLinkObj.save((err, doc) => {
                        if (err) return console.log(err);
                        console.log("New link Added to Database:", doc.petId);
                    })
                }
            });
        }); //EOF loop

    })
}

function aarfhoustonScrapePets() {
    console.log("Start: Method aarfhoustonScrapePets");
    let counterUpdate = 0;
    Pet.find({ domain: "aarfhouston.org", status: "Active" }, (err, petLinks) => {
        if (err) return console.log(err);

        scraper_aarfhouston.scrapePets(petLinks, (pets) => {
            // if (pets) console.log('We got ', pets.length, ' pets');
            // if (pets) console.log(pets);

            pets.forEach(pet => { //loop
                if("status" in pet){
                    Pet.findOneAndUpdate(
                        { petURI: pet.petURI },
                        {
                            $set: {
                                status: "Inactive"
                            }
                        },
                        (err, pet) => {
                            if (err) return console.log(err);
                            console.log("Pet Inactive:", pet.petId);
                        }
                    ) 
                }else{
                    const petObj = {
                        name: pet.petName,
                        breed: pet.breed,
                        age: pet.age,
                        sex: pet.sex
                    }
                    // console.log(pet);
                    // console.log(petObj);
                    Pet.findOneAndUpdate(
                        { petId: pet.petId },
                        {
                            $set: {
                                name: pet.petName,
                                breed: pet.breed,
                                age: pet.age,
                                sex: pet.sex
                            }
                        },
                        (err, pet) => {
                            if (err) return console.log(err);
                            console.log("Pet Updated:", pet.petId);
                        }
                    ) 
                }
            }); //EOF loop

        });
    }).select('petURI petId');
}

function houstonspcaScrapeLinks() {
    console.log("Start: Method houstonspcaScrapeLinks");
    let counter = 0;

    scraper_houstonspca.scrapePetLinks((petList) => {
        console.log("petList Length:",petList.length)
        petList.forEach((pet,i) => { //loop
            const petLinkObj = new Pet({
                petId: pet.petId,
                domain: pet.domain,
                petURI: pet.petURI
            })
            Pet.find({ petId: pet.petId, domain: pet.domain }, (err, docs) => {
                if (err) return console.log(err);
                if(docs.length < 1){
                    petLinkObj.save((err, doc) => {
                        if (err) return console.log(err);
                        console.log("New Pet link Added to Database:", doc.petId);
                    })
                }
            });
        }); //EOF loop
    })
}

app.get('/', (req, res) => {
    res.send("Hello Pets!")
})

app.get('/search', (req, res) => {
    Pet.find({status:"Active"}, (err, docs) => {
        if (err) return console.log(err);
        if (docs.length > 0) {
            res.send(docs)
        } else {
            res.send('No Documents found')
        }
    });
})

//aarfhoustonScrapeLinks();
//aarfhoustonScrapePets();
//houstonspcaScrapeLinks();

//Start Server
app.listen(config.PORT, () => {
    console.log(`Server up on port ${config.PORT}`)
});