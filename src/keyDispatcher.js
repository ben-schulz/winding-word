class CursorEvent{

    constructor( type ){

	var detail = {

	    "type": type
	};

	this.type = type;
	this.event = new CustomEvent( "cursorInput",
				      { "detail": detail } );
    }
}

class KeyDispatcher{

    subscribe( eventType, handler ){

	this._handlers[ eventType ] = handler;
    }

    dispatch( event ){

	this._handlers[ event.type ]( event.detail );
    }

    constructor( mapping = null ){

	this._handlers = mapping || {};
    }
}
