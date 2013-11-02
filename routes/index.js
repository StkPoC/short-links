var base62 = require( 'base62' ),
  Link = require( '../models/Link' ).Model;

exports.init = function ( app ) {
  app.get( '/', exports.index );
  app.post( '/', exports.create );
  app.get( '/l/*', exports.navigate );
};

exports.index = function ( req, res ) {
  Link.list( null, null, function ( err, links ) {
    res.render( 'index', {
      links: links
    } );
  } );
};

exports.create = function ( req, res ) {
  if ( req.body.url && req.body.name ) {
    Link.create( req.body.name, req.body.url, function ( err, link ) {
      // res.json( link );
      res.redirect( '/' );
    } );
  }
};

exports.navigate = function ( req, res ) {
  Link.url( req.params[ 0 ], function ( err, url ) {
    if ( err ) {
      res.send( 404 );
    } else {
      res.redirect( url );
    }
  } );
};
