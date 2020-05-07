const axios = require('axios').default;
const cheerio = require('cheerio');

const domain = 'houstonspca.org';
const petListURI = `https://www.${domain}/adopt/available-pets/?type=Dog&pets-page=`;

/**
 * Recursive Function: Returns an array[objects] with scrapable links. Checks for "Next Pages"
 * @param {Function} cb Callback
 * @param {String} URI URI with list of pets
 * @param {Array} cheerioArr Array of cheerio Objects
 * @param {Number} page Page Number
 */
function scrapePetLinks(cb, URI = petListURI,cheerioArr = [], page = 1) {
    // console.log("Search Page:", `${URI}${page}`);
    // console.log('Page:', page);
    cheerioArr = [...cheerioArr];
    axios.get(`${URI}${page}`).then(response => {
        const $ = cheerio.load(response.data);
        if ($('.card__grid .pet-card').length > 0) { //Check for pets in search page
            cheerioArr.push($);
            page++;
            scrapePetLinks(cb, URI, cheerioArr, page)
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


/**
 * Main Function
 * @param {Array} petLinks An Array of pet links to scrape pet data
 * @param {Function} cb Callback Function
 */
function scrapePets(petLinks,cb){
    const pets = [];
    let counter = 0;

    petLinks.forEach((pet,i,arr) => {
        axios.get(pet.petURI).then(response => {
            counter++;
            const $ = cheerio.load(response.data);

            if ($('.img-s__content-col').length < 1) { return pets.push({ petURI: pet.petURI, status: "Inactive" }); }; //Checking that there is info in the page

            const petName = $('.img-s__content-col .title').text();
            let breed = "";
            let sex = "";
            let age = "";
            const imgsURI = [];

            const petFeatures = $('.img-s__content-col .pet__feature > div');

            petFeatures.each((i,feat)=>{
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

            const imgElements = $('.pet-slider-single').children();
            imgElements.each((i, elem) => {
                const style = $(elem).attr('style');
                imgsURI.push(style.slice(style.indexOf("http://"), style.indexOf(");")));
            })

            const petData = {
                petName,
                breed,
                sex,
                age,
                imgsURI,
                petId: pet.petId
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
