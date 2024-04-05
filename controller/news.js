const { News } = require("../models");

const getAllNews = async (req, res, next) => {
  try {
    const news = await News.findAll();
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) {
      throw { name: "NOT_FOUND" };
    }
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
    const news = await News.findByPk(id);
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

    res.status(200).json({ message: "News updated" });
  } catch (error) {
    next(error);
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const news = await News.findByPk(id);
    if (!news) {
      throw { name: "NOT_FOUND" };
    }

    await news.update({
      deletedAt: new Date(),
      last_updated_by: userId,
    });

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
