const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
      .select("product quantity _id")
      .populate("product", 'name')
      .exec()
      .then(orderRes => {
        res.json({
          count: orderRes.length,
          orders: orderRes.map(doc => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "GET",
                URL: "/orders/" + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
});

router.post("/", (req, res,) => {
    console.log(req.body.productId);
    Product.findById(req.body.productId)
      .then(product => {
        console.log(product);
        if (!product) {
          return res.status(404).json({
            message: "Product not Found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order Stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            URL: "http://localhost:8000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.json({
          error: err
        });
      });
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    URL: 'http://localhost:8000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:orderId", (req, res, next) => {
    Order.deleteMany({ _id: req.params.orderId })
      .exec()
      .then(result => {
          res.status(200).json({
              message: 'Order Deleted',
              request: {
                  type: 'POST',
                  URL: 'http://localhost:8000/orders',
                  body: { productId: "ID", quantity: "Number" }
              }
          });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
});

module.exports = router;