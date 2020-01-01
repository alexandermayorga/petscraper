const axios = require('axios').default;
const cheerio = require('cheerio');

const domain = 'houstonspca.org';
const petListURI = `https://www.${domain}/adopt/available-pets/?type=Dog&pets-page=`;

//Main Function - Returns an array[objects] with scrapable links

function scrapePetLinks(cb, URI = petListURI,cheerioArr = [], count = 1) {
    //console.log('Page:', count);
    cheerioArr = [...cheerioArr];
    fetchURL(URI).then(response => {
        const $ = cheerio.load(response.data);
        //console.log('pets found: ' + $('.card__grid .pet-card').length)
        if ($('.card__grid .pet-card').length > 0) {
            cheerioArr.push($);
            scrapePetLinks(cb, `${URI}${count + 1}`, cheerioArr, count + 1)
        } else {
            //console.log('Done Checking Next Pages!')
            //console.log(cheerioArr);

            // cheerioArr.reduce(function (total, currentValue, currentIndex, arr) { }, initialValue)
            const petList = cheerioArr.reduce((sum, cheerioObj) => {
                total = [...sum, ...getPetLinkList(cheerioObj, 'cheerio')];
                return total;
            }, []);

            return cb(petList);

        }
    })
}
//scrapePetLinks((pets) => console.log('Pets from scrapePetLinks',pets));

//Fetch the data: gets the HTML of the provided URI
function fetchURL(URI){
    return axios.get(URI);
}

//Returns array of pet objects 
function getPetLinkList(HTMLbody, bodyFormat = 'html') {
    const $ = (bodyFormat != "cheerio" ? cheerio.load(HTMLbody) : HTMLbody );

    const list = $('#main .pets__grid');
    const pets = [];

    list.find('.card__grid .pet-card').each((i, card) => {
        const petURI = $(card).attr('href');
        let petId = petURI.split('pet=')[1];
        // if (petId.indexOf('?')) petId = petId.split('?')[0]; // just in case they add any other params in the URL

        const pet = {
            petURI: `https://www.${domain}${petURI}`,
            domain,
            petId
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

            if ($('#animalDetailsAbout').length < 1) { return }; //Checking that there is info in the page

            const petName = $('#layoutMainContent .pageCenterTitle').html().split("&apos;")[0];
            const breed = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[0].trim();
            const sex = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[2].trim();
            const age = $('#layoutMainContent .pageCenterTitle + p').text().split(':')[4].trim();

            const petData = {
                petName,
                breed,
                sex,
                age,
                petId: pet.petId,
                petURI: pet.petURI,
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
