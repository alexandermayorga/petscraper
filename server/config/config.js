const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
        PORT: process.env.PORT
    },
    default: {
        SECRET: 'Gs5!ej772#@v!x',
        DATABASE: 'mongodb://localhost:27017/pet_scraper',
        PORT: 3000
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}

