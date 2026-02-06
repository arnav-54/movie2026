const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Create Theatre
    const theatre = await prisma.theatre.create({
        data: {
            name: 'Grand Cinema',
            location: 'Downtown',
            screens: {
                create: [
                    { name: 'Audi 1', rows: 8, cols: 10 },
                    { name: 'Audi 2', rows: 8, cols: 12 },
                ]
            }
        },
        include: { screens: true }
    });

    const screen1 = theatre.screens[0];

    // Create Movie
    const movie = await prisma.movie.create({
        data: {
            tmdbId: 550,
            title: 'Fight Club',
            description: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
            poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7Qf4n6a8MQp.jpg',
            duration: 139,
            rating: 8.4,
            genres: ['Drama', 'Thriller']
        }
    });

    const movie2 = await prisma.movie.create({
        data: {
            tmdbId: 157336,
            title: 'Interstellar',
            description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
            poster: 'https://image.tmdb.org/t/p/w500/gEU2QniL6E77NI6lCU6MxlNBvIx.jpg',
            duration: 169,
            rating: 8.4,
            genres: ['Adventure', 'Drama', 'Science Fiction']
        }
    });

    // Create Shows
    await prisma.show.create({
        data: {
            movieId: movie.id,
            screenId: screen1.id,
            startTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // Tomorrow
            price: 12.5
        }
    });

    await prisma.show.create({
        data: {
            movieId: movie2.id,
            screenId: screen1.id,
            startTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 25), // Tomorrow + 1h
            price: 15.0
        }
    });

    console.log('Seeding completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
