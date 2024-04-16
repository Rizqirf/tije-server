const pg = require("pg");
const { Client } = pg;

const config = {
  user: "postgres",
  host: "172.22.22.33",
  database: "transjakarta",
  password: "17agustus1945",
  port: 5432,
};

const getAllBus = async (req, res, next) => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query("SELECT * FROM vehiclelatestposition");

    res.status(200).json({ message: "Success", data: rows });
  } catch (error) {
    next(error);
  } finally {
    await client.end();
  }
};

module.exports = {
  getAllBus,
};
