describe("Keyboard", function(){

    describe("events", function(){

	it("registers keypress", function(){

	    var boundElement = document.createElement( "div" );

	    var registered = false;
	    boundElement.addEventListener(
		"keypress", function( event ){

		if( 'x' == event.detail.key.keyValue ){
		    registered = true;
		}
	    });

	    var keyboard = new KeyboardInput( boundElement );

	    keyboard.keypress( 'x' );

	    assert.isTrue( registered );

	});

	it("registers keydown", function(){
	    var boundElement = document.createElement( "div" );

	    var registered = false;

	    boundElement.addEventListener(
		"keydown", function( event ){

		if( 'x' == event.detail.key.keyValue ){
		    registered = true;
		}
	    });

	    var keyboard = new KeyboardInput( boundElement );

	    keyboard.keydown( 'x' );

	    assert.isTrue( registered );
	});


	it("registers keyup", function(){
	    var boundElement = document.createElement( "div" );

	    var registered = false;
	    boundElement.addEventListener(
		"keyup", function( event ){

		if( 'x' == event.detail.key.keyValue ){
		    registered = true;
		}
	    });

	    var keyboard = new KeyboardInput( boundElement );

	    keyboard.keyup( 'x' );

	    assert.isTrue( registered );

	});

    });


    describe("typeKeys method", function(){

	it("reproduces printable strings", function(){

	    var boundElement =
		document.createElement( "input" );

	    boundElement.type = "text";

	    boundElement.addEventListener(
		"keypress", function( event ){

		    boundElement.value +=
			event.detail.key.keyValue;
	    });

	    var keyboard = new KeyboardInput( boundElement );

	    keyboard.typeKeys( "hello world" );

	    assert.equal( "hello world", boundElement.value );
	});

    });
});
