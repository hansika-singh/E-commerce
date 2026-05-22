const db = require("../config/db");

// GET ALL PRODUCTS
const getProducts = (req, res) => {
    let query = "SELECT * FROM products";
    const params = [];

    // CATEGORY FILTER
    if (req.query.category) {
        query += " WHERE category = ?";
        params.push(req.query.category);
    }

    // FEATURED FILTER
    if (req.query.featured === "true") {
        query += params.length ? " AND featured = 1" : " WHERE featured = 1";
    }

    query += " ORDER BY id DESC";

    db.query(query, params, (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }

        res.status(200).json({
            success: true,
            products: results
        });
    });
};

// GET SINGLE PRODUCT
const getSingleProduct = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    if (results.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        product: results[0]
    });
  });
};

// CREATE PRODUCT
const createProduct = (req, res) => {
  const { name, description, price, image, category, stock, featured } = req.body;

  // Basic validation
  if (!name || price === undefined) {
      return res.status(400).json({
          success: false,
          message: "Name and price are required"
      });
  }
  if (isNaN(price) || price <= 0) {
      return res.status(400).json({
          success: false,
          message: "Invalid product price"
      });
  }

  const query = `
    INSERT INTO products
    (name, description, price, image, category, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, description, price, image, category, stock || 0, featured ? 1 : 0], (error, result) => {
    if (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        productId: result.insertId
    });
  });
};

// UPDATE PRODUCT
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category, stock, featured } = req.body;

  if (!name || price === undefined) {
      return res.status(400).json({
          success: false,
          message: "Name and price are required"
      });
  }
  if (isNaN(price) || price <= 0) {
      return res.status(400).json({
          success: false,
          message: "Invalid product price"
      });
  }

  const query = `
    UPDATE products
    SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ?, featured = ?
    WHERE id = ?
  `;

  db.query(query, [name, description, price, image, category, stock || 0, featured ? 1 : 0, id], (error, result) => {
    if (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully"
    });
  });
};

// DELETE PRODUCT
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (error, result) => {
    if (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
  });
};

module.exports = {
    getProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
};