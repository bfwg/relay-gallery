"use strict";
/*
 * Make sure user is login to upload
 * */
module.exports = (req, res, next) => {
  if (req.session.username)
    next();
};
