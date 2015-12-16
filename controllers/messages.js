var express = require('express');
var Message = require('../models/message');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Message.find(function(err, messages) {
      if (err) return res.status(500).send(err);
      res.send(messages);
    });
  })
  .post(function(req, res) {
    Message.create(req.body, function(err, message) {
      if (err) return res.status(500).send(err);
      res.send(message);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Message.findById(req.params.id, function(err, message) {
      if (err) return res.status(500).send(err);
      res.send(message);
    });
  })
  .put(function(req, res) {
    Message.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    Message.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });

module.exports = router;