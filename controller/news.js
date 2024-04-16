const { setCache, getCache, deleteCache } = require("../helpers/redis");
const { News } = require("../models");

const getAllNews = async (req, res, next) => {
  try {
    let news = await getCache("news");
    if (news) {
      res.status(200).json(JSON.parse(news));
      return;
    }

    news = await News.findAll({ where: { deletedAt: null } });
    await setCache("news", JSON.stringify(news));

    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let news = await getCache(`news/${id}`);
    if (news) {
      res.status(200).json(JSON.parse(news));
      return;
    }

    news = await News.findOne({ where: { id, deletedAt: null } });
    if (!news) {
      throw { name: "NOT_FOUND" };
    }
    await setCache(`news/${id}`, JSON.stringify(news));
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

const createNews = async (req, res, next) => {
  try {
    const { title, content, image, is_active, is_highlight } = req.body;
    const { id } = req.user;

    await validateHighlight(is_highlight, is_active);

    const news = await News.create({
      title,
      content,
      image,
      is_active,
      is_highlight,
      last_updated_by: id,
    });

    if (!!is_active) {
      await setCache(`news/${news.id}`, JSON.stringify(news));
    }
    await deleteCache("news");

    res.status(201).json(news);
  } catch (error) {
    next(error);
  }
};

const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, image, is_active, is_highlight } = req.body;

    await validateHighlight(is_highlight, is_active);

    const { id: userId } = req.user;
    const news = await News.findOne({ where: { id, deletedAt: null } });
    if (!news) {
      throw { name: "NOT_FOUND" };
    }

    await news.update({
      title,
      content,
      image,
      is_active,
      is_highlight,
      last_updated_by: userId,
    });

    if (!!is_active) {
      await setCache(`news/${news.id}`, JSON.stringify(news));
    }
    await deleteCache("news");

    res.status(200).json({ message: "News updated" });
  } catch (error) {
    next(error);
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const news = await News.findOne({ where: { id, deletedAt: null } });
    if (!news) {
      throw { name: "NOT_FOUND" };
    }

    await news.update({
      deletedAt: new Date(),
      last_updated_by: userId,
    });

    await deleteNews(`news/${news.id}`);
    await deleteCache("news");

    res.status(200).json({ message: "News deleted" });
  } catch (error) {
    next(error);
  }
};

const validateHighlight = async (is_highlight, is_active) => {
  if (!!is_highlight && !is_active) {
    throw {
      name: "BAD_REQUEST",
      message: "Cannot set is_highlight without is_active",
    };
  } else if (!is_highlight) {
    return;
  }

  const count = await News.count({
    where: { is_highlight: true, is_active: true, deletedAt: null },
  });

  if (count >= 3) {
    throw { name: "HIGHLIGHT_LIMIT" };
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
