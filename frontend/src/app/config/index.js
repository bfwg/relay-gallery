"use strict";

/* If dev server is open we get all the static  */
/* resources from our server port default 3000 */
/* if not we get everything from production port */

module.exports = {
  SERVER_HOST: window.location.port === '3001' ?
    location.protocol + '//'+location.hostname + ':3000' :
    window.location.origin,
};

