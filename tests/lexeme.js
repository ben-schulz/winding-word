describe( "Lexeme", function(){

    describe( "length", function(){

	it( "returns raw number of characters", function(){

	    var result = new Lexeme( "ok wow neat!\n" );

	    assert.equal( 13, result.length );
	} );
    } );
} );
