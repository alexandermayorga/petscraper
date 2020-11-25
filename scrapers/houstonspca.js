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
    getSearchResultsPages(async (err, pageListsLinks) => {
        if (err) return cb(err)
        
        try {
            const searchResultPagesHTML = await axios.all(pageListsLinks.map(link => axios.get(link)))

            const petLinks = []

            searchResultPagesHTML.forEach(axiosResponse => {
                petLinks.push(...getPetLinkList(axiosResponse.data))
            })

            // console.log(petLinks.length)

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
async function getSearchResultsPages(cb) {
    try {
        const response = await axios.get('https://www.houstonspca.org/adopt/available-pets/?type=Dog&pets-page=');

        const $ = cheerio.load(response.data);

        const pagination = $('.post-pagination .page-numbers').filter(':not(.next)')

        if (!pagination.html()) return cb(null,['https://www.houstonspca.org/adopt/available-pets/?type=Dog&pets-page='])

        const pageListsLinks = [];

        pagination.each((i, item) => {
            pageListsLinks.push(
              `https://www.houstonspca.org/adopt/available-pets/?type=Dog&pets-page=${i+1}`
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

    const list = $('#main .pets__grid');
    const pets = [];

    list.find('.card__grid .pet-card').each((i, card) => {
        const petURI = $(card).attr('href');
        let petId = petURI.split('pet=')[1];
        // if (petId.indexOf('?')) petId = petId.split('?')[0]; // just in case they add any other params in the URL
        const pet = {
            petURI: `https://www.${domain}${petURI}`,
            domain,
            petId,
            petUUID: `${domain}-${petId}`
        }
        pets.push(pet);
    })
    return pets;
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

        const response = await axios.all(petLinks.map(petLink => axios.get(petLink.petURI)))

        const pets = response.map(res => parsePetPage(res))
        
        cb(null, pets)

    } catch (error) {
        console.log(error);
        cb(error)
    }
}

/**
 * Parses the HTML of a Pet Page. Checks for Inactive pets
 * @param {Object} axiosRes - Axios Response Object
 * @returns {Object} Object containg the Pet Data
 */
function parsePetPage(axiosRes) {
    const $ = cheerio.load(axiosRes.data);

    if ($('.img-s__content-col').length < 1) return {
        petUUID: `${domain}-${axiosRes.config.url.split('pet=')[1].trim()}`,
        status: "Inactive"
    }  //Checking that there is info in the page

    const name = $('.img-s__content-col .title').text();
    let breed = "";
    let sex = "";
    let age = "";
    const imgs = [];

    const petFeatures = $('.img-s__content-col .pet__feature > div');

    petFeatures.each((i, feat) => {
        if ($(feat).text().indexOf('Breed:') >= 0) {
            breed = $(feat).text().split('Breed:')[1].trim();
        }
        if ($(feat).text().indexOf('Sex:') >= 0) {
            sex = $(feat).text().split('Sex:')[1].trim();
        }
        if ($(feat).text().indexOf('Age:') >= 0) {
            age = $(feat).text().split('Age:')[1].trim();
        }
    });

    const imgElements = $('.pet-slider-single .pet-slide-top');
    imgElements.each((i, elem) => {
        
        const style = $(elem).attr('style');
        //TODO: Some have videos. Maybe will add later
        if (style) imgs.push(style.slice(style.indexOf("https://"), style.indexOf(");")));

    })

    const petData = {
        name,
        breed,
        sex,
        age,
        imgs,
        petUUID: `${domain}-${axiosRes.config.url.split('pet=')[1].trim()}`,
        petId: axiosRes.config.url.split('pet=')[1].trim()
    };

    return petData;

}

function fetchLinks(){
    console.log(`--> houstonspca: Scraping Links Started | ${new Date()}`)

    scrapeLinks((err, petLinks) => {
        if (err) return res.end("There was an Error")

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

                Pet.find({ domain: houstonspca.domain }, (err, pets) => {
                    if (err) return res.send("Bork! Error...")

                    res.send(pets)
                })

            })
            .catch(err => res.end("Bork, Error!"))

    })
}

function fetchPets(){
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

module.exports = {
    scrapeLinks, 
    domain, 
    scrapePets,
    fetchLinks,
    fetchPets
}