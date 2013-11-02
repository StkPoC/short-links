var mongoose = require( 'mongoose' ),
  bases = require( 'bases' );

var Schema = new mongoose.Schema( {
  _id: String,
  name: String,
  url: String
} );

Schema.statics.create = function ( name, url, callback ) {
  console.log( name, url );
  this.findOne( {
    url: url
  }, '_id name url', function ( err, link ) {
    console.log( err, link );
    if ( err ) {
      return callback( err );
    }
    if ( link ) {
      return callback( null, link );
    }
    this.next( function ( err, _id ) {
      if ( err ) {
        return callback( err );
      }
      link = new this( {
        _id: _id,
        name: name,
        url: url
      } );
      link.save( function ( err ) {
        var _link = link.toJSON( );
        delete _link[ '__v' ];
        callback( err, _link );
      } );
    }.bind( this ) );
  }.bind( this ) );
};

Schema.statics.next = function ( callback, times ) {
  if ( times > 3 ) {
    return callback( new Error( 'Too many retries' ) );
  }
  times = times || 0;
  var id = bases.toBase58( Math.random( ) * 1000000000000 );
  this.count( {
    _id: id
  }, function ( err, count ) {
    if ( err ) {
      return callback( err );
    }
    if ( count === 0 ) {
      return callback( null, id );
    }
    this.next( callback, times + 1 );
  }.bind( this ) );
};

Schema.statics.list = function ( skip, limit, callback ) {
  var query = this.find( {}, '_id name url' );
  if ( skip ) {
    query.skip( skip );
  }
  if ( limit ) {
    query.limit( limit );
  }
  query.exec( callback );
};

Schema.statics.url = function ( _id, callback ) {
  this.findOne( {
    _id: _id
  }, 'url', function ( err, link ) {
    if ( err || !link ) {
      console.log( _id, err, link );
      callback( true );
    } else {
      callback( null, link.url );
    }
  } );
};

exports.Model = mongoose.model( 'Link', Schema );
