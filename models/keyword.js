module.exports = (sequelize, DataTypes) => {
  const Keyword = sequelize.define("Keyword", {
    key: DataTypes.STRING,
  });
  Keyword.associate = (model) => {
    Keyword.belongsToMany(model.Article, {
      through: model.ArticleKeyword,
      foreignKey: "keyword_id",
    });
  };
  return Keyword;
};
