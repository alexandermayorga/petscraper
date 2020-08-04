const axios = require('axios').default;
const cheerio = require('cheerio');

//DB Models
const Pet = require('../models/pet');

const domain = 'aarfhouston.org';

/**
 * Scrapes 'aarfhouston.org' for Pet Links
 * @param {Function} cb - Callback Function
 * @returns Array[ {Pet Object}, ... ]
 */
async function scrapeLinks(cb) {
    try {
        const response = await axios.get('https://www.aarfhouston.org/animals/list');

        const petLinks = getPetLinkList(response.data)

        return cb(null, petLinks)

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

    const list = $('table.portalTable');
    const pets = [];

    list.find('tbody tr').each((i, row) => {
        const petURI = $(row).find('td a').eq(0).attr('href');
        let petId = petURI.split('AnimalID=')[1];
        if (petId.indexOf('?')) petId = petId.split('?')[0]; // just in case they add any other params in the URL

        const pet = {
            petURI: `https://www.${domain}${petURI}`,
            domain,
            petId, 
            petUUID: `${domain}-${petId}`
            // ,
            // name: $(row).find('td').eq(0).text().trim(),
            // breed: $(row).find('td').eq(1).text().trim(),
            // sex: $(row).find('td').eq(2).text().trim(),
            // img: $(row).find('td').eq(3).find('img').attr('src')
        }
        pets.push(pet);
    })
    return pets;
}

/**
 * Gets links from the DB and Scrapes 'aarfhouston.org' for individual pet data
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

    //Checking if there is info in the page
    if ($('#animalDetailsAbout').length < 1) return { 
        petUUID: `${domain}-${axiosRes.config.url.split('AnimalID=')[1].trim()}`, 
        status: "Inactive"
    } 

    const name = $('#layoutMainContent .pageCenterTitle').html().split("&apos;")[0];
    const breed = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[0].trim();
    const sex = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[2].trim();
    const age = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[4].trim();

    const imgs = [];
    if ( !(typeof ($('#animalMainImage').attr('src')) == "undefined") ) {
        //Only push Active Pets with images
        if ($('a[rel="prettyPhoto[pp_gal]"]').length > 0) {
            $('a[rel="prettyPhoto[pp_gal]"]').each((i, elem) => {
                imgs.push($(elem).attr('href'));
            })
            if (!(imgs.includes($('#animalMainImage').attr('src')))) {
                imgs.unshift($('#animalMainImage').attr('src'));
            }
        }
    }

    const petData = {
        name,
        breed,
        sex,
        age,
        imgs,
        petUUID: `${domain}-${axiosRes.config.url.split('AnimalID=')[1].trim()}`,
        petId: axiosRes.config.url.split('AnimalID=')[1].trim()
    };

    return petData

}

function fetchLinks (){
    console.log(`--> aarfhouston: Scraping Links Started | ${new Date()}`)

    scrapeLinks((err, petLinks) => {
        if (err) return console.log(`--> aarfhouston: Scraping Links Error | ${new Date()}`, err)

        const newPetLinks = petLinks.map(async (petLink) => {
            try {
                return await Pet.create(petLink)
            } catch (error) {
                if (!(error.code === 11000)){
                    console.log(`--> aarfhouston: Scraping Links Error | ${new Date()}`)
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

                console.log(`--> aarfhouston: Scraping Links Ended | ${new Date()}`)

                // Pet.find({ domain: aarfhouston.domain }, (err, pets) => {
                //   if (err) return res.send("Bork! Error...")

                //   res.send(pets)
                // })

            })
            .catch(err => {
                console.log(`--> aarfhouston: Scraping Links Error | ${new Date()}`)
                console.log(err)
                // res.end("Bork, Error!")
            })

    })
}

function fetchPets() {
    console.log(`--> aarfhouston: Scraping Pets Started | ${new Date()}`)
    scrapePets((err, petsData) => {
        if (err) return console.log(`--> aarfhouston: Scraping Pets Error | ${new Date()}`, err)

        const newPetsData = petsData.map(async petData => {
            try {
                return await Pet.findOneAndUpdate({ petUUID: petData.petUUID }, petData, { new: true })
            } catch (error) {
                console.log(`--> aarfhouston: Scraping Pets Error | ${new Date()}`)
                console.log(error)
                // res.send("Bork Bork, Error!")
            }
        })

        Promise.all(newPetsData)
            .then(data => {

                console.log(`--> Pets Updated: ${data.length}`)
                console.log(`--> aarfhouston: Scraping Pets Ended | ${new Date()}`)
                // res.send(data)

            })
            .catch(err => {
                console.log(`--> aarfhouston: Scraping Pets Error | ${new Date()}`)
                // res.end("Bork, Error!")
            })

    })
}



module.exports = {
    scrapeLinks,
    scrapePets,
    fetchLinks,
    fetchPets,
    domain
}