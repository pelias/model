
module.exports.get = function( prop ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  return function(){
    return this[prop];
  };
};

module.exports.set = function( prop, validators, transformers, postValidationTransformers ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  if( !validators ){ validators = []; }
  if( !transformers ){ transformers = []; }
  if( !postValidationTransformers ) { postValidationTransformers = []; }
  var setter = function( val ){

    val = transform( val, transformers );
    validate( val, prop, validators );
    val = transform( val, postValidationTransformers );

    this[prop] = val;

    // chain
    return this;
  };
  setter.validate = function( validator ){
    validators.push( validator );
    return setter;
  };
  setter.transform = function( transformer ){
    transformers.push( transformer );
    return setter;
  };
  setter.postValidationTransform = function( transformer ) {
    postValidationTransformers.push( transformer);
    return setter;
  };
  return setter;
};

module.exports.getChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    return this[child][prop];
  };
};

module.exports.hasChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    return this.hasOwnProperty(child) && this[child].hasOwnProperty(prop);
  };
};

module.exports.setChild = function( child, validators, transformers ){
  if( !child ){ throw new Error( 'invalid child' ); }
  if( !validators ){ validators = []; }
  if( !transformers ){ transformers = []; }
  var setter = function( prop, val ){
    if( !prop ){ throw new Error( 'invalid property' ); }

    val = transform( val, transformers );
    validate( val, prop, validators );
    this[child][prop] = val;

    // chain
    return this;
  };
  setter.validate = function( validator ){
    validators.push( validator );
    return setter;
  };
  setter.transform = function( transformer ){
    transformers.push( transformer );
    return setter;
  };
  return setter;
};

module.exports.delChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }

    if( module.exports.hasChild( child ).call( this, prop ) ){
      delete this[child][prop];
      return true;
    }
    return false;
  };
};

module.exports.push = function( prop, validators, transformers ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  if( !validators ){ validators = []; }
  if( !transformers ){ transformers = []; }
  var adder = function( val ){

    val = transform( val, transformers );
    validate( val, prop, validators );

    if( -1 === this[prop].indexOf(val) ){
      this[prop].push(val);
    }

    // chain
    return this;
  };
  adder.validate = function( validator ){
    validators.push( validator );
    return adder;
  };
  adder.transform = function( transformer ){
    transformers.push( transformer );
    return adder;
  };
  return adder;
};

module.exports.splice = function( prop ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  return function( val ){
    for(var i = this[prop].length - 1; i >= 0; i--) {
      if(this[prop][i] === val) {
        this[prop].splice(i, 1);
      }
    }
  };
};

function validate( val, prop, validators ){
  if( validators ){
    validators.forEach( function( validator ) {
      validator( val, prop );
    });
  }
}

function transform( val, transformers ){
  if( transformers ){
    transformers.forEach( function( transformer ) {
      val = transformer( val );
    });
  }

  return val;
}
