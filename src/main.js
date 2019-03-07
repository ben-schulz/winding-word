var Annotations = ( function(){

    return {
	"marks":[]
    }

}() );

var keyMap = {

    "w": "moveUp",
    "s": "moveDown",
    "a": "moveLeft",
    "d": "moveRight",

    "q": "wordLeft",
    "e": "wordRight",

    "m": "setMark",
    "u": "setSubject",
    "i": "setRelation",
    "o": "setObject",

    "n": "unsetMark",
    "Enter": "persistMarks",
    "Escape": "clearAll"
};

var bindHandlers = function( page ){

    return {
	"moveUp": _ => page.cursorUp(),
	"moveDown": _ => page.cursorDown(),
	"moveLeft": _ => page.cursorLeft(),
	"moveRight": _ => page.cursorRight(),

	"wordLeft": _ => page.wordLeft(),
	"wordRight": _ => page.wordRight(),

	"setMark": _ => page.toggleMark( "text" ),
	"setSubject": _ => page.toggleMark( "subject" ),
	"setRelation": _ => page.toggleMark( "relation" ),
	"setObject": _ => page.toggleMark( "object" ),

	"unsetMark": _ => page.unsetMark(),

	"persistMarks": _ => page.persistMarks(),
	"clearAll": _ => page.clearAll(),
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

    page.onpersist = mark => {

	Annotations.marks.push( mark );
    };

    var pageHandlers = bindHandlers( page );
    var keyHandlers = bindKeys( pageHandlers );

    bindKeyboardEvents( keyHandlers );

    document.body.appendChild( page.element );
};


var jsonDownloader = new JsonDownload();
document.body.appendChild( jsonDownloader.element );

jsonDownloader.value = Annotations;
