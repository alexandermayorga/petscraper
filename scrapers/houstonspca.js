const axios = require('axios').default;
const cheerio = require('cheerio');

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

        const pageListsLinks = [];

        pagination.each((i, item) => {
            pageListsLinks.push(`https://www.houstonspca.org/adopt/available-pets/?type=Dog&pets-page=${$(item).text().trim()}`)
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

module.exports = {
    scrapeLinks, domain
}