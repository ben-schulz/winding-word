describe( "RaggedArray", function(){

    describe( "charAt", function(){

	it( "returns value by line, column", function(){

	    var lineLength = 10;
	    var text = "the cat sat on the mat.";
	    var page = new RaggedArray( text, lineLength );

	    var firstLine = text.slice( 0, lineLength );
	    var secondLine = text.slice( lineLength );

	    for( var ix = 0; ix < lineLength; ++ix ){

		var result = page.charAt( 0, ix );

		assert.equal( text[ ix ], result );
	    }

	    for( var ix = 0; ix < lineLength; ++ix ){

		var flatIndex = lineLength + ix;
		var result = page.charAt( 1, ix );

		assert.equal( text[ flatIndex ], result );
	    }

	} );

	it( "returns null for line out of range", function(){

	    var lineLength = 10;
	    var text = "ok";

	    var page = new RaggedArray( text, lineLength );

	    assert.isTrue( null === page.charAt( 1, 0 ) );

	} );

	it( "returns null for column out of range", function(){

	    var lineLength = 10;
	    var text = "ok";

	    var page = new RaggedArray( text, lineLength );

	    assert.isTrue( null === page.charAt( 0, 10 ) );

	} );

    } );

} );
