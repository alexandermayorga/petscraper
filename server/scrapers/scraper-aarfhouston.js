const axios = require('axios').default;
const cheerio = require('cheerio');

const domain = 'aarfhouston.org';
const petListURI = `https://www.${domain}/animals/list`;

//Main Function
function scrapePetLinks(cb) {
    fetchURL(petListURI).then(response => {
        petList = [...getPetLinkList(response.data)];
        return cb(petList);
    })
}

//Fetch the data: gets the HTML of the provided URI
function fetchURL(URI){
    return axios.get(URI);
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
            petURI: `https://www.aarfhouston.org${petURI}`,
            domain,
            petId
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

//Main Function
function scrapePets(petLinks,cb){
    // console.log("guau!");
    const pets = [];
    let counter = 0;

    petLinks.forEach((pet,i,arr) => {
        fetchURL(pet.petURI).then(response => {
            counter++;
            const $ = cheerio.load(response.data);

            if ($('#animalDetailsAbout').length < 1) { return pets.push({ petURI: pet.petURI, status:"Inactive"});}; //Checking that there is info in the page

            const petName = $('#layoutMainContent .pageCenterTitle').html().split("&apos;")[0];
            const breed = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[0].trim();
            const sex = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[2].trim();
            const age = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[4].trim();

            const petData = {
                petName,
                breed,
                sex,
                age,
                petId: pet.petId
                // pics
            };
            pets.push(petData);
            if (counter == arr.length) return cb(pets);
        })
    })


}

module.exports = {
    scrapePetLinks,
    scrapePets
}
