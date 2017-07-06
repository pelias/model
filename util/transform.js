
module.exports.uppercase = function( val ){
  return val.toUpperCase();
};

module.exports.lowercase = function( val ){
  return val.toLowerCase();
};

module.exports.stringify = function( val ){
  // because javascript: (''+undefined) === 'undefined'
  if( 'string' === typeof val || 'number' === typeof val ){
    return '' + val;
  }
  return '';
};

module.exports.floatify = function( precision, val ){
  return ( Math.floor( parseFloat( val ) * Math.pow( 10, precision || 0 ) ) / Math.pow( 10, precision || 0 ) );
};

module.exports.roundify = function( val ){
  return Math.round(val);
};

module.exports.toULLR = function( val ) {
  return JSON.stringify({
    min_lat: val.lowerRight.lat,
    max_lat: val.upperLeft.lat,
    min_lon: val.upperLeft.lon,
    max_lon: val.lowerRight.lon
  });
};
