import { Op, Sequelize } from "sequelize";
import db from "../models";

import argon2 from "argon2";
import UserResponse from "../dtos/responses/user/UserResponse.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  const isEmailExisted = await db.User.findOne({
    where: { email },
  });
  if (isEmailExisted) {
    return res.status(409).json({
      message: "Email đã tồn tại",
    });
  }
  const hashedPassword = await argon2.hash(password);
  const user = await db.User.create({
    ...req.body,
    password: hashedPassword,
  });
  if (user) {
    return res.status(201).json({
      message: "Thêm mới người dùng thành công",
      data: new UserResponse(user),
    });
  } else {
    return res.status(500).json({
      message: "Xảy ra lỗi khi thêm người dùng",
    });
  }
};
export const getUsers = async (req, res) => {
  const { search = "", page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  const [users, totalusers] = await Promise.all([
    await db.User.findAll({
      where: whereClause,
      limit: parseInt(pageSize, 10),
      offset,
    }),
    await db.User.count({
      where: whereClause,
    }),
  ]);
  return res.status(200).json({
    message: "Lấy danh sách người dùng thành công",
    data: users.map((user) => new UserResponse(user)),
    current_page: parseInt(page),
    total_pages: Math.ceil(totalusers / pageSize),
    total: totalusers,
  });
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await db.User.findOne({
    where: { id },
  });
  if (user) {
    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  } else {
    return res.status(404).json({
      message: "Không tìm thấy người dùng",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await db.User.destroy({
    where: { id },
  });
  if (deleted) {
    return res.status(200).json({
      message: "Xoá người dùng thành công",
    });
  } else {
    return res.status(500).json({
      message: "Xoá người dùng thất bại",
    });
  }
};
