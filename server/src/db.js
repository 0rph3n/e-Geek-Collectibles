require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_DEPLOY } = process.env;

// const sequelize = new Sequelize(DB_DEPLOY, {
//   logging: false,
//   native: false,
// });

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false,
    native: false,
  }
);

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);


const { Orders, Products, Review, Users, Cart } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

/* Relacion entre Productos y Usuarios Favoritos*/
Products.belongsToMany(Users, {
  through: "user_favorites",
  timestamps: false,
});
Users.belongsToMany(Products, {
  through: "user_favorites",
  timestamps: false,
});

/*Relación entre Productos y Usuarios Carrito*/
Products.belongsToMany(Users, {
  through: Cart,
  timestamps: false,
  foreignKey: "productId",
});
Users.belongsToMany(Products, {
  through: Cart,
  timestamps: false,
  foreignKey: "userId",
});

/* Relacion entre Productos y Reviews */
Products.belongsToMany(Review, {
  through: "products_reviews",
  timestamps: false,
});
Review.belongsToMany(Products, {
  through: "products_reviews",
  timestamps: false,
});

/* Relacion entre usuarios y ordenes */
Users.belongsToMany(Orders, { through: "users_orders", timestamps: false });
Orders.belongsToMany(Users, { through: "users_orders", timestamps: false }); //Consultar

 Users.belongsToMany(Review, { through: "users_reviews", timestamps: false });
 Review.belongsToMany(Users, { through: "users_reviews", timestamps: false });







module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
