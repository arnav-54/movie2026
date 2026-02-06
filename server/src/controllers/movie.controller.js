const prisma = require('../config/db');

// Get all movies
const getMovies = async (req, res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single movie with shows
const getMovieById = async (req, res) => {
    try {
        const movie = await prisma.movie.findUnique({
            where: { id: req.params.id },
            include: {
                shows: {
                    include: {
                        screen: {
                            include: { theatre: true }
                        }
                    }
                }
            }
        });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createMovie = async (req, res) => {
    // Basic implementation for manual addition
    try {
        const movie = await prisma.movie.create({
            data: req.body
        });
        res.status(201).json(movie);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { getMovies, getMovieById, createMovie };
