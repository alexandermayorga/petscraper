const express = require('express');
const router = express.Router();

//DB Models
const Pet = require('../models/pet');

router.get('/search', async function (req, res, next) {
    const breed = decodeURI(req.query.breed).replace(/[.*+?^${}/()|[\]\\]/g, '\\$&');

    const size = parseInt(req.query.size) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const results = await Pet.find({
                            status: "Active",
                            breed: { $regex: '.*' + breed + '.*', $options: 'i' }
                        }).skip(offset).limit(size);
        const total = await Pet.countDocuments({
            status: "Active",
            breed: { $regex: '.*' + breed + '.*', $options: 'i' }
        })

        const pages = Math.ceil(total / size);

        const data = {
            total,
            pages,
            size,
            offset,
            count: results.length,
            results
        }

        return res.send(data)
        
    } catch (error) {
        // console.log(error)
        return res.status(404).json({ message: "Error! Please note this might be an issue with the server. Please try again." })
    }

});

router.get('/animals/', async function (req, res, next) {
    const size = parseInt(req.query.size) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const results = await Pet.find({ status: "Active" }).skip(offset).limit(size);
        const total = await Pet.countDocuments({ status: "Active" });
        const pages = Math.ceil(total / size);
        
        const data = {
            total,
            pages,
            size,
            offset,
            count: results.length,
            results
        }

        res.send(data)
    } catch (error) {
        res.status(404).json({ message: "Error! Please note this might be an issue with the server. Please try again." })
    }
});

router.get('/animals/sex/:sex', async function (req, res, next) {
    const size = parseInt(req.query.size) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const sex = req.params.sex;

    if (!sex) return res.end('Error. Argument "sex" missing from API call')

    try {
        let results, total, pages;
        if (sex == "male") {
            results = await Pet.find({ status: "Active", sex: { $not: /.*Female.*/ } }).skip(offset).limit(size)
            total = await Pet.countDocuments({ status: "Active", sex: { $not: /.*Female.*/ } });
            pages = Math.ceil(total / size);
        }
        if (sex == "female") {
            results = await Pet.find({ status: "Active", sex: /.*Female.*/ }).skip(offset).limit(size)
            total = await Pet.countDocuments({ status: "Active", sex: /.*Female.*/ }); 
            pages = Math.ceil(total / size);
        }
        
        const data = {
            total,
            pages,
            size,
            offset,
            count: results.length,
            results
        }

        res.send(data)
    } catch (error) {
        res.status(404).json({ message: "Error! Please note this might be an issue with the server. Please try again." })
    }
});


module.exports = router;
