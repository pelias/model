
module.exports.uppercase = function(){
  return function( val ){
    return val.toUpperCase();
  };
};

module.exports.lowercase = function(){
  return function( val ){
    return val.toLowerCase();
  };
};

module.exports.stringify = function(){
  return function( val ){
    return '' + val;
  };
};

module.exports.floatify = function( precision ){
  return function( val ){
    return parseFloat( val ).toFixed( precision || 10 )/1;
  };
};