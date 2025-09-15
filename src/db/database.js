require("dotenv").config();
const { MongoClient } = require("mongodb");

function required(name) {
  const v = process.env[name];

  if (!v) throw new Error(`Missing .env var: ${name}`);
  return v;
}

let _db;
let _client;

function buildAtlasUri() {
  const user = required("MONGO_USER");
  const pwd = required("MONGO_PASSWORD");
  return `mongodb+srv://${user}:${pwd}@nodejs-course-s12.dktw6kd.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeJS-Course-S12`;
}

// * connecting to the 'shop' database
async function mongoConnect(callback) {
  try {
    let uri;
    if (process.env.USE_MONGODB_ATLAS === "true") uri = buildAtlasUri();
    else uri = process.env.MONGODB_URI;

    _client = new MongoClient(uri);
    await _client.connect();

    _db = _client.db() || _client.db("shop");

    if (typeof callback === "function") return callback();
    return;
  } catch (error) {
    throw new Error(
      "An error occured whilst trying to connect to MongoDB:",
      error
    );
  }
}

const getDb = () => {
  if (_db) return _db;
  throw new Error("No database found!");
};

const close = async () => {
  if (_client) await _client.close();
};

module.exports = { mongoConnect, getDb, close };
