describe( "Verse", function(){

    describe( "charAt", function(){

	it( "returns value by line, column", function(){

	    var lineLength = 10;
	    var text = "the cat sat on the mat.";
	    var page = new Verse( text, lineLength );

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

	    var page = new Verse( text, lineLength );

	    assert.isTrue( null === page.charAt( 1, 0 ) );

	} );

	it( "returns null for column out of range", function(){

	    var lineLength = 10;
	    var text = "ok";

	    var page = new Verse( text, lineLength );

	    assert.isTrue( null === page.charAt( 0, 10 ) );

	} );

    } );


    describe( "lines", function(){

	it( "returns an array with text of each line", function(){

	    var lineLength = 9;
	    var text = "the cat sat on the mat.";

	    var page = new Verse( text, lineLength );

	    assert.equal( "the cat ", page.line( 0 ) );
	    assert.equal( "sat on ", page.line( 1 ) );
	    assert.equal( "the mat.", page.line( 2 ) );
	} );
    } );

} );
