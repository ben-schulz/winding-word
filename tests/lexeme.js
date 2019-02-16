describe( "Lexer", function(){

    it( "preserves all text", function(){

	var text = "...she fetched the kittens indoors,\r"
	    + "to \"wash\" and \"dress ... them,, before\n"
	    + "\tthe fine company arrived.";

	var result = Lexer.lex( text );

	var resultCharCount = 0;
	for( var ix = 0; ix < result.length; ++ix ){

	    resultCharCount += result[ ix ].text.length;
	}

	assert.equal( text.length, resultCharCount );

	var expect = [
	    "...",
	    "she",
	    " ",
	    "fetched",
	    " ",
	    "the",
	    " ",
	    "kittens",
	    " ",
	    "indoors",
	    ",\r",
	    "to",
	    " \"",
	    "wash",
	    "\" ",
	    "and",
	    " \"",
	    "dress",
	    " ... ",
	    "them",
	    ",, ",
	    "before",
	    "\n\t",
	    "the",
	    " ",
	    "fine",
	    " ",
	    "company",
	    " ",
	    "arrived",
	    "."
	];

	for( var ix = 0; ix < result.length; ++ix ){

	    assert.equal( expect[ ix ], result[ ix ].text );
	}
    } );

    describe( "splits on separators", function(){

	it( "splits on space", function(){

	    var text = "the cat   sat ";

	    var result = Lexer.lex( text );

	    assert.equal( "the", result[0].text );
	    assert.equal( " ", result[1].text );
	    assert.equal( "cat", result[2].text );
	    assert.equal( "   ", result[3].text );
	    assert.equal( "sat", result[4].text )
	} );

	it( "splits on punctuation", function(){

	    var text = "cats,sit...on..mats?!No.";

	    var result = Lexer.lex( text );

	    assert.equal( "cats", result[0].text );
	    assert.equal( ",", result[1].text );
	    assert.equal( "sit", result[2].text );
	    assert.equal( "...", result[3].text );
	    assert.equal( "on", result[4].text );
	    assert.equal( "..", result[5].text );
	    assert.equal( "mats", result[6].text )
	    assert.equal( "?!", result[7].text )
	    assert.equal( "No", result[8].text )
	    assert.equal( ".", result[9].text )
	} );
    } );
} );

describe( "Lexeme", function(){

    describe( "length", function(){

	it( "returns raw number of characters", function(){

	    var result = new Lexeme( "ok wow neat!\n" );

	    assert.equal( 13, result.length );
	} );
    } );

    describe( "isSimpleWord", function(){

	it( "returns true for alphabetic only", function(){

	    var result = new Lexeme( "ok" );

	    assert.equal( true, result.isSimpleWord );
	} );


	it( "returns true for alphanumeric only", function(){

	    var result = new Lexeme( "3D" );

	    assert.equal( true, result.isSimpleWord );
	} );


	it( "returns false for whitespace only", function(){

	    var result = new Lexeme( "   \n\t" );

	    assert.equal( false, result.isSimpleWord );
	} );

    } );

    describe( "isSpace", function(){

	it( "returns true for space, tab, newline", function(){

	    var result = new Lexeme( "   \n\t" );

	    assert.equal( true, result.isSpace );
	} );
    } );
} );
