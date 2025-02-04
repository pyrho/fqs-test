# Database
Running `docker-compose up` will spin up a PostgreSQL 17 server in a container,
exposing the server on port `54321`, user name and password can be found in the
`docker-compose.yml` file.

Running `npm run prisma:migrate` should setup the database with all the tables
in the schema.

`npm run scripts:migrate` will run the migration script to import the old
dataset into the new schema.

`nmp run scripts:mock-data` will populate the database will fake data.
