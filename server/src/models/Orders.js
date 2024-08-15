const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Orders",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Accepted",
      },
      creationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      hooks: {
        beforeCreate: (order) => {
          if (!order.creationDate) {
            const today = new Date();
            order.creationDate = today.toLocaleDateString("en-CA");
          }
        },
      },
    }
  );
};
