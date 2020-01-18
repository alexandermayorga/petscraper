const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express'); // Routing
const mongoose = require('mongoose'); //Mongoose - DB util
const CronJob = require('cron').CronJob;

const mediaPath = path.normalize(`${__dirname}/../public/media/`);

new CronJob('0 */30 * * * *', function () {
    const d = new Date();
    console.log('Every 30 minutes:', d);
    aarfhoustonScrapeLinks();
    aarfhoustonScrapePets();
    houstonspcaScrapeLinks();
    houstonspcaScrapePets();
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
    const domain = "aarfhouston.org";

    Pet.find({ domain: domain, status: "Active" }, (err, petLinks) => {
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
                        (err, doc) => {
                            if (err) return console.log(err);

                            //Get Images
                            const petImgPath = `${mediaPath}${domain}/${pet.petId}`;

                            //check if folder exists
                            //if folder does not exist => create and download imgs
                            //else => download only new images
                            getPetImages(petImgPath,pet.imgsURI);

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

function houstonspcaScrapePets() {
    console.log("Start: Method aarfhoustonScrapePets");
    Pet.find({ domain: "houstonspca.org", status: "Active" }, (err, petLinks) => {
        if (err) return console.log(err);


        scraper_houstonspca.scrapePets(petLinks, (pets) => {
            //if (pets) console.log('We got ', pets.length, ' pets');
            // if (pets) console.log(pets);

            pets.forEach(pet => { //loop
                if ("status" in pet) {
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
                } else {
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
// aarfhoustonScrapePets();
// houstonspcaScrapeLinks();
// houstonspcaScrapePets();

function getPetImages(petImgPath, petURIs){
    fs.access(petImgPath, (err) => {
        if (err) {
            //This is a new Pet. Create new Folder and download all imgs
            fs.mkdir(petImgPath, { recursive: true }, (err) => {
                if (err) throw err;
                petURIs.forEach((uri) => {
                    downloadImg(uri, petImgPath);
                })
            });
        } else { //Pet has been Previously Scraped.
            //check for new Images
            petURIs.forEach((uri) => {
                const filename = path.basename(uri);
                fs.access(`${petImgPath}/${filename}`, (err) => {
                    //Check if we have this img. If Not => Download it
                    if (err) {
                        downloadImg(uri, petImgPath);
                    }
                })
            })
        }
    })
}

function downloadImg(url,petFolder){
    console.log('Downloading...', petFolder);
    // const ext = path.extname(url);
    const filename = path.basename(url);
    const localPath = `${petFolder}/${filename}`;

    //Save image from External URL.
    https.get(url, function (res) {
        //Validation
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } 
        else if (!/^image\/(jpeg|png)/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected 'image/jpeg' OR 'image/png' but received '${contentType}'`);
        }
        //image/jpeg | image/png
        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        const file = fs.createWriteStream(localPath);
        res.pipe(file, { end: false });
        res.on('end', () => {
            file.end(); //can do callback here if needed
        });

    }).on('error', (e) => {
        console.error(e);
    });

}





//Start Server
app.listen(config.PORT, () => {
    console.log(`Server up on port ${config.PORT}`)
});