require("dotenv").config();
const { MongoClient } = require("mongodb");

function required(name) {
  const v = process.env[name];

  if (!v) throw new Error(`Missing .env var: ${name}`);
  return v;
}

async function mongoConnect(callback) {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${required("MONGO_USER")}:${required(
        "MONGO_PASSWORD"
      )}@nodejs-course-s12.dktw6kd.mongodb.net/?retryWrites=true&w=majority&appName=NodeJS-Course-S12`
    );
    return callback(client);
  } catch (error) {
    throw new Error(
      "An error occured whilst trying to connect to Mongo Datase:",
      error
    );
  }
}

module.exports = mongoConnect;

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   required("DB_NAME"),
//   required("DB_USER"),
//   required("DB_PASSWORD"),
//   {
//     dialect: "mysql",
//     host: required("DB_HOST"),
//     port: Number(required("DB_PORT")),
//   }
// );

// module.exports = sequelize;
