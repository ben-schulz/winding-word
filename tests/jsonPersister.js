describe( "JsonPersister", function(){

    describe( "download", function(){

	it( "passes JSON to the callback", function( done ) {

	    var obj = {
		'key0': 'value0',
		'key1': 'value1',
		'key2': {
		    'key2_0': 'value2_0',
		    'key2_1': 'value2_1'
		}
	    };

	    var ondownload = file => {

		var reader = new FileReader();
		reader.onload = event => {

		    var contents = event.target.result;
		    var result = JSON.parse( contents );

		    assert.equal( 'value0', result[ 'key0' ] )
		    assert.equal( 'value1', result[ 'key1' ] )

		    assert.equal(
			'value2_0', result[ 'key2' ][ 'key2_0' ] );
		    assert.equal(
			'value2_1', result[ 'key2' ][ 'key2_1' ] );

		    done();
		};

		reader.readAsText( file );
	    };

	    var persister = new JsonPersister( ondownload );

	    persister.download( obj );

	} );
    } );
} );
