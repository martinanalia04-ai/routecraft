const service = require('../services/tripsService');

exports.getReservations = (req, res) => res.status(200).json(service.findAll());
exports.createReservation = (req, res) => res.status(201).json(service.create(req.body));
exports.deleteReservation = (req, res) => {
    service.delete(req.params.id);
    res.status(200).json({ message: "OK" });
};