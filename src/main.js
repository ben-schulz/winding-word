var keyMap = {

    "w": "moveUp",
    "s": "moveDown",
    "a": "moveLeft",
    "d": "moveRight",
    "m": "setMark",
    "n": "clearMark",
    "Enter": "persistHighlight",
    "Escape": "clearAll"
};

var bindHandlers = function( page ){

    return {
	"moveUp": _ => page.cursorUp(),
	"moveDown": _ => page.cursorDown(),
	"moveLeft": _ => page.cursorLeft(),
	"moveRight": _ => page.cursorRight(),
	"setMark": _ => page.setMark(),
	"clearMark": _ => page.clearMark(),
    };
};

var bindKeys = function( handlers ){

    var result = {};
    Object.keys( keyMap ).forEach( key => {

	var actionName = keyMap[ key ];

	result[ key ] = handlers[ actionName ];
    } );

    return result;
};


var bindKeyboardEvents = function( handlers ){

    document.addEventListener(

	"keydown", event => {

	    var key = event.key;

	    if( key in handlers ){
		handlers[ key ]();
	    }
	}
    );
};

var textLoader = new TextLoader();

document.body.appendChild( textLoader.element );

textLoader.onload = text => {

    var page = new TextPage( text );

    var pageHandlers = bindHandlers( page );
    var keyHandlers = bindKeys( pageHandlers );

    bindKeyboardEvents( keyHandlers );

    document.body.appendChild( page.element );
};


var jsonDownloader = new JsonDownload();
document.body.appendChild( jsonDownloader.element );

jsonDownloader.value = { 'ok': 'neat', 'wow':'awesome' };
