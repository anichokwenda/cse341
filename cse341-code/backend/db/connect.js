const { MongoClient } = require('mongodb');
require('dotenv').config();

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      // FORCE IT TO USE cse341 NO MATTER WHAT .env SAYS
      database = client.db('cse341'); 
      console.log('Connected to MongoDB');
      console.log('Using DB:', database.databaseName); // This will confirm
      callback(null, database);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

const getDb = () => {
  if (!database) {
    throw Error('Db not initialized');
  }
  return database;
};

module.exports = { initDb, getDb };