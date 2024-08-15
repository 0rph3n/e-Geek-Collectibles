// const URL = "http://localhost:5000/collectibles";
// const axios = require('axios');

const fs = require("fs");
const path = require("path");
const { Products } = require("../db");

const getAllProductsC = async (page = 1, perPage = 10) => {
  try {
    if (page === "all") {
      const allProducts = await Products.findAll();
      console.log("Productos obtenidos de la base de datos:", allProducts.length);
      return allProducts;
    }

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const totalProductsCount = await Products.count();

    if (totalProductsCount === 0) {
      const filePath = path.join(__dirname, "../../api/db.json");
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContent);

      if (!data.collectibles || !Array.isArray(data.collectibles)) {
        throw new Error("El archivo JSON no contiene un arreglo de 'collectibles'");
      }

      const apiProducts = data.collectibles.map((product) => {
        const {
          title,
          manufacturer,
          author,
          stock,
          price,
          image,
          available,
          description,
          category,
        } = product;

        return {
          title,
          manufacturer,
          author,
          stock,
          price,
          image,
          available,
          description,
          category,
        };
      });

      const insertedProducts = await Products.bulkCreate(apiProducts);
      console.log("Productos insertados en la base de datos:", insertedProducts.length);
      return insertedProducts.slice(startIndex, endIndex);
    }

    const productsDB = await Products.findAll({
      offset: startIndex,
      limit: perPage,
    });
    console.log("Productos obtenidos de la base de datos (paginados):", productsDB.length);
    return productsDB;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllProductsC,
};