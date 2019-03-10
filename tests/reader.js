describe( "Reader main", function(){

    var assertMarkSetOnInterval =

	function( page, mark, start, end ){

	    for( var pos = start; pos < end; ++pos ){

		assert.isTrue( page.pageBox
			       .charBoxes[ pos ]
			       .element
			       .classList
			       .contains( mark ) );
	    }
	};

    var assertMarkClearOnInterval =

	function( page, mark, start, end ){

	    for( var pos = start; pos < end; ++pos ){

		assert.isFalse( page.pageBox
				.charBoxes[ pos ]
				.element
				.classList
				.contains( mark ) );
	    }
	};

    describe( "bucket toggle", function(){

	it( "switches destination for persist", function(){

	    var text = "the cat sat on the mat.";

	    var annotations = new Annotation();
	    var page = new TextPage( text );

	    var reader = new Reader( page, annotations );

	    reader.page.setMark( "subject" );
	    reader.page.cursorRight( 3 );
	    reader.page.unsetMark( "subject" );

	    reader.page.persistMarks();

	    reader.addSubjectAndRedisplay();

	    reader.page.cursorRight( 1 );

	    reader.page.setMark( "subject" );
	    reader.page.cursorRight( 3 );
	    reader.page.unsetMark( "subject" );

	    reader.page.persistMarks();

	    assert.equal( 2, reader.annotations.marks.length );

	    assert.equal( 0,
			  reader.annotations
			  .marks[ 0 ].subject[ 0 ].start );

	    assert.equal( 3,
			  reader.annotations
			  .marks[ 0 ].subject[ 0 ].end );

	    assert.equal( 4,
			  reader.annotations
			  .marks[ 1 ].subject[ 0 ].start );

	    assert.equal( 7,
			  reader.annotations
			  .marks[ 1 ].subject[ 0 ].end );
	} );

	it( "updates visible marks on cycle", function(){

	    var text = "the cat sat on the mat.";

	    var annotations = new Annotation();
	    var page = new TextPage( text );

	    var reader = new Reader( page, annotations );

	    reader.addSubjectAndRedisplay();

	    reader.page.setMark( "subject" );
	    reader.page.cursorRight( 3 );
	    reader.page.unsetMark( "subject" );

	    reader.page.persistMarks();

	    reader.cycleAndRedisplay();

	    reader.page.cursorRight( 1 );

	    reader.page.setMark( "subject" );
	    reader.page.cursorRight( 3 );
	    reader.page.unsetMark( "subject" );

	    reader.page.persistMarks();

	    reader.cycleAndRedisplay();

	    assertMarkSetOnInterval(
		reader.page, "subjectMark", 0, 3 );

	    assertMarkClearOnInterval(
		reader.page, "subjectMark", 4, 7 );

	    reader.cycleAndRedisplay();

	    assertMarkClearOnInterval(
		reader.page, "subjectMark", 0, 3 );

	    assertMarkSetOnInterval(
		reader.page, "subjectMark", 4, 7 );
	} );

	it( "clears all visible marks on new", function(){

	    var text = "the cat sat on the mat.";

	    var annotations = new Annotation();
	    var page = new TextPage( text );

	    var reader = new Reader( page, annotations );

	    reader.page.setMark( "subject" );
	    reader.page.cursorRight( 3 );
	    reader.page.unsetMark( "subject" );

	    reader.page.persistMarks();

	    reader.addSubjectAndRedisplay();

	    assertMarkClearOnInterval(
		page, "subjectMark", 0, 3 );

	    reader.page.cursorRight( 1 );

	    reader.page.setMark( "subject" );
	    reader.page.cursorRight( 3 );
	    reader.page.unsetMark( "subject" );

	    reader.page.persistMarks();

	    assertMarkSetOnInterval(
		page, "subjectMark", 4, 7 );
	} );

    } );
} );
