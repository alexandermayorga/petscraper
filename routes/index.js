const express = require('express');
const router = express.Router();

//DB Models
const Pet = require('../models/pet');

const { aarfhouston, houstonspca } = require('../scrapers/scrapers')


/* GET home page. */
router.get('/1', function(req, res, next) {

  aarfhouston.scrapeLinks((err,petLinks)=>{
    if(err) return res.end("There was an Error")

    const newPetLinks = petLinks.map(async (petLink) =>{
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
          console.log("--> New New Links to Add")
        }

        Pet.find({ domain: aarfhouston.domain }, (err, pets) => {
          if (err) return res.send("Bork! Error...")

          res.send(pets)
        })

      })
      .catch(err => res.end("Bork, Error!"))

  })

});


router.get('/2', function (req, res, next) {
  
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
          console.log("--> New New Links to Add")
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
