var express = require( 'express' ),
  partials = require( 'express-partials' ),
  routes = require( './routes' ),
  http = require( 'http' ),
  path = require( 'path' ),
  mongoose = require( 'mongoose' );

var app = express( );

// all environments
app.set( 'port', 3000 );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hjs' );

app.use( express.favicon( ) );
app.use( express.bodyParser( ) );
app.use( partials( ) );
app.use( function ( req, res, next ) {
  res.locals( {
    title: 'Short Links'
  } );
  next( );
} );
app.use( app.router );
app.use( express.static( path.join( __dirname, 'public' ) ) );

mongoose.connect( 'mongodb://localhost/links' );

routes.init( app );

http.createServer( app ).listen( 3000, function ( ) {
  console.log( 'Express server started' );
} );
