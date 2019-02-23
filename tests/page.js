describe( "Page", function(){

    describe( "element structure", function(){

	it( "lays out lines of words", function(){

	    var text = (
		    "Once upon a time there were three " +
		    "little kittens, and their names were " +
		    "Mittens, Tom Kitten, and Moppet." )

	    var lineLength = 37;
	    var page = new TextPage( text, lineLength );

	    var childNodes = page.element.childNodes;

	    assert.equal( 3, childNodes.length )

	    var word_line_0_pos_7 =
		childNodes[ 0 ].childNodes[ 6 ].innerText;

	    var word_line_1_pos_2 =
		childNodes[ 1 ].childNodes[ 2 ].innerText;

	    var word_line_2_pos_10 =
		childNodes[ 2 ].childNodes[ 9 ].innerText;


	    assert.equal( "time", word_line_0_pos_7 );
	    assert.equal( "kittens", word_line_1_pos_2 );
	    assert.equal( "Moppet", word_line_2_pos_10 );
	} );
    } );

    describe( "the cursor", function(){

	it( "sets to line 0, column 0 on load", function(){

	    var text = "the cat sat on the mat.";
	    var page = new TextPage( text );

	    assert.equal( 0, page.cursorLine );
	    assert.equal( 0, page.cursorCol );
	} );

	it( "moves to next line on cursorDown", function(){

	    var text = "the cat sat on the mat";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorDown();

	    assert.equal( 2, page.cursorLine );
	} );

	it( "moves to previous line on cursorUp", function(){

	    var text = "the cat sat on the mat";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorDown();
	    page.cursorUp();

	    assert.equal( 1, page.cursorLine );
	} );

	it( "stops at line 0 on cursorUp", function(){

	    var text = "the cat sat on the mat";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorUp();

	    assert.equal( 0, page.cursorLine );
	} );

	it( "stops at last line on cursorDown", function(){

	    var text = "the cat sat on the mat";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    for( var ct = 0; ct < page.lineCount; ++ct ){

		page.cursorDown();
	    }

	    page.cursorDown();

	    assert.equal( page.lineCount - 1, page.cursorLine );
	} );

	it( "moves to next column on cursorRight", function(){

	    var text = "the cat sat on the mat.";

	    var page = new TextPage( text );

	    page.cursorRight();

	    assert.equal( 1, page.cursorCol );
	} );

	it( "moves to previous column on cursorLeft", function(){

	    var text = "the cat sat on the mat.";

	    var page = new TextPage( text );

	    page.cursorRight();
	    page.cursorRight();
	    page.cursorLeft();

	    assert.equal( 1, page.cursorCol );
	} );

	it( "wraps on cursorRight from end column", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    for( var ct = 0; ct < 11; ++ct ){

		page.cursorRight();
	    }

	    assert.equal( 3, page.cursorCol );
	    assert.equal( 1, page.cursorLine );

	} );

	it( "wraps on cursorLeft from column 0", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorDown();

	    page.cursorLeft();
	    page.cursorLeft();

	    assert.equal( 8, page.cursorCol );
	    assert.equal( 1, page.cursorLine );

	} );

	it( "stops at column 0, line 0, on cursorLeft", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorLeft();

	    assert.equal( 0, page.cursorCol );
	    assert.equal( 0, page.cursorLine );

	} );

	it( "stops at end column, line, on cursorRight", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorDown();
	    page.cursorDown();

	    for( var ct = 0; ct < 100; ++ct ){

		page.cursorRight();
	    }

	    assert.equal( 2, page.cursorLine );
	    assert.equal( 4, page.cursorCol );
	} );
    } );
} );
