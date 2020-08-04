const express = require('express');
const router = express.Router();

//DB Models
const Pet = require('../models/pet');

const { aarfhouston, houstonspca } = require('../scrapers/scrapers')


/* GET home page. */
router.get('/1', function(req, res, next) {
  console.log(`--> aarfhouston: Scraping Links Started | ${new Date()}`)

  aarfhouston.scrapeLinks((err,petLinks)=>{
    if (err) return console.log(`--> aarfhouston: Scraping Links Error | ${new Date()}`, err)

    const newPetLinks = petLinks.map(async (petLink) =>{
      try {
        return await Pet.create(petLink)
      } catch (error) {
        console.log(`--> aarfhouston: Scraping Links Error | ${new Date()}`)
        console.log(error)
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

        Pet.find({ domain: aarfhouston.domain }, (err, pets) => {
          if (err) return res.send("Bork! Error...")

          res.send(pets)
        })

      })
      .catch(err => {
        // console.log(`--> aarfhouston: Scraping Links Error | ${new Date()}`)
        // console.log(err)
        res.end("Bork, Error!")
      })

  })

});


router.get('/2', function (req, res, next) {
  console.log(`--> houstonspca: Scraping Links Started | ${new Date()}`)
  
  houstonspca.scrapeLinks((err, petLinks) => {
    if (err) return res.end("There was an Error")

    const newPetLinks = petLinks.map(async (petLink) => {
      try {
        return await Pet.create(petLink)
      } catch (error) {
        // console.log(error)
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

});



module.exports = router;
