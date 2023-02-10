'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Patient.hasMany(models.PatientActivity, {
        foreignKey: 'patientId',
      })
      Patient.belongsTo(models.Organization, {
        foreignKey: 'orgId',
        onDelete: 'CASCADE'
      })
    }
  }
  Patient.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.FLOAT,
    height: DataTypes.FLOAT,
    heightUom: DataTypes.STRING,
    weight: DataTypes.FLOAT,
    weightUom: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Patient',
  })
  return Patient
}
