module.exports = (sequelize, DataTypes) => {
  const Article_Category = sequelize.define(
    "ArticleCategory",
    {
      article_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "articles_categories" }
  );

  return Article_Category;
};
