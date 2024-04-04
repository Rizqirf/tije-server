const { User } = require("../models");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      throw { name: "NOT_FOUND" };
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      throw { name: "NOT_FOUND" };
    }
    await User.update(
      {
        deletedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      throw { name: "NOT_FOUND" };
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) {
      const isExist = await User.findOne({
        where: {
          email,
        },
      });
      if (isExist) {
        throw { name: "EMAIL_EXIST" };
      }
      user.email = email;
      user.is_verified = false;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
