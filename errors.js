
var util = require('util');

/**
  Custom Errors used in order to distinguish them from generic Errors:

  // distinguish from generic errors
  try {
    throw new errors.PeliasModelError('error');
  }
  catch (c) {

    switch( c.name ){
      case 'PeliasModelError':
        // not a generic error
        break;
      default:
        // generic error
    }
  }

**/

// Custom Error - PeliasModelError
function PeliasModelError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'PeliasModelError';
  this.message = message;
}

// Extends from js Error object
util.inherits(PeliasModelError, Error);

// export
module.exports.PeliasModelError = PeliasModelError;
