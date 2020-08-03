const axios = require('axios').default;
const cheerio = require('cheerio');

const domain = 'aarfhouston.org';

//DB Models
const Pet = require('../models/pet');

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

    const petName = $('#layoutMainContent .pageCenterTitle').html().split("&apos;")[0];
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
        petName,
        breed,
        sex,
        age,
        imgs,
        petUUID: `${domain}-${axiosRes.config.url.split('AnimalID=')[1].trim()}`,
        petId: axiosRes.config.url.split('AnimalID=')[1].trim()
    };

    return petData

}


module.exports = {
    scrapeLinks,
    scrapePets,
    domain
}