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

	    console.info( childNodes[ 0 ].childNodes );

	    var word_line_1_pos_2 =
		childNodes[ 1 ].childNodes[ 2 ].innerText;

	    var word_line_2_pos_10 =
		childNodes[ 2 ].childNodes[ 9 ].innerText;


	    assert.equal( "time", word_line_0_pos_7 );
	    assert.equal( "kittens", word_line_1_pos_2 );
	    assert.equal( "Moppet", word_line_2_pos_10 );
	} );
    } );
} );
