'use strict';

/*
 * Make sure user is login to upload
 * */
module.exports = (req) => {
  if (req.session.username)
    return true;
    return false;
};
