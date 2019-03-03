describe( "Page", function(){

    var assertMarkSetAt = function( page, line, col ){

	assert.isTrue( page.charBoxAt( line, col )
		       .element
		       .classList.contains( "mark" ) );
    };

    var assertMarkClearAt = function( page, line, col ){

	assert.isFalse( page.charBoxAt( line, col )
			.element
		       .classList.contains( "mark" ) );
    };

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

    describe( "lineNumber", function(){

	it( "returns line number of a char index", function(){

	    var line0 = "Once upon a time there were three ";
	    var line1 = "little kittens, and their names were ";
	    var line2 = "Mittens, Tom Kitten, and Moppet.";

	    var text = line0 + line1 + line2;
	    var lineLength = 37;
	    var page = new TextPage( text, lineLength );

	    assert.equal( 0, page.pageBox.lineNumber( 0 ) );
	    assert.equal( 0, page.pageBox.lineNumber( 31 ) );
	    assert.equal( 0, page.pageBox.lineNumber( 33 ) );

	    assert.equal( 1, page.pageBox.lineNumber( 47 ) );
	    assert.equal( 1, page.pageBox.lineNumber( 51 ) );
	    assert.equal( 1, page.pageBox.lineNumber( 70 ) );

	    assert.equal( 2, page.pageBox.lineNumber( 88 ) );
	    assert.equal( 2, page.pageBox.lineNumber( 102 ) );
	} );

	it( "returns line number of another char index", function(){

	    var line0 = "the cat ";
	    var line1 = "sat on ";
	    var line2 = "the mat.";

	    var text = ( line0 + line1 + line2 );
	    var lineLength = 9;

	    var page = new TextPage( text, lineLength );

	    assert.equal( 1, page.pageBox.lineNumber( 8 ) );
	} );

	it( "returns -1 for index out of range", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    assert.equal( -1, page.pageBox.lineNumber( -2 ) );
	    assert.equal( -1, page.pageBox.lineNumber( 255 ) );
	} );

    } );

    describe( "column indexing", function(){

	it( "sets home at first column in line", function(){

	    var line0 = "the cat ";
	    var line1 = "sat on ";
	    var line2 = "the mat.";

	    var text = ( line0 + line1 + line2 );
	    var lineLength = 9;

	    var page = new TextPage( text, lineLength );

	    var line0_home = page.pageBox.home( 0 );
	    var line1_home = page.pageBox.home( 1 );
	    var line2_home = page.pageBox.home( 2 );

	    assert.equal( 0, line0_home );
	    assert.equal( 8, line1_home );
	    assert.equal( 15, line2_home );
	} );

	it( "sets end at last column in line", function(){

	    var line0 = "the cat ";
	    var line1 = "sat on ";
	    var line2 = "the mat.";

	    var text = ( line0 + line1 + line2 );
	    var lineLength = 9;

	    var page = new TextPage( text, lineLength );

	    var line0_end = page.pageBox.end( 0 );
	    var line1_end = page.pageBox.end( 1 );
	    var line2_end = page.pageBox.end( 2 );

	    assert.equal( 7, line0_end );
	    assert.equal( 14, line1_end );
	    assert.equal( 22, line2_end );

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

	    var result = page.pageBox.charBoxRange(
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

	it( "on right, marks character behind cursor", function(){

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

	    assert.isTrue( mark
			   .element
			   .classList.contains( "mark" ) );

	    assert.isFalse( cursor
			   .element
			   .classList.contains( "mark" ) );

	} );

	it( "on left, clears character behind cursor", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorDown();

	    page.setMark();
	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorLeft();

	    var zeroRight = page.charBoxAt(
		page.cursorLine, page.markCol );

	    var oneRight = page.charBoxAt(
		page.cursorLine, page.markCol + 1 );

	    var twoRight = page.charBoxAt(
		page.cursorLine, page.markCol + 2 );

	    assert.isTrue( zeroRight
			   .element
			   .classList.contains( "mark" ) );

	    assert.isFalse( oneRight
			   .element
			   .classList.contains( "mark" ) );

	    assert.isFalse( twoRight
			   .element
			   .classList.contains( "mark" ) );
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

	    assert.isFalse(
		page.charBoxAt( 1, 0 )
		    .element
		    .classList.contains( "mark" ) );

	    assert.isFalse(
		page.charBoxAt( 1, 1 )
		    .element
		    .classList.contains( "mark" ) );

	    assert.isFalse(
		page.charBoxAt( 1, 2 )
		    .element
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

	    assertMarkSetAt( page, 0, 3 );
	    assertMarkSetAt( page, 0, 4 );
	    assertMarkSetAt( page, 0, 7 );

	    assertMarkSetAt( page, 1, 0 );
	    assertMarkSetAt( page, 1, 1 );
	    assertMarkClearAt( page, 1, 2 );

	    assertMarkClearAt( page, 1, 3 );

	} );


	it( "on left, sets next character", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorRight();
	    page.cursorDown();

	    page.setMark();
	    page.cursorLeft();

	    var cursor = page.cursorBox;
	    assert.isTrue( cursor
			   .element
			   .classList.contains( "mark" ) );

	} );

	it( "on left, marks character on cursor", function(){

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

	    var zeroLeft = page.charBoxAt(
		page.markLine, page.markCol );

	    var oneLeft = page.charBoxAt(
		page.markLine, page.markCol - 1 );

	    var twoLeft = page.charBoxAt(
		page.markLine, page.markCol - 2 );

	    assert.isFalse( zeroLeft
			    .element
			    .classList.contains( "mark" ) );

	    assert.isTrue( oneLeft
			   .element
			   .classList.contains( "mark" ) );

	    assert.isFalse( twoLeft
			    .element
			    .classList.contains( "mark" ) );
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

	    assertMarkSetAt( page, 1, 0 );
	    assertMarkSetAt( page, 1, 1 );
	    assertMarkSetAt( page, 1, 2 );

	    assertMarkSetAt( page, 0, 3 );
	    assertMarkSetAt( page, 0, 7 );

	    assertMarkClearAt( page, 0, 2 );

	} );

	it( "if before, clears on down", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();
	    page.setMark();

	    page.cursorUp();
	    page.cursorUp();
	    page.cursorLeft();
	    page.cursorDown();

	    assertMarkSetAt( page, 2, 1 );
	    assertMarkClearAt( page, 1, 0 );
	    assertMarkSetAt( page, 1, 1 );
	    assertMarkSetAt( page, 1, 2 );
	    assertMarkSetAt( page, 1, 3 );
	    assertMarkClearAt( page, 2, 3 );
	} );


	it( "on up, set all between cursor and mark", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();

	    page.setMark();

	    page.cursorDown();

	    page.cursorLeft();
	    page.cursorLeft();

	    page.cursorUp();

	    assertMarkClearAt( page, 0, 1 );
	    assertMarkSetAt( page, 0, 2 );
	    assertMarkSetAt( page, 0, 3 );
	    assertMarkClearAt( page, 0, 4 );
	    assertMarkClearAt( page, 0, 5 );

	} );

	it( "on down, set all between cursor and mark", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();
	    page.cursorRight();

	    page.setMark();

	    page.cursorUp();
	    page.cursorRight();
	    page.cursorRight();

	    page.cursorDown();

	    assertMarkClearAt( page, 1, 3 );
	    assertMarkSetAt( page, 1, 4 );
	    assertMarkSetAt( page, 1, 5 );
	    assertMarkClearAt( page, 1, 6 );
	    assertMarkClearAt( page, 1, 7 );
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
		cursorBox
		    .element
		    .classList.contains( "cursor" ) );

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
		cursorBox
		    .element
		    .classList.contains( "cursor" ) );

	    page.cursorLeft();

	    var nextCursorBox = page.charBoxAt( 1, 1 );

	    assert.isFalse(
		cursorBox
		    .element
		    .classList.contains( "cursor" ) );

	    assert.isTrue(
		nextCursorBox
		    .element
		    .classList.contains( "cursor" ) );
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

	    console.info( page.cursorLine, page.cursorCol );
	    page.cursorDown();
	    console.info( page.cursorLine, page.cursorCol );
	    page.cursorDown();
	    console.info( page.cursorLine, page.cursorCol );

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


	it( "moves N columns right if N given", function(){

	    var text = "the cat sat on the mat.";

	    var page = new TextPage( text );

	    page.cursorRight( 5 );

	    assert.equal( 5, page.cursorCol );
	} );

	it( "moves N columns right across lines", function(){

	    var text = "the cat sat on the mat.";

	    var lineLength = 10;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight( 12 );

	    assert.equal( 4, page.cursorCol );
	} );

	it( "moves N columns right across many lines", function(){

	    var text = "the cat sat on the mat.";

	    var lineLength = 9;
	    var page = new TextPage( text, lineLength );

	    page.cursorRight( 19 );

	    assert.equal( 4, page.cursorCol );
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

	    var line0 = "the cat ";
	    var line1 = "sat on ";
	    var line2 = "the mat.";

	    var text = ( line0 + line1 + line2 );
	    var lineLength = 9;

	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorDown();

	    page.cursorLeft();
	    page.cursorLeft();

	    assert.equal( 1, page.cursorLine );
	    assert.equal( 5, page.cursorCol );
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

	it( "moves N columns left if N given", function(){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    page.cursorRight( 6 );
	    page.cursorLeft( 2 );

	    assert.equal( 4, page.cursorCol );

	} );

	it( "moves N columns left across lines", function(){

	    var line0 = "the cat ";
	    var line1 = "sat on ";
	    var line2 = "the mat.";

	    var text = ( line0 + line1 + line2 );
	    var lineLength = 9;

	    var page = new TextPage( text, lineLength );

	    page.cursorDown();
	    page.cursorRight( 3 );
	    page.cursorLeft( 4 );

	    assert.equal( 7, page.cursorCol );
	} );

    } );

    describe( "onhighlight event", function(){

	it( "sends the highlighted text", function( done ){

	    var text = "the cat sat on the mat.";
	    var lineLength = 10;

	    var page = new TextPage( text, lineLength );

	    for( var ct = 0; ct < 3; ++ct ){

		page.cursorRight();
	    }

	    page.setMark();

	    for( var ct = 0; ct < 7; ++ct ){

		page.cursorRight();
	    }

	    page.onhighlight = text => {

		assert.equal( text, "cat sat" );
		done();
	    };

	    page.highlight();

	} );
    } );
} );
