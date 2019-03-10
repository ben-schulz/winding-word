describe( "Reader main", function(){

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
	} );
    } );
} );
