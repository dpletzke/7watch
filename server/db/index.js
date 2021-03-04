const Datastore = require("nedb-promises");

const { NODE_ENV } = process.env.NODE_ENV;

const dbFactory = (fileName) => {
  const path = NODE_ENV === "dev" ? "." : app.getAppPath("userData");
  const filename = `${path}/data/${fileName}`;
  Datastore.create({
    filename,
    timestampData: true,
    autoload: true,
  });
};

// time, value, dvid

const db = {
  // requests/ min for an hour
  // requests/ hour for a week
  // requests/ day for a month
  min: dbFactory("min.db"), // 250 * 60 = 15,000
  hour: dbFactory("hour.db"), // 250 * 168 = 42,000
  day: dbFactory("day.db"), // 250 * 30 = 7,500
  messages: 
  // all messages with cvid and timestamp 

  // 
};
module.exports = db;

// ana 2/min
// patien mon 2mins