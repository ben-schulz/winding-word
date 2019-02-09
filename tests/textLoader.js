var makeTestFile = function( data, type = "text/plain" ){

    var fileObj = new Blob( [ data ], { "type": type } );

    return fileObj;
};

describe( "FileLoader", function(){

    describe( "onload callback", function(){

	it( "receives file contents on load", function( done ){

	    var file = makeTestFile( 'hello world' );

	    var loader = new TextLoader();
	    loader.onload = function( result ){

		assert.equal( "hello world", result );
		done();
	    };

	    loader.load( file );
	} );

    } );
} );
