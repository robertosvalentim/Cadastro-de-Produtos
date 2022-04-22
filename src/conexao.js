const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '482613',
        database: 'exercicio_18_04_2022'
    }
});

module.exports = knex;

