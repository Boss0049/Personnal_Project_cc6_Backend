module.exports = (sequelize, DataTypes) => {
  const Article_Keyword = sequelize.define(
    "ArticleKeyword",
    {
      article_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keyword_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "articles_keywords" }
  );

  return Article_Keyword;
};
