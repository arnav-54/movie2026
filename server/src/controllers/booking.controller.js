const prisma = require('../config/db');

const createBooking = async (req, res) => {
    const { showId, seats, totalPrice } = req.body;
    const userId = req.user.id;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const existingBookings = await tx.booking.findMany({
                where: {
                    showId,
                    status: 'CONFIRMED'
                }
            });

            const allTakenSeats = existingBookings.flatMap(b => b.seats);
            const isDoubleBooked = seats.some(seat => allTakenSeats.includes(seat));

            if (isDoubleBooked) {
                throw new Error('Some seats are already booked');
            }

            const booking = await tx.booking.create({
                data: {
                    userId,
                    showId,
                    seats,
                    totalPrice,
                    status: 'CONFIRMED'
                }
            });

            return booking;
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: { show: { include: { movie: true, screen: { include: { theatre: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createBooking, getUserBookings };
