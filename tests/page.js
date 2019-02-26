describe( "Page", function(){

    describe( "element structure", function(){

	it( "lays out lines of words", function(){

	    var line0 = "Once upon a time there were three ";
	    var line1 = "little kittens, and their names were ";
	    var line2 = "Mittens, Tom Kitten, and Moppet.";

	    var text = line0 + line1 + line2;
	    var lineLength = 37;
	    var page = new TextPage( text, lineLength );

	    var childNodes = page.element.childNodes;

	    assert.equal( 3, childNodes.length )

	    var word_line_0_pos_6 =
		childNodes[ 0 ].childNodes[ 6 ].innerText;

	    var word_line_1_pos_2 =
		childNodes[ 1 ].childNodes[ 2 ].innerText;

	    var word_line_2_pos_8 =
		childNodes[ 2 ].childNodes[ 8 ].innerText;

	    assert.equal( "time", word_line_0_pos_6 );
	    assert.equal( "kittens", word_line_1_pos_2 );
	    assert.equal( "Moppet", word_line_2_pos_8 );

	} );

    } );

    describe( "charBoxAt", function(){

	it( "returns element by line, column", function(){

	    var line0 = "Once upon a time there were three ";
	    var line1 = "little kittens, and their names were ";
	    var line2 = "Mittens, Tom Kitten, and Moppet.";

	    var text = line0 + line1 + line2;
	    var lineLength = 37;
	    var page = new TextPage( text, lineLength );

	    var char_at_line_1_col_7 = page.charBoxAt( 1, 7 );
	    var char_at_line_2_col_11 = page.charBoxAt( 2, 11 );

	    assert.equal( "k", char_at_line_1_col_7.innerText );
	    assert.equal( "m", char_at_line_2_col_11.innerText );

	} );

    } );

    describe( "charBoxRange", function(){

	it( "returns all charBoxes between coordinates", function(){

	    var line0 = "Once upon a time there were three ";
	    var line1 = "little kittens, and their names were ";
	    var line2 = "Mittens, Tom Kitten, and Moppet.";

	    var text = line0 + line1 + line2;
	    var lineLength = 37;
	    var page = new TextPage( text, lineLength );

	    var startLine = 0;
	    var startCol = 19;

	    var endLine = 2;
	    var endCol = 5;

	    var result = page.charBoxRange(
		startLine, startCol, endLine, endCol );

	    var textLength = ( line0.slice( 19 ).length
		  + line1.length
		  + line2.slice( 0, 6 ).length );

	    assert.equal( textLength, result.length );

	    assert.equal( "e", result[ 0 ].innerText );
	    assert.equal( "r", result[ 1 ].innerText );

	    assert.equal( "n",
			  result[ result.length - 1 ].innerText );
	} );
    } );

    describe( "marker", function(){

	it( "sets from current cursor position", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();

	    page.setMark();

	    assert.equal( 1, page.markLine );
	    assert.equal( 3, page.markCol );

	} );

	it( "resets to null on clear", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();

	    page.setMark();
	    page.clearMark();

	    assert.equal( null, page.markLine );
	    assert.equal( null, page.markCol );
	} );

	it( "if after, marks next character on right", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorDown();

	    page.setMark();
	    page.cursorRight();

	    var mark = page.charBoxAt(
		page.markLine, page.markCol );

	    var cursor = page.cursorBox;

	    assert.isTrue( mark.classList.contains( "mark" ) );
	    assert.isTrue( cursor.classList.contains( "mark" ) );
	} );

	it( "if after, clears prior character on left", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorDown();

	    page.setMark();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorLeft();

	    var mark = page.charBoxAt(
		page.markLine, page.markCol );

	    var cursor = page.cursorBox;

	    assert.isFalse( cursor.classList.contains( "mark" ) );
	} );

	it( "if after, clears line on up", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorRight();
	    page.setMark();
	    page.cursorDown();
	    page.cursorRight();

	    page.cursorUp();

	    for( var ix = 0; ix < 10; ++ix ){

		console.info( page.charBoxAt( 0, ix ) );
	    }
	    for( var ix = 0; ix < 10; ++ix ){

		console.info( page.charBoxAt( 1, ix ) );
	    }

	    assert.isFalse(
		page.charBoxAt( 1, 0 )
		    .classList.contains( "mark" ) );

	    assert.isFalse(
		page.charBoxAt( 1, 1 )
		    .classList.contains( "mark" ) );

	    assert.isFalse(
		page.charBoxAt( 1, 2 )
		    .classList.contains( "mark" ) );

	} );

	it( "if after, sets line on down", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorRight();
	    page.setMark();
	    page.cursorDown();

	    assert.isTrue(
		page.charBoxAt( 0, 3 )
		    .classList.contains( "mark" ) );

	    assert.isTrue(
		page.charBoxAt( 0, 4 )
		    .classList.contains( "mark" ) );

	    assert.isTrue(
		page.charBoxAt( 0, 7 )
		    .classList.contains( "mark" ) );

	    assert.isTrue(
		page.charBoxAt( 1, 0 )
		    .classList.contains( "mark" ) );

	    assert.isTrue(
		page.charBoxAt( 1, 1 )
		    .classList.contains( "mark" ) );

	    assert.isTrue(
		page.charBoxAt( 1, 2 )
		    .classList.contains( "mark" ) );

	    assert.isFalse(
		page.charBoxAt( 1, 3 )
		    .classList.contains( "mark" ) );
	} );


	it( "if before, sets next character on left", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorRight();
	    page.cursorDown();

	    page.setMark();
	    page.cursorLeft();

	    var cursor = page.cursorBox;
	    assert.isTrue( cursor.classList.contains( "mark" ) );

	} );

	it( "if before, clears character on right", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorRight();
	    page.cursorDown();

	    page.setMark();
	    page.cursorLeft();
	    page.cursorLeft();
	    page.cursorRight();

	    var cursor = page.cursorBox;
	    assert.isFalse( cursor.classList.contains( "mark" ) );

	} );

	it( "if before, sets on up", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();

	    page.setMark();
	    page.cursorUp();

/*
	    assert.isTrue(
		page.charBoxAt( 1, 2 ).classList.contains( "mark" ) );
	    assert.isTrue(
		page.charBoxAt( 1, 1 ).classList.contains( "mark" ) );
	    assert.isTrue(
		page.charBoxAt( 1, 0 ).classList.contains( "mark" ) );

	    assert.isTrue(
		page.charBoxAt( 0, 7 ).classList.contains( "mark" ) );
	    assert.isTrue(
		page.charBoxAt( 0, 3 ).classList.contains( "mark" ) );
	    assert.isFalse(
		page.charBoxAt( 0, 3 ).classList.contains( "mark" ) );
*/
	} );

	it( "if before, clears on down", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );


	} );

    } );

    describe( "the cursor", function(){

	it( "applies style class at its position", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();

	    var cursorBox = page.charBoxAt( 1, 2 );
	    assert.isTrue(
		cursorBox.classList.contains( "cursor" ) );

	} );

	it( "clears style class from previous position", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();

	    var cursorBox = page.charBoxAt( 1, 2 );
	    assert.isTrue(
		cursorBox.classList.contains( "cursor" ) );

	    page.cursorLeft();

	    var nextCursorBox = page.charBoxAt( 1, 1 );

	    assert.isFalse(
		cursorBox.classList.contains( "cursor" ) );

	    assert.isTrue(
		nextCursorBox.classList.contains( "cursor" ) );
	} );


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
