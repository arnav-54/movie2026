const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: __dirname + '/../.env' });
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clean up existing data
    await prisma.booking.deleteMany();
    await prisma.show.deleteMany();
    await prisma.screen.deleteMany();
    await prisma.theatre.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();

    console.log('Cleared existing data.');

    // Create Users
    const user = await prisma.user.create({
        data: {
            name: 'Demo User',
            email: 'demo@example.com',
            password: '$2a$10$YourHashedPasswordHere' // In real app use bcrypt
        }
    });

    // Create Theatres
    const theatre1 = await prisma.theatre.create({
        data: {
            name: 'PVR Icon: Infinity Mall',
            location: 'Mumbai',
            screens: {
                create: [
                    { name: 'Audi 1', rows: 8, cols: 12 },
                    { name: 'Audi 2 (IMAX)', rows: 10, cols: 15 },
                    { name: 'Audi 3 (Gold)', rows: 5, cols: 8 },
                ]
            }
        },
        include: { screens: true }
    });

    const theatre2 = await prisma.theatre.create({
        data: {
            name: 'INOX: R-City',
            location: 'Mumbai',
            screens: {
                create: [
                    { name: 'Screen 1', rows: 8, cols: 10 },
                    { name: 'Screen 2', rows: 8, cols: 10 },
                ]
            }
        },
        include: { screens: true }
    });

    // Create Movies
    const movies = [
        {
            tmdbId: 157336,
            title: 'Interstellar',
            description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
            poster: 'https://image.tmdb.org/t/p/w500/gEU2QniL6E77NI6lCU6MxlNBvIx.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
            duration: 169,
            rating: 8.6,
            genres: ['Adventure', 'Drama', 'Sci-Fi']
        },
        {
            tmdbId: 27205,
            title: 'Inception',
            description: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.',
            poster: 'https://image.tmdb.org/t/p/w500/9gk7admal4ZLvd9Zr59VDmy5uzM.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1jav7fwSaGj7vk0UA01.jpg',
            duration: 148,
            rating: 8.8,
            genres: ['Action', 'Sci-Fi', 'Thriller']
        },
        {
            tmdbId: 155,
            title: 'The Dark Knight',
            description: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
            poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
            duration: 152,
            rating: 9.0,
            genres: ['Action', 'Crime', 'Drama']
        },
        {
            tmdbId: 299536,
            title: 'Avengers: Infinity War',
            description: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.',
            poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg',
            duration: 149,
            rating: 8.3,
            genres: ['Action', 'Adventure', 'Sci-Fi']
        },
        {
            tmdbId: 19995,
            title: 'Avatar',
            description: 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
            poster: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/vL5LR6WdxWPjLPFRLe133jX9DbB.jpg',
            duration: 162,
            rating: 7.5,
            genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi']
        }
    ];

    const createdMovies = [];
    for (const m of movies) {
        const created = await prisma.movie.create({ data: m });
        createdMovies.push(created);
    }

    // Create Shows (Today and Tomorrow)
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(10, 0, 0, 0);
    const tomorrowStart = new Date(now); tomorrowStart.setDate(tomorrowStart.getDate() + 1); tomorrowStart.setHours(10, 0, 0, 0);

    const screens = [...theatre1.screens, ...theatre2.screens];

    // Schedule shows
    for (const movie of createdMovies) {
        // Randomly assign shows to screens
        const selectedScreens = screens.sort(() => 0.5 - Math.random()).slice(0, 3);

        for (const screen of selectedScreens) {
            // Today Show 1
            await prisma.show.create({
                data: {
                    movieId: movie.id,
                    screenId: screen.id,
                    startTime: new Date(todayStart.getTime() + Math.random() * 8 * 60 * 60 * 1000), // Random time between 10am and 6pm
                    price: 12 + Math.floor(Math.random() * 10) // Random price 12-22
                }
            });

            // Tomorrow Show
            await prisma.show.create({
                data: {
                    movieId: movie.id,
                    screenId: screen.id,
                    startTime: new Date(tomorrowStart.getTime() + Math.random() * 8 * 60 * 60 * 1000),
                    price: 12 + Math.floor(Math.random() * 10)
                }
            });
        }
    }

    console.log('Seeding completed successfully with rich data.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
