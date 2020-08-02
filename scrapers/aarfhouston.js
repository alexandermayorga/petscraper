const axios = require('axios').default;
const cheerio = require('cheerio');

const domain = 'aarfhouston.org';

async function scrapeLinks(cb) {
    try {
        const response = await axios.get('https://www.aarfhouston.org/animals/list');

        const petLinks = getPetLinkList(response.data)

        return cb(null, petLinks)

    } catch (error) {

        return cb(error)

    }

}

//Returns array of pet objects 
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

module.exports = {
    scrapeLinks,
    domain
}