const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const express = require('express'); // Routing
const hbs = require('express-handlebars'); //Templating Engine
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

//// ############# HBS SETUP ############# ////
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + './../views/layouts',
    partialsDir: __dirname + './../views/partials'
}));
app.set('view engine', 'hbs');
//// ############# HBS SETUP ############# ////

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
                }
                else{
                    Pet.findOneAndUpdate(
                        { petId: pet.petId, domain: domain },
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
                            console.log("Pet Updated:", pet.petId);
                            
                            //Get Images
                            const petImgPath = `${mediaPath}${domain}/${pet.petId}`;

                            //check if folder exists
                            //if folder does not exist => create and download imgs
                            //else => download only new images
                            if (pet.imgsURI.length > 0) downloadPetImages(petImgPath,pet.imgsURI,(filenames)=>{
                                console.log("filenames:",filenames);
                                let imgFileNames = [];
                                if ("imgs" in doc) {
                                    imgFileNames = [...doc.imgs,...filenames];
                                }else{
                                    imgFileNames = [...filenames];
                                }
                                Pet.findOneAndUpdate(
                                    { petId: pet.petId, domain: domain },
                                    {
                                        $set: {
                                            imgs: imgFileNames
                                        }
                                    },
                                    (err, doc) => {
                                        if (err) return console.log(err);
                                        console.log("Images Updated for:", pet.petId);
                                    })
                            });
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
    console.log("Start: Method houstonspcaScrapePets");
    const domain = "houstonspca.org";
    Pet.find({ domain: domain, status: "Active" }, (err, petLinks) => {
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
                        (err, doc) => {
                            if (err) return console.log(err);
                            console.log("Pet Updated:", pet.petId);

                            //Get Images
                            const petImgPath = `${mediaPath}${domain}/${pet.petId}`;

                            console.log(pet.imgstest);

                            //check if folder exists
                            //if folder does not exist => create and download imgs
                            //else => download only new images
                            if (pet.imgsURI.length > 0) downloadPetImages(petImgPath, pet.imgsURI, (filenames) => {
                                console.log("filenames:", filenames);
                                let imgFileNames = [];
                                if ("imgs" in doc) {
                                    imgFileNames = [...doc.imgs, ...filenames];
                                } else {
                                    imgFileNames = [...filenames];
                                }
                                Pet.findOneAndUpdate(
                                    { petId: pet.petId, domain: domain },
                                    {
                                        $set: {
                                            imgs: imgFileNames
                                        }
                                    },
                                    (err, doc) => {
                                        if (err) return console.log(err);
                                        console.log("Images Updated for:", pet.petId);
                                    })
                            });
                        }
                    )
                }
            }); //EOF loop

        });
    }).select('petURI petId');
}


app.get('/', (req, res) => {

    Pet.count({ status: "Active" }).exec((err, itemsCount) => {
        if (err) return res.status(400).send(err);

        Pet.find({ status: "Active" }).sort({ _id: 'asc' }).limit(30).exec((err, docs) => {
            if (err) return res.status(400).send(err);

            const pets = arrayShuffle(hbsWorkAround(docs));

            //console.log(pets[4]);
            res.render('home-masonry', {
                pets,
                page: 1,
                itemsCount,
                pageSize: 30 
                // helpers: {
                //     cardControl: function (index,options) {
                //         return index % 3 === 0 ? options.fn(this) : '';
                //     }
                // }
            });
        })
    })
})
app.get('/:page', (req, res) => {
    const skip = req.params.page < 1 ? 0 : (req.params.page - 1) * 30;
    const page = req.params.page < 1 ? 0 : req.params.page;
    Pet.countDocuments({ status: "Active" }).exec((err, itemsCount )=>{
        if (err) return res.status(400).send(err);
        
        Pet.find({ status: "Active" }).sort({ _id: 'asc' }).skip(skip).limit(30).exec((err, docs) => {
            if (err) return res.status(400).send(err);

            if (docs.length == 0) {
                res.redirect('/')
            }
            else {
                const pets = arrayShuffle(hbsWorkAround(docs));

                res.render('home-masonry', {
                    pets,
                    page,
                    itemsCount,
                    pageSize: 30                    
                });
            }
        })
    })


})

app.get('/search', (req, res) => {
    Pet.find({status:"Active"}, (err, docs) => {
        if (err) return console.log(err);
        if (docs.length > 0) {
            res.send(docs);
        } else {
            res.send('No Documents found')
        }
    });
})

// aarfhoustonScrapeLinks();
// aarfhoustonScrapePets();
// houstonspcaScrapeLinks();
// houstonspcaScrapePets();

//This is a workaround the security issue: 
/*
    Handlebars: Access has been denied to resolve the property "id" because it is not an "own property" of its parent.
    You can add a runtime option to disable the check or this warning:
    See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
*/
function hbsWorkAround(docs) {
    const arr = docs.map(document => {
        const obj = {};
        for (let key in document) {
            obj[key] = document[key];
        }
        return obj;
    })
    return arr;
}

function downloadPetImages(petImgPath, petURIs,cb){
    if (petURIs.length < 1) {
        let error = new Error('petURIs Array was empty');
        console.error(error.message);
        return;
    }
    fs.access(petImgPath, (err) => {
        if (err) {
            //This is a new Pet. Create new Folder and download all imgs
            fs.mkdir(petImgPath, { recursive: true }, (err) => {
                if (err) throw err;
                const filenames = [];
                petURIs.forEach((uri) => {
                    downloadImg(uri, petImgPath,(filename)=>{
                        filenames.push(filename);
                        if (filenames.length == petURIs.length) {
                            if (cb) return cb(filenames);
                        }
                    });
                })
            });
        } else { //Pet has been Previously Scraped.
            //check for new Images
            const newFilenames = [];

            //Lets do an array with the 
            fs.readdir(petImgPath, function (err, files) {
                if (err) throw err;

                petURIs.forEach((uri,i,arr)=>{
                    const filename = path.basename(uri);
                    if (!(files.includes(filename))) {
                        downloadImg(uri, petImgPath, (newFileName) => {
                            newFilenames.push(newFileName);
                            console.log("newFilenames",newFilenames);
                            if ((i + 1) == arr.length) {
                                if (cb) return cb(newFilenames);
                            }
                        });
                    }else{
                        if ((i + 1) == arr.length) {
                            if (cb) return cb(newFilenames);
                        }
                    }

                })
            });
        }
    })
}

/**
 * Saves and image from and External URL.
 * @param {String} url 
 * @param {String} petFolder 
 * @param {Function} cb
 */
function downloadImg(url,petFolder,cb){
    // const ext = path.extname(url);
    const filename = path.basename(url);
    const localPath = `${petFolder}/${filename}`;

    console.log('Downloading...', localPath);

    const protocol = (url.indexOf('https://') >= 0) ? https : http;

    //Save image from External URL.
    protocol.get(url, function (res) {
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
            file.end(()=>{
                if(cb) return cb(filename);
            }); 
        });

    }).on('error', (e) => {
        console.error(e);
    });

}

//Based on Fisher–Yates shuffle algorithm:
function arrayShuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        [array[i], array[j]] = [array[j], temp];
    }
    return array;
}


//Start Server
app.listen(config.PORT, () => {
    console.log(`Server up on port ${config.PORT}`)
});