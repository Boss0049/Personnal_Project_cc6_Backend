module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "categories" }
  );

  Category.associate = (models) => {
    Category.belongsToMany(models.Article, {
      through: models.ArticleCategory,
      foreignKey: "category_id",
    });
  };

  return Category;
};
