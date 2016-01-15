
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
    this.name = 'PeliasModelError';
    this.message = message;
    this.stack = (new Error()).stack;
}

// Extends from js Error object
PeliasModelError.prototype = new Error();

// export
module.exports.PeliasModelError = PeliasModelError;
