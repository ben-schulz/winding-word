describe( "KeyDispatcher", function(){

    describe( "on initialize", function(){

	it( "sets handler registry to mapping", function( done ){

	    var moveDownHandler = function(){

		done();
	    };

	    var mapping = {

		"moveDown": moveDownHandler
	    };


	    var dispatcher = new KeyDispatcher( mapping );
	    var moveDownEvent = new CursorEvent( "moveDown" );

	    dispatcher.dispatch( moveDownEvent );

	} );

    } );

    describe( "on CursorEvent", function(){

	it( "calls the registered handler", function( done ){

	    var dispatcher = new KeyDispatcher();

	    var check = function(){

		done();
	    };

	    var event = new CursorEvent( "moveUp" );

	    dispatcher.subscribe( "moveUp", check );
	    dispatcher.dispatch( event );
	} );

    } );

    describe( "keyboard integration", function(){

	it( "passes key mappings to dispatcher", function( done ){

	    var boundElement = document.createElement( "div" );

	    var mappings = {

		"w": "moveUp",
		"s": "moveDown",
		"a": "moveLeft",
		"d": "moveRight",
	    };

	    var moveDownHandler = function(){

		done();
	    };

	    var handlers = {

		"moveDown": moveDownHandler
	    };

	    var dispatcher = new KeyDispatcher( handlers );

	    boundElement.addEventListener(
		"keydown", event => {

		    var key = event.detail.key.keyValue;
		    var _event = new CursorEvent( mappings[ key ] );

		    dispatcher.dispatch( _event );
		} );

	    var keyboard = new KeyboardInput( boundElement );

	    keyboard.keydown( "s" );

	} );
    } );
} );
