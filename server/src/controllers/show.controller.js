const prisma = require('../config/db');

const createShow = async (req, res) => {
    try {
        const { movieId, screenId, startTime, price } = req.body;
        const show = await prisma.show.create({
            data: { movieId, screenId, startTime: new Date(startTime), price }
        });
        res.status(201).json(show);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getShowById = async (req, res) => {
    try {
        const show = await prisma.show.findUnique({
            where: { id: req.params.id },
            include: {
                movie: true,
                screen: {
                    include: { theatre: true }
                },
                bookings: true
            }
        });
        if (!show) return res.status(404).json({ message: 'Show not found' });

        const bookedSeats = show.bookings.flatMap(b => b.status === "CONFIRMED" ? b.seats : []);

        // Remove bookings from response to keep it clean, just send bookedSeats
        const { bookings, ...showData } = show;

        res.json({ ...showData, bookedSeats });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { createShow, getShowById };
