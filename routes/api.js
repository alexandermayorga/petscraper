const express = require('express');
const router = express.Router();

//DB Models
const Pet = require('../models/pet');

router.get('/pets', async function (req, res, next) {
    try {
        const pets = await Pet.find({status: "Active"});
        res.send(pets)
    } catch (error) {
        res.status(404).json({message: "Error! Please note this might be an issue with the server. Please try again."})
    }
});


router.get('/pets/sex/:sex', async function (req, res, next) {
    const sex = req.params.sex;

    try {
        if (sex == "male") {
            const pets = await Pet.find({ status: "Active", sex: { $not: /.*Female.*/ } })
            return res.send(pets)
        }
        if (sex == "female") {
            const pets = await Pet.find({ status: "Active", sex: /.*Female.*/ })
            return res.send(pets)
        }

        return res.status(404).end('Incorrect Search Term parameter. Please check API guide for more info')
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: "Error! Please note this might be an issue with the server. Please try again." })
    }

});

router.get('/search/breed/:breed', async function (req, res, next) {
    const sex = req.params.sex;

    try {
        if (sex == "male") {
            const pets = await Pet.find({ status: "Active", sex: { $not: /.*Female.*/ } })
            return res.send(pets)
        }
        if (sex == "female") {
            const pets = await Pet.find({ status: "Active", sex: /.*Female.*/ })
            return res.send(pets)
        }

        return res.status(404).end('Incorrect Search Term parameter. Please check API guide for more info')
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: "Error! Please note this might be an issue with the server. Please try again." })
    }

});


module.exports = router;
