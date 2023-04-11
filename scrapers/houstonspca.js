const axios = require('axios').default;
const cheerio = require('cheerio');

//DB Models
const Pet = require('../models/pet');

const domain = 'houstonspca.org';


/**
 * Scrapes 'houstonspca.org' for Pet Links
 * @param {Function} cb - Callback Function
 * @returns Array[ {Object}, ... ]
 */
function scrapeLinks(cb) {
    getSearchResultsLinkPages(async (err, pageListsLinks) => {
        if (err) return cb(err)

        try {
            const searchResultPagesHTML = await axios.all(
                pageListsLinks.map(link => axios.get(link))
            )

            const petLinks = []

            searchResultPagesHTML.forEach(axiosResponse => {
                petLinks.push(...getPetLinkList(axiosResponse.data))
            })

            // console.log(petLinks.length)
            // console.log(petLinks)

            return cb(null, petLinks)

        } catch (err) {
            return cb(err)
        }

    })
}

/**
 * Async Function - Checks the main search results page's pagination and returns all search result page links
 * @param {Function} cb - Callback Function
 * @returns Array[ String... ]
 */
async function getSearchResultsLinkPages(cb) {
    try {
        const response = await axios.get('https://houstonspca.org/available-pets/?status=3&pet-name&type%5B0%5D=Dog&pets-page=1');

        const $ = cheerio.load(response.data);
        const pagination = $('.pets-index__pagination .page-numbers').filter(':not(.next)')

        if (pagination.length < 1) return cb(null, ['https://houstonspca.org/available-pets/?status=3&pet-name&type%5B0%5D=Dog&pets-page=1'])

        const pageListsLinks = [];

        pagination.each((i, item) => {
            pageListsLinks.push(
                `https://houstonspca.org/available-pets/?status=3&pet-name&type%5B0%5D=Dog&pets-page=${i + 1}`
            );
        })

        return cb(null, pageListsLinks)

    } catch (error) {
        return cb(error)
    }
}

/**
 * Parses HTML and returns a list of Pet Link objects
 * @param {String} HTMLbody - an HTML String
 * @returns Array[ {Object}, ... ]
 */
function getPetLinkList(HTMLbody) {
    const $ = cheerio.load(HTMLbody);

    const list = $('.pets-index__grid');
    const pets = [];

    list.find('.pet-card').each((i, card) => {
        if (!$(card).attr('href')) return;
        const petURI = $(card).attr('href');
        let petId = petURI.split('pet=')[1];
        // if (petId.indexOf('?')) petId = petId.split('?')[0]; // just in case they add any other params in the URL
        const pet = {
            petURI: `${petURI}`,
            domain,
            petId,
            petUUID: `${domain}-${petId}`
        }
        pets.push(pet);
    })
    return pets;
}


/**
 * Get array list of pets to be scraped
 * We need a function that scrapes a single pet
 * We need a function that runs previous function, stores data in a new array, and runs again if there are still items in the array list in step 1
 */

function repeater(array) {
    // Do Something to single array item
}



// function fetchLinks(){
//     console.log(`--> houstonspca: Scraping Links Started | ${new Date()}`)

//     scrapeLinks((err, petLinks) => {
//         if (err) return res.end("There was an Error")

//         const newPetLinks = petLinks.map(async (petLink) => {
//             try {
//                 return await Pet.create(petLink)
//             } catch (error) {
//                 if (!(error.code === 11000)) {
//                     console.log(`--> houstonspca: Scraping Links Error | ${new Date()}`)
//                     console.log(error)
//                 }
//             }
//         })

//         Promise.all(newPetLinks)
//             .then(data => {

//                 const cleanNewPetLinks = data.filter(d => d != undefined)

//                 if (cleanNewPetLinks.length > 0) {
//                     console.log(`--> New Links Added: ${cleanNewPetLinks.length} total`)
//                 } else {
//                     console.log("--> No New Links to Add")
//                 }

//                 Pet.find({ domain: houstonspca.domain }, (err, pets) => {
//                     if (err) return res.send("Bork! Error...")

//                     res.send(pets)
//                 })

//             })
//             .catch(err => {
//                 console.log(err);
//                 res.end("Bork, Error!")
//             })

//     })
// }
function fetchLinks() {
    console.log(`--> houstonspca: Scraping Links Started | ${new Date()}`)

    scrapeLinks((err, petLinks) => {
        if (err) return console.log(`--> houstonspca: Scraping Links Error | ${new Date()}`, err)

        const newPetLinks = petLinks.map(async (petLink) => {
            try {
                return await Pet.create(petLink)
            } catch (error) {
                if (!(error.code === 11000)) {
                    console.log(`--> houstonspca: Scraping Links Error | ${new Date()}`)
                    console.log(error)
                }
            }
        })

        Promise.all(newPetLinks)
            .then(data => {

                const cleanNewPetLinks = data.filter(d => d != undefined)

                if (cleanNewPetLinks.length > 0) {
                    console.log(`--> New Links Added: ${cleanNewPetLinks.length} total`)
                } else {
                    console.log("--> No New Links to Add")
                }

                console.log(`--> houstonspca: Scraping Links Ended | ${new Date()}`)

                // Pet.find({ domain: houstonspca.domain }, (err, pets) => {
                //   if (err) return res.send("Bork! Error...")

                //   res.send(pets)
                // })

            })
            .catch(err => {
                console.log(`--> houstonspca: Scraping Links Error | ${new Date()}`)
                console.log(err)
                // res.end("Bork, Error!")
            })

    })
}


function fetchPets() {
    console.log(`--> houstonspca: Scraping Pets Started | ${new Date()}`)
    scrapePets((err, petsData) => {
        if (err) return console.log(`--> houstonspca: Scraping Pets Error | ${new Date()}`, err)

        const newPetsData = petsData.map(async petData => {
            try {
                return await Pet.findOneAndUpdate({ petUUID: petData.petUUID }, petData, { returnOriginal: false })
            } catch (error) {
                console.log(`--> houstonspca: Scraping Pets Error | ${new Date()}`)
                console.log(error)
                // res.send("Bork Bork, Error!")
            }
        })

        Promise.all(newPetsData)
            .then(data => {

                console.log(`--> Pets Updated: ${data.length}`)
                console.log(`--> houstonspca: Scraping Pets Ended | ${new Date()}`)
                // res.send(data)

            })
            .catch(err => {
                console.log(`--> houstonspca: Scraping Pets Error | ${new Date()}`)
                // res.end("Bork, Error!")
            })
    })
}

/**
 * Gets links from the DB and Scrapes 'houstonspca.org' for individual pet data
 * @param {Function} cb - Callback Function
 * @returns Array[ {Pet Object}, ... ]
 */
async function scrapePets(cb) {
    try {
        const petLinks = await Pet.find({
            domain,
            status: "Active"
        })

        const pets = await scrapeSinglePetLoop(petLinks)

        cb(null, pets)

    } catch (error) {
        console.log(error);
        cb(error)
    }
}

/**
 * Iterative function to reduce an array of Pet links. It Scrapes a single Pet page until reaching the end of array.
 * This is a workaround to the 429 error (Too many requests)
 * @param {Array} dbPetsArray an Array of Pet Objects from DB
 */
async function scrapeSinglePetLoop(dbPetsArray, resultsArray = [], index = 1) {
    try {
        if(!Array.isArray(dbPetsArray)) return [];
        if(index > dbPetsArray.length) return resultsArray;

        //TODO make sure we get an array. Otherwise just exit fn
        const petToScrape = dbPetsArray[index-1]

        const axiosResponse = await axios.get(petToScrape.petURI)

        resultsArray.push(parsePetPage(axiosResponse, petToScrape))
        
        return scrapeSinglePetLoop(dbPetsArray, resultsArray, index+1);

    } catch (error) {
        console.log(error)
    }

}

/**
 * Parses the HTML of a Pet Page. Checks for Inactive pets
 * @param {Object} axiosRes - Axios Response Object
 * @returns {Object} Object containg the Pet Data
 */
function parsePetPage(axiosRes, petDataToScrape) {
    const $ = cheerio.load(axiosRes.data);

    if ($('.pet__name').text().trim().length < 1) return {
        petUUID: petDataToScrape.petUUID,
        status: "Inactive"
    }  //Checking that there is info in the page

    const name = $('.pet__name').text().trim();
    let breed = "";
    let sex = "";
    let age = "";
    const imgs = [];

    const petFeatures = $('.pets-single__right .pet__feature .pet__feature__row');

    petFeatures.each((i, feat) => {
        // console.log($(feat).text())
        if ($(feat).text().indexOf('Breed:') >= 0) {
            breed = $(feat).text().split('Breed:')[1].trim();
            // console.log(breed)
        }
        if ($(feat).text().indexOf('Sex:') >= 0) {
            sex = $(feat).text().split('Sex:')[1].trim();
            // console.log(sex)
        }
        if ($(feat).text().indexOf('Age:') >= 0) {
            age = $(feat).text().split('Age:')[1].trim();
            // console.log(age)
        }
    });

    const imgElements = $('.pet-slider .pet-slide');
    imgElements.each((i, elem) => {
        // console.log($(elem).attr('src'))
        // const style = $(elem).attr('style');
        // //TODO: Some have videos. Maybe will add later
        // if (style) imgs.push(style.slice(style.indexOf("https://"), style.indexOf(");")));
        imgs.push($(elem).attr('src'));

    })

    const extraInfo = $('.pet__text.small-content-area').text().trim()
    const petId = axiosRes.config.url.split('pet=')[1].trim()
    const slug = `${name}-${breed}-${sex}-${age}-${domain}-${petId}`.toLowerCase().replaceAll(" ","-");

    const petData = {
        name,
        breed,
        sex,
        age,
        imgs,
        petUUID: `${domain}-${axiosRes.config.url.split('pet=')[1].trim()}`,
        petId,
        extraInfo,
        slug
    };

    return petData;

}

module.exports = {
    scrapeLinks,
    domain,
    scrapePets,
    fetchLinks,
    fetchPets
}