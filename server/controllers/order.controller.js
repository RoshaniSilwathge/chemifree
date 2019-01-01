import {Order, CartItem} from '../models/order.model'
import Product from '../models/product.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'

const create = (req, res) => {
  req.body.order.user = req.profile
  const order = new Order(req.body.order)
  order.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(200).json(result)
  })
}

const listByShop = (req, res) => {
  Order.find({"products.shop": req.shop._id})
  .populate({path: 'products.product', select: '_id name price'})
  .sort('-created')
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(orders)
  })
}

const update = (req, res) => {
  Order.update({'products._id':req.body.cartItemId}, {'$set': {
        'products.$.status': req.body.status
    }}, (err, order) => {
      if (err) {
        return res.status(400).send({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(order)
    })
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = (req, res, next, id) => {
  Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec((err, order) => {
    if (err || !order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  })
}

const listByUser = (req, res) => {
  Order.find({ "user": req.profile._id })
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              })
            }
            res.json(orders)
        })
}

const findOrdersPlacedWithinToday = (req, res) => {
  var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,59,59,999);

  Order.find({"products.shop": req.shop._id,"created":{$gte: start, $lt: end}},{ 'products.$': 1,'user':1 })
  .populate({path: 'products.product', select: '_id price'})
  .sort('-created')
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(orders)
  })
}

const findOrdersPlacedWithinThisYear = (req, res) => {
  var start = new Date(new Date().getFullYear(), 0, 1);
  start.setHours(0,0,0,0);

  var end = new Date(new Date().getFullYear(), 11, 31);
  end.setHours(23,59,59,999);

  Order.aggregate([
    {$match: {"products.shop": req.shop._id,"created":{$gte: start, $lt: end}}},
    {$project: {
      _id: 1,created:1,user:1, products:1, month: {$month: '$created'}}
    }
  ]).exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      Product.populate(orders, {path: 'products.product', select: '_id price'}, function(err, populatedOrders) {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              })
            }
            res.json(populatedOrders)
      });
      
    })
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read,
  findOrdersPlacedWithinToday,
  findOrdersPlacedWithinThisYear
}
