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
const scraper_aarfhouston = require('./scraper-aarfhouston');
const scraper_houstonspca = require('./scraper-houstonspca');

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
const { petModel } = require('./models/pet');
const { petLink } = require('./models/pet_link');


//Get Static Files
app.use(express.static(__dirname + './../public/'))

///////////////////////////////////////////////////////////////////////////////////////

function aarfhoustonScrapeLinks() {
    console.log("Start: Method aarfhoustonScrapeLinks");
    let counter = 0;

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
                    petLinkObj.save((err, doc) => {
                        if (err) return console.log(err);
                        console.log("New link Added to Database:");
                        console.log(doc);
                        counter++;
                    })
                }
            });
        }); //EOF loop

        counter == 0 ? console.log("No New Links Found") : console.log(`Added ${counter} New Links`);

        //Link Maintenance
        petLink.find({}, (err, docs) => {
            if (err) return console.log(err);
            linkMaintenance(petList, docs,"aarfhouston.org");
        });

    })
}

function aarfhoustonScrapePets() {
    console.log("Start: Method aarfhoustonScrapePets");
    let counterNew = 0;
    let counterUpdate = 0;
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
                            counter++;
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
                                    sex: pet.sex,
                                    status: "Active"
                                }
                            },
                            {
                                new: true
                            },
                            (err, doc) => {
                                if (err) return console.log(err);
                                //console.log("Pet Updated:", pet.petId);
                            })
                    }
                });
            }); //EOF loop

            counterNew == 0 ? console.log("No New Pets Found") : console.log(`Added ${counterNew} New Pets`);
            counterUpdate == 0 ? console.log("No Pets Updated") : console.log(`Updated ${counterUpdate} Pets`);

        });
    });
}


function houstonspcaScrapeLinks() {
    console.log("Start: Method houstonspcaScrapeLinks");
    let counter = 0;

    scraper_houstonspca.scrapePetLinks((petList) => {
        petList.forEach(pet => { //loop
            const petLinkObj = new petLink({
                petId: pet.petId,
                petURI: pet.petURI,
                domain: pet.domain
            })
            petLink.find({ petId: pet.petId }, (err, docs) => {
                if (err) return console.log(err);
                if (!(docs.length > 0)) {
                    petLinkObj.save((err, doc) => {
                        if (err) return console.log(err);
                        console.log("New link Added to Database:");
                        console.log(doc);
                        counter++;
                    })
                }
            });
        }); //EOF loop

        counter == 0 ? console.log("No New Links Found") : console.log(`Added ${counter} New Links`);

        //Link Maintenance
        petLink.find({ domain: "houstonspca.org"}, (err, docs) => {
            if (err) return console.log(err);
            if (docs.length > 0) linkMaintenance(petList, docs, "houstonspca.org");
        });

    })
}

function linkMaintenance(scrapeList, dbList, domain) {
    console.log("Link Maintenance for:",domain);
    //let counterInactive = 0;

    const scrapeIds = [];
    scrapeList.forEach(scrapeLink => { scrapeIds.push(scrapeLink.petId)})
    
    dbList.forEach(dbLink => {
        if (scrapeIds.indexOf(dbLink.petId) < 0 && dbLink.status == "Active") {
            petLink.findOneAndUpdate(
                { petId: dbLink.petId },
                {
                    $set: {
                        status: "Inactive"
                    }
                },
                {
                    new: true
                },
                (err, doc) => {
                    if (err) return console.log(err);
                    console.log("Setting to inactive:", doc.petId);
                    //counterInactive++;
                })
        } 
        // else {
        //     petLink.findOneAndUpdate(
        //         { petId: dbLink.petId },
        //         {
        //             $set: {
        //                 status: "Active"
        //             }
        //         },
        //         {
        //             new: true
        //         },
        //         (err, doc) => {
        //             if (err) return console.log(err);
        //             console.log(doc);
        //         })
        // }
    })
    //counterInactive != 0 ? console.log(`Updated ${counterInactive} records`) : console.log("All links up to date");
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
// houstonspcaScrapeLinks();

//Start Server
app.listen(config.PORT, () => {
    console.log(`Server up on port ${config.PORT}`)
});