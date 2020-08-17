const { Op } = require("sequelize");
const db = require("../models");

const searchKeyword = async (req, res) => {
  const search = req.query.key;
  const targetKey = await db.Keyword.findAll({
    where: {
      key: {
        [Op.like]: `%${search}%`,
      },
    },
    include: [{ model: db.Article, include: { model: db.User } }],
  });

  let targetKeyArray = [];

  for (let key of targetKey) {
    targetKeyArray.push(...key.Articles);
  }

  res.status(200).send(targetKeyArray);
};

const searchCategory = async (req, res) => {
  const searchCategory = req.query.category;
  const targetCategory = await db.Category.findAll({
    where: { category: searchCategory },
    include: [{ model: db.Article }],
  });

  if (targetCategory) {
    let targetKeyArray = [];

    for (let key of targetCategory) {
      targetKeyArray.push(...key.Articles);
    }
    targetKeyArray = targetKeyArray.map((ele) => ele.dataValues.content);
    res.status(200).send(targetKeyArray);
  } else {
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = {
  searchKeyword,
  searchCategory,
};
