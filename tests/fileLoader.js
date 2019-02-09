var makeTestFile = function( data, type = "text/plain" ){

    var fileObj = new Blob( [ data ], { "type", type } );

    return fileObj;
};

describe( "FileLoader", function(){

    it( "works?", function( done ){

	var file = makeTestFile( 'hello world' );

	var loader = new TextLoader();
	loader.onload = function( result ){

	    assert.equal( "hello world", result );
	    done();
	};

	loader.load( file );

    } );
} );
