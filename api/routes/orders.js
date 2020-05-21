const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .exec()
        .then( orderRes => {
            res.json({
                count: orderRes.length,
                orders: orderRes.map( doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            URL: '/orders/' + doc._id
                        }
                    }
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
   
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    order
        .save()
        .then( result => {
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
            })
        });

});

router.get("/:orderId", (req, res, next) => {

    // res.status(200).json({
    //     message: "Order details !",
    //     Orderid: req.params.orderId
    // });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order Deleted !",
    Orderid: req.params.orderId
  });
});

module.exports = router;