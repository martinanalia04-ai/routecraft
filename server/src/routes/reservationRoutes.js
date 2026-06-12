const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reservationController');

router.get('/', ctrl.getReservations);
router.post('/', ctrl.createReservation);
router.delete('/:id', ctrl.deleteReservation);
module.exports = router;