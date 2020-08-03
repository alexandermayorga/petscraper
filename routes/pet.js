var express = require('express');
var router = express.Router();

//DB Models
const Pet = require('../models/pet');

const { aarfhouston, houstonspca } = require('../scrapers/scrapers')

/* GET users listing. */
router.get('/1', function(req, res, next) {
  console.log(`--> aarfhouston: Scraping Pets Started | ${new Date()}`)
  aarfhouston.scrapePets((err, petsData)=>{
    if (err) return console.log(`--> aarfhouston: Scraping Pets Error | ${new Date()}`, err)

    const newPetsData = petsData.map(async petData => {
      try {
        return await Pet.findOneAndUpdate({ petUUID: petData.petUUID }, petData, {new: true})
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
});


router.get('/2', function (req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
