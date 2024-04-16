const { Op } = require("sequelize");
const { BusStop } = require("../models");
const sequelize = require("sequelize");
const { setCache, getCache, deleteCache } = require("../helpers/redis");

const filterDecider = ({ search_by, is_operating }) => {
  let filter = {};
  if (search_by) {
    filter = {
      ...filter,
      [Op.or]: [
        { stop_name: { [Op.iLike]: `%${search_by}%` } },
        { district: { [Op.iLike]: `%${search_by}%` } },
      ],
    };
  }

  filter = {
    ...filter,
    is_operating: is_operating === false ? false : true,
  };

  return filter;
};

const getAllBusStop = async (req, res, next) => {
  try {
    const { limit, page, ...filters } = req.query;
    if (Object.keys(filters).length === 0) {
      let busStop = await getCache("busStop");
      if (busStop) {
        let data = JSON.parse(busStop);

        if (limit && page) {
          const start = (page - 1) * limit;
          const end = page * limit;
          data = data.slice(start, end);
        }

        res.status(200).json(data);
        return;
      }

      busStop = await BusStop.findAll();

      await setCache("busStop", JSON.stringify(busStop));
      res.status(200).json(busStop);
      return;
    } else {
      let opt = {
        where: filterDecider(filters),
      };

      if (limit && page) {
        opt = {
          ...opt,
          limit,
          offset: (page - 1) * limit,
        };
      }

      let busStop = await BusStop.findAll(opt);
      res.status(200).json(busStop);
    }
  } catch (error) {
    next(error);
  }
};

const getBusStopById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let busStop;
    let filter = {};

    if (isNaN(id) === false) {
      filter = { id: +id };
      busStop = await getCache(`busStop/${id}-*`);
    } else if (isNaN(id)) {
      filter = { stop_id: id };
      busStop = await getCache(`busStop/*-${id}`);
    } else {
      throw { name: "NOT_FOUND" };
    }

    if (busStop) {
      res.status(200).json(JSON.parse(busStop));
      return;
    }

    busStop = await BusStop.findOne({
      where: filter,
    });
    if (!busStop) {
      throw { name: "NOT_FOUND" };
    }

    await setCache(
      `busStop/${busStop.id}-${busStop.stop_id}`,
      JSON.stringify(busStop)
    );
    res.status(200).json(busStop);
  } catch (error) {
    next(error);
  }
};

const createBusStop = async (req, res, next) => {
  try {
    const {
      stop_id,
      stop_name,
      coordinates,
      bus_stop_type,
      shelter_type,
      district,
      city,
      latitude,
      longitude,
      route_count,
      routes,
      operational_routes,
      corridor_service,
      marker_type,
      is_operating,
      condition,
    } = req.body;

    const busStop = await BusStop.create({
      stop_id,
      stop_name,
      coordinates,
      bus_stop_type,
      shelter_type,
      district,
      city,
      latitude,
      longitude,
      route_count,
      routes,
      operational_routes,
      corridor_service,
      marker_type,
      is_operating,
      condition,
    });

    await setCache(
      `busStop/${busStop.id}-${busStop.stop_id}`,
      JSON.stringify(busStop)
    );
    await deleteCache("busStop");

    res.status(201).json(busStop);
  } catch (error) {
    next(error);
  }
};

const updateBusStop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      stop_id,
      stop_name,
      coordinates,
      bus_stop_type,
      shelter_type,
      district,
      city,
      latitude,
      longitude,
      route_count,
      routes,
      operational_routes,
      corridor_service,
      marker_type,
      is_operating,
      condition,
    } = req.body;

    const busStop = await BusStop.findOne({ where: { id } });
    if (!busStop) {
      throw { name: "NOT_FOUND" };
    }

    await busStop.update({
      stop_id,
      stop_name,
      coordinates,
      bus_stop_type,
      shelter_type,
      district,
      city,
      latitude,
      longitude,
      route_count,
      routes,
      operational_routes,
      corridor_service,
      marker_type,
      is_operating,
      condition,
    });

    await setCache(
      `busStop/${busStop.id}-${busStop.stop_id}`,
      JSON.stringify(busStop)
    );
    await deleteCache("busStop");

    res.status(200).json(busStop);
  } catch (error) {
    next(error);
  }
};

const deleteBusStop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const busStop = await BusStop.findOne({ where: { id } });
    if (!busStop) {
      throw { name: "NOT_FOUND" };
    }

    await busStop.update({ deletedAt: new Date() });
    await deleteCache(`busStop/${busStop.id}-${busStop.stop_id}`);
    await deleteCache("busStop");

    res.status(200).json({ message: "Bus stop deleted" });
  } catch (error) {
    next(error);
  }
};

const getNearestBusStop = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    const busStop = await BusStop.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`
            ),
            "distance",
          ],
        ],
      },
      where: {
        is_operating: true,
      },
      order: sequelize.literal("distance"),
      limit: 3,
    });

    busStop.forEach((e) => {
      e.dataValues.distance = e.dataValues.distance.toFixed(2) + " km";
    });
    res.status(200).json(busStop);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBusStop,
  getBusStopById,
  createBusStop,
  updateBusStop,
  deleteBusStop,
  getNearestBusStop,
};
