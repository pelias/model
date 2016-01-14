
/**
  Get the value of a property from the root of the model.

  // example:
  var get = model.get('myKey')
  get() // returns: model['myKey']

**/
module.exports.get = function( prop ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  return function(){
    return this[prop];
  };
};

/**
  Set the value of a property on the root of the model.

  // example:
  var set = model.set('myKey')
  set('example') // returns: model
  // effect: model['myKey'] = 'example'

  // validators example:
  var set = model.set('myKey', [ valid.type('string') ])
  set(1) // throws Error

  // transformers example:
  var set = model.set('myKey', null, [ transform.uppercase() ])
  set('example') // returns: model
  // effect: model['myKey'] = 'EXAMPLE'

  // post validation transformers example:
  var set = model.set('myKey', null, null, [ transform.roundify() ])
  set(1.11111) // returns: model
  // effect: model['myKey'] = 1

**/
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

/**
  Get the value of a property from a *second level* property of the model.

  // example:
  var get = model.getChild('myKey')
  get('myChildKey') // returns: model['myKey']['myChildKey']

**/
module.exports.getChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    return this[child][prop];
  };
};

/**
  Test the existence of a *second level* property of the model.

  // example:
  var has = model.hasChild('myKey')
  has('myChildKey') // returns: false

**/
module.exports.hasChild = function( child ){
  if( !child ){ throw new Error( 'invalid child' ); }
  return function( prop ){
    if( !prop ){ throw new Error( 'invalid property' ); }
    return this.hasOwnProperty(child) && this[child].hasOwnProperty(prop);
  };
};

/**
  Set the value of a *second level* property of the model.

  // example:
  var set = model.setChild('myKey')
  set('myChildKey', 'example') // returns: model
  // effect: model['myKey']['myChildKey'] = 'example'

  // validators & transformers behave the same as model.get()
  // see: the code comments above for more info.

**/
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

/**
  Remove the *second level* property of the model.
  Returns true if the property was found and deleted, else false.

  // example:
  var del = model.delChild('myKey')
  del('myChildKey') // returns: false

**/
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

/**
  Push a value on to the Array stored at a root property of the model.
  Note: the Array enforced uniqueness and will not store duplicates.

  // example:
  model.items = [];
  var push = model.push('items')
  push('item1') // returns: model
  push('item2') // returns: model
  // effect: model.items = ['item1', 'item2']

**/
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

/**
  Remove a value from the Array stored at a root property of the model.

  // example:
  model.items = ['item1', 'item2'];
  var splice = model.splice('items') // returns: model
  splice('item1') // returns: model
  // effect: model.items = ['item2']

**/
module.exports.splice = function( prop ){
  if( !prop ){ throw new Error( 'invalid property' ); }
  var splicer = function( val ){
    for(var i = this[prop].length - 1; i >= 0; i--) {
      if(this[prop][i] === val) {
        this[prop].splice(i, 1);
      }
    }
    return this;
  };
  return splicer;
};

/**
  Utility function to run an Array of validators against a property
**/
function validate( val, prop, validators ){
  if( validators ){
    validators.forEach( function( validator ) {
      validator( val, prop );
    });
  }
}

/**
  Utility function to run an Array of transformers against a property
**/
function transform( val, transformers ){
  if( transformers ){
    transformers.forEach( function( transformer ) {
      val = transformer( val );
    });
  }

  return val;
}
