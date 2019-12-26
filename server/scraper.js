const axios = require('axios').default;
const cheerio = require('cheerio');

function searchPets(url, pageNum, cb, petsArr = []) {
    fetchURL(url, pageNum).then(response => {
        // console.log(response.status)
        petsArr = [...petsArr,...getPetList(response.data)];

        //Check if there are more pages to crawl
        fetchURL(url, pageNum+1).then(response =>{
            const $ = cheerio.load(response.data);
            if ($('.browse').length > 0) {
                //There is another page to crawl
                searchPets(url, pageNum + 1, cb, petsArr)
            }else{
                cb(petsArr)
            }
        })
    })
}

//Fetch the data
function fetchURL(url,pageNum){
    return axios.get(`${url}${pageNum}`);
}    

//Returns array of pet objects 
function getPetList(body) {
    const $ = cheerio.load(body)

    const pets = [];
    $('.browse').each(function (i, elem) {
        const $elem = $(elem); //Current Element
        const $img = $elem.find('.animalimg');
        const $name = $elem.find('.browseInfo a').first();
        
        const $petId = $elem.find('.browseInfo a').first().attr('href').split('AnimalID=')[1];

        const pet = {
            "image": $img.attr('src'),
            "name": $name.text(),
            "petId": $petId
        }
        pets.push(pet);
    });
    // console.log(pets)
    return pets;
}

module.exports = {
    searchPets
}
