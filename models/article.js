module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("private", "public", "delete"),
        allowNull: true,
      },
      view: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    { tableName: "articles" }
  );

  Article.associate = (models) => {
    Article.belongsToMany(models.Category, {
      through: models.ArticleCategory,
      foreignKey: "article_id",
    });

    Article.belongsToMany(models.Keyword, {
      through: models.ArticleKeyword,
      foreignKey: "article_id",
    });

    Article.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Article;
};
