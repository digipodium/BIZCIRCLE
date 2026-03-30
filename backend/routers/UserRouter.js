const express = require('express');

const router = express.Router();

const Model = require('../models/userModel');
<<<<<<< HEAD

=======
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
const jwt = require('jsonwebtoken');
require('dotenv').config();

// route or endpoint
<<<<<<< HEAD
router.post('/add', (req, res) => {
=======
router.get('/add', (req, res) => {
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae

    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
<<<<<<< HEAD
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

=======
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
});

// getall
router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
<<<<<<< HEAD
        })
        .catch((err) => {
=======
        }).catch((err) => {
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
            console.log(err);
            res.status(500).json(err);
        });
});

<<<<<<< HEAD
//getbyemail
=======
// getbyemail
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
// : denotes url parameter
router.get('/getbyemail/:email', (req, res) => {
    Model.findOne({ email: req.params.email })
        .then((result) => {
            res.status(200).json(result);
<<<<<<< HEAD
        })
        .catch((err) => {
=======
        }).catch((err) => {
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
            console.log(err);
            res.status(500).json(err);
        });
});

// getbycity
router.get('/getbycity/:city', (req, res) => {
    Model.find({ city: req.params.city })
        .then((result) => {
            res.status(200).json(result);
<<<<<<< HEAD
        })
        .catch((err) => {
=======
        }).catch((err) => {
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
            console.log(err);
            res.status(500).json(err);
        });
});

<<<<<<< HEAD

// getbyid
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
// delete
router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
=======
// getbyid
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
        
    });
});

// delete
router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
        
    });
});

>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
// update
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result);
<<<<<<< HEAD
        })
        .catch((err) => {
=======
        }).catch((err) => {
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
<<<<<<< HEAD

    Model.findOne({ email, password })
        .then((result) => {

            // if login is successful
            if (result) {

                const { _id, email } = result;

                jwt.sign(
                    { _id, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json(err);
                        } else {
                            res.status(200).json({ token });
                        }
                    }
                )

            } else {
                //if login fails
                res.status(403).json({ message: 'Invalid credentials' });
            }


=======
    
    Model.findOne({ email, password })
        .then((result) => {
            if (result) {

                const { _id, name, email } = result;

                jwt.sign(
                    { _id, name, email }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '1h' }, 
                    (err, token) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                    } else {
                        res.status(200).json({ token });
                    }
                }

            )

            }else{
                res.status(401).json({ message: 'Invalid credentials' });

            }

>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
<<<<<<< HEAD


});

=======
            
    });
>>>>>>> d479f5064503739f8a36ad6b58a85bf43a7fc6ae

module.exports = router;