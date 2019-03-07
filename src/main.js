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

    "m": "toggleMark",
    "u": "toggleSubject",
    "i": "toggleRelation",
    "o": "toggleObject",

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

	"toggleMark": _ => page.toggleMark( "text" ),
	"toggleSubject": _ => page.toggleMark( "subject" ),
	"toggleRelation": _ => page.toggleMark( "relation" ),
	"toggleObject": _ => page.toggleMark( "object" ),

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

var controls = document.getElementById( "controlPanel" );

var textLoader = new TextLoader();

controls.appendChild( textLoader.element );

textLoader.onload = text => {

    var page = new TextPage( text );

    Annotations.original = page.pageBox.text.join( "" );
    Annotations.created = Date.now();
    page.onpersist = mark => {

	Annotations.marks.push( mark );
	Annotations.created = Date.now();
    };

    var pageHandlers = bindHandlers( page );
    var keyHandlers = bindKeys( pageHandlers );

    bindKeyboardEvents( keyHandlers );

    document.body.appendChild( page.element );
};



var jsonDownloader = new JsonDownload();
controls.appendChild( jsonDownloader.element );

jsonDownloader.value = Annotations;


var keyLegend = document.createElement( "table" );
keyLegend.id = "keyLegend";

var makeDocCell = function( key, val ){

    var cell = document.createElement( "td" );
    cell.style.paddingLeft = "3px";
    cell.style.paddingRight = "3px";
    cell.style.paddingTop = "3px";
    cell.style.paddingBottom = "3px";

    cell.appendChild(
	document.createTextNode( key + " : " + val ) );

    return cell;
};

var keys = Object.keys( keyMap )
for( var ix = 0; ix < keys.length; ix += 3 ){

    var row = document.createElement( "tr" );

    var k0 = keys[ ix ];
    var cell0 = makeDocCell( k0, keyMap[ k0 ] );

    var k1 = keys[ ix + 1 ];
    if( undefined === k1 ){

	break;
    }
    var cell1 = makeDocCell( k1, keyMap[ k1 ] );

    var k2 = keys[ ix + 2 ];
    if( undefined === k2 ){

	break;
    }

    var cell2 = makeDocCell( k2, keyMap[ k2 ] );

    row.appendChild( cell0 );
    row.appendChild( cell1 );
    row.appendChild( cell2 );

    keyLegend.appendChild( row );
}

document.body.appendChild( keyLegend );
