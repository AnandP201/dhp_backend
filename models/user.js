"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Organization, {
        as: "organization",
        foreignKey: "orgId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      middleName: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      iamId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  
  return User;
};
