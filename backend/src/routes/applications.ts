import {Router, Request, Response} from 'express'
const router = Router();


//TODO: Pull info

// Define a route to get all applications
router.get('/', (req, res) => {
    res.send('Get all applications');
});

// Define a route to get a specific application by ID
router.get('/:applId', (req, res) => {
    const applId = req.params.applId;
    res.send(`Get application with ID: ${applId}`);
});

module.exports = router;