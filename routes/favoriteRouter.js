const express = require("express");
const Favorite = require("../models/favorites");
const authenticate = require("../authenticate");
const cors = require("./cors");
const user = require("../models/user");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((campsite) => {
            if (!favorite.campsites.includes(campsite._id)) {
              favorite.campsites.push.id(campsite._id);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then((favorite) => {
        res.statusCode = 200;
      if (favorite) {
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      } else {
          res.setHeader('Content-Type', 'text/plain');
          res.end('You do not have any favorites to delete.')
        }
      })
      .catch((err) => next(err));
  });


favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on favorites ${req.params.campsiteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then ((favorite) => {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
            favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
            } else {
                res.end("That campsite is already in the list of favorites!");        
            }
        }   else { 
            Favorite.create({user: req.user._id, campsites: [req.params.campsiteId]})
            .then((favorite) => {
                console.log("Favorite list created ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
        }
    })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on favorites/:campsiteId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Favorite.findOne({user: req.user._id})
        .then((favorite) => {
        if (favorite) {
            const index = favorite.campsites.indexOf(req.params.campsiteId)
            if (index >= 0) {
            favorite.campsites.splice(index, 1)
            }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
        } else {
          res.setHeader('Content-Type', 'text/plain');
          res.end('You do not have any favorites to delete.')
        }
    })
        .catch((err) => next(err));
  });
  
module.exports = favoriteRouter;