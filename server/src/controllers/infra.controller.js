const prisma = require('../config/db');

const createTheatre = async (req, res) => {
    try {
        const theatre = await prisma.theatre.create({ data: req.body });
        res.status(201).json(theatre);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const createScreen = async (req, res) => {
    try {
        const screen = await prisma.screen.create({ data: req.body });
        res.status(201).json(screen);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getTheatres = async (req, res) => {
    try {
        const theatres = await prisma.theatre.findMany({ include: { screens: true } });
        res.json(theatres);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { createTheatre, createScreen, getTheatres };
