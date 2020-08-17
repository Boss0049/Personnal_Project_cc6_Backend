const db = require("../models");
const { Op } = require("sequelize");

const getArticleAll = async (req, res) => {
  const searchCategory = req.query.category;
  // const pageSize = 1;
  // const page = Number(req.query.pageSize);
  // const offset = (page - 1) * pageSize;

  const getAll = await db.Category.findAll({
    // offset: 1,
    // limit: 3,
    where: { category: searchCategory },
    order: [[db.Article, "id", "DESC"]],
    include: [
      {
        model: db.Article,
        where: { status: "Public" },
        order: [["id", "DESC"]],
        include: {
          model: db.User,
          attributes: ["id", "name", "surname"],
        },
      },
    ],
  });

  // console.log(getAll);

  res.status(200).send({ message: getAll });
};

const getArticleOne = async (req, res) => {
  const targetId = await db.Article.findOne({ where: { id: req.params.id } });
  if (targetId) {
    res.status(200).send(targetId);
  } else {
    res.status(404).send({ message: "Something wrong" });
  }
};

const getArticlePopular = async (req, res) => {
  const targetId = await db.Article.findAll({
    limit: 5,
    order: [["view", "DESC"]],
    include: {
      model: db.User,
      attributes: ["id", "name", "surname"],
    },
  });
  if (targetId) {
    res.status(200).send(targetId);
  } else {
    res.status(404).send({ message: "Something wrong" });
  }
};

const getArticleOwner = async (req, res) => {
  const targetId = await db.Article.findAll({
    where: { user_id: req.user.id },
  });
  if (targetId) {
    res.status(200).send(targetId);
  } else {
    res.status(404).send({ message: "Something wrong" });
  }
};

const uploadImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send({ message: "No files were uploaded." });
  }

  // req.file.{{ชื่อ field ใน Postman นะจ๊ะ}}
  let image = req.files.image;
  let fileExtension = image.name.split(".").slice(-1)[0];
  let filePath = `/${new Date().getTime()}.${fileExtension}`;

  image.mv(`images/${filePath}`);

  res.status(201).send({
    success: 1,
    file: {
      url: `http://localhost:8000${filePath}`,
    },
  });
};

const createArticle = async (req, res) => {
  // console.log("object");
  const { content, status, keywords, category, user_id } = req.body;

  let articleKeyword = [];
  let articleCategory = [];

  const newArticle = await db.Article.create({
    content,
    status,
    user_id: req.user.id,
  });

  const categoryList = category.split(".");
  const findAllCategory = await db.Category.findAll({
    where: { category: { [Op.in]: categoryList } },
  });
  // console.log(findAllCategory);

  for (categoryOne of findAllCategory) {
    // console.log(a);
    articleCategory.push({
      article_id: newArticle.id,
      category_id: categoryOne.id,
    });
  }

  await db.ArticleCategory.bulkCreate(articleCategory);

  // console.log(newArticle);

  let keywordList = keywords.split("#");
  keywordList = keywordList.slice(1, keywordList.length);
  console.log(keywordList);

  const getKeywords = await db.Keyword.findAll({
    where: { key: { [Op.in]: keywordList } },
  });

  // console.log(getKeywords);

  addKeywordIds(getKeywords, articleKeyword, newArticle.id);
  // console.log(getKeywords);

  let existingKeywords = getKeywords.map((ele) => ele.key);
  let newKeywords = [];

  for (let keyword of keywordList) {
    // console.log(`key:${keyword}`);
    if (!existingKeywords.includes(keyword)) {
      newKeywords.push({ key: keyword });
    }
  }

  const createdKeywords = await db.Keyword.bulkCreate(newKeywords);
  // console.log(createdKeywords);

  addKeywordIds(createdKeywords, articleKeyword, newArticle.id);

  // console.log(articleKeyword);

  const newRelations = await db.ArticleKeyword.bulkCreate(articleKeyword);

  res.status(200).send(newRelations);
};

const addKeywordIds = (keywordObj, relationObj, articleId) => {
  for (let keyword of keywordObj) {
    // console.log("gg" + keyword);
    relationObj.push({
      article_id: articleId,
      keyword_id: keyword.id,
    });
  }
};

const deleteArticle = async (req, res) => {
  const targetId = await db.Article.findOne({
    where: { id: req.params.id, user_id: req.user.id },
  });

  if (targetId) {
    await targetId.destroy();
    await db.ArticleKeyword.destroy({ where: { article_id: targetId.id } });
    await db.ArticleCategory.destroy({ where: { article_id: targetId.id } });

    res.status(204).send();
  } else {
    res.status(401).send({ message: "Something wrong" });
  }
};

const updateArticle = async (req, res) => {
  console.log(req.params.id);
  const targetId = await db.Article.findOne({ where: { id: req.params.id } });

  if (!targetId) {
    res.status(400).send({ message: "Something wrong" });
  } else {
    const { content, status, keywords, category } = req.body;

    let articleKeyword = [];

    const updateArticle = await targetId.update({
      content: content.length === 0 ? targetId.content : content,
    });

    // const categoryList = category.split(".");
    // const findAllCategory = await db.Category.findAll({
    //   where: { category: { [Op.in]: categoryList } },
    // });

    // for (categoryOne of findAllCategory) {
    //   // console.log(a);
    //   articleCategory.push({
    //     article_id: newArticle.id,
    //     category_id: categoryOne.id,
    //   });
    // }

    // const checkArticleCategory = await db.ArticleCategory.findAll({
    //   where: { article_id: newArticle.id },
    // });
    // if (checkArticleCategory && category) {
    //   await db.checkArticleCategory.destroy();
    // }
    // await db.ArticleCategory.bulkCreate(articleCategory);

    // let keywordList = keywords.split("#");
    // keywordList = keywordList.slice(1, keywordList.length);

    // const getKeywords = await db.Keyword.findAll({
    //   where: { key: { [Op.in]: keywordList } },
    // });

    // // console.log(getKeywords);

    // addKeywordIds(getKeywords, articleKeyword, newArticle.id);
    // // console.log(getKeywords);

    // let existingKeywords = getKeywords.map((ele) => ele.key);
    // let newKeywords = [];

    // for (let keyword of keywordList) {
    //   // console.log(`key:${keyword}`);
    //   if (!existingKeywords.includes(keyword)) {
    //     newKeywords.push({ key: keyword });
    //   }
    // }

    // const createdKeywords = await db.Keyword.bulkCreate(newKeywords);
    // // console.log(createdKeywords);

    // addKeywordIds(createdKeywords, articleKeyword, newArticle.id);

    // // console.log(articleKeyword);
    // const ArticleKeyword = await db.ArticleKeyword.findAll({
    //   where: { article_id: newArticle.id },
    // });
    // if (ArticleKeyword && keyword) {
    //   await db.ArticleKeyword.destroy();
    // }

    // const newRelations = await db.ArticleKeyword.bulkCreate(articleKeyword);

    res.status(200).send({ message: updateArticle });
  }
};

const updateView = async (req, res) => {
  const targetId = req.params.id;
  const findTarget = await db.Article.findOne({ where: { id: targetId } });

  if (findTarget) {
    await findTarget.update({
      ...findTarget,
      view: findTarget.view + 1,
    });
    res.status(200).send();
  } else {
    res.status(404).send({ message: "Not Found" });
  }
};

const statusPrivate = async (req, res) => {
  const targetId = req.params.id;
  const { status } = req.body;
  const findTarget = await db.Article.findOne({ where: { id: targetId } });

  if (findTarget) {
    await findTarget.update({
      ...findTarget,
      status,
    });
    res.status(200).send();
  } else {
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = {
  getArticleAll,
  getArticleOne,
  getArticleOwner,
  createArticle,
  deleteArticle,
  updateArticle,
  uploadImage,
  updateView,
  getArticlePopular,
  statusPrivate,
};
