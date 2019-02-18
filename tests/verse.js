describe( "Verse", function(){

    describe( "lineCount", function(){

	it( "returns number of lines in array", function(){

	    var lineLength = 10;
	    var text = "the cat sat on the mat.";

	    var page = new Verse( text, lineLength );

	    assert.equal( 3, page.lineCount );
	} );
    } );

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


    describe( "lineText", function(){

	it( "returns the text of the given line", function(){

	    var lineLength = 9;
	    var text = "the cat sat on the mat.";

	    var page = new Verse( text, lineLength );

	    assert.equal( "the cat ", page.lineText( 0 ) );
	    assert.equal( "sat on ", page.lineText( 1 ) );
	    assert.equal( "the mat.", page.lineText( 2 ) );
	} );
    } );

    describe( "lineWords", function(){

	it( "returns array of lexical tokens at line", function(){

	    var lineLength = 10;
	    var text = "the cat sat on the mat.";

	    var page = new Verse( text, lineLength );

	    var line0 = [ "the", " ", "cat", " " ];
	    var line1 = [ "sat", " ", "on", " " ];
	    var line2 = [ "the", " ", "mat", "." ];

	    var lines = [ line0, line1, line2 ];

	    for( var ix = 0; ix < lines.length; ++ix ){

		var expectedLine = lines[ ix ];
		var actualLine = page.lineWords( ix );

		assert.equal(
		    expectedLine.length, actualLine.length );

		for( var _ix = 0;
		     _ix < actualLine.length; ++_ix ){

		    var expect = expectedLine[ _ix ];
		    var actual = actualLine[ _ix ].text;

		    assert.equal( expect, actual );
		}
	    }

	} );
    } );
} );
