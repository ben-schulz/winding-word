var reader = null;

var keyMap = {

    "w": "moveUp",
    "s": "moveDown",
    "a": "moveLeft",
    "d": "moveRight",

    "q": "wordLeft",
    "e": "wordRight",

    "l": "centerHere",

    "m": "toggleMark",
    "u": "toggleSubject",
    "i": "toggleRelation",
    "o": "toggleObject",

    "h": "cycleSubject",
    "n": "addSubject",

    "Enter": "persistMarks",
    "Escape": "clearAll"
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

    var currentText = document.getElementById( "mainText" );
    if( currentText ){

	document.body.removeChild( currentText );
    }

    var page = new TextPage( text );
    var annotations = new Annotation();

    annotations.original = page.pageBox.text.join( "" );

    reader = new Reader( page, annotations );
    reader.bindKeys( keyMap );
    bindKeyboardEvents( reader.keyDispatch );

    page.element.id = "mainText";
    document.body.appendChild( page.element );

    jsonDownloader.value = reader.annotations;
};

var jsonDownloader = new JsonDownload();
controls.appendChild( jsonDownloader.element );

jsonDownloader.value = {};

var rereadButton = new TextLoader( "reread saved markup" );
rereadButton.element.id = "rereadButton";
rereadButton.element.classList.remove( "textloader" );
controls.appendChild( rereadButton.element );

rereadButton.onload = markup => {

    var currentText = document.getElementById( "mainText" );
    if( currentText ){

	document.body.removeChild( currentText );
    }

    var obj = JSON.parse( markup );

    var annotations = new Annotation();

    obj.marks.forEach( m => {

	annotations.pushMarksToCurrent( m );
	annotations.addSubject();
    } );

    annotations.original = obj.original;
    annotations.created = obj.created;

    var page = new TextPage( annotations.original );

    reader = new Reader( page, annotations );
    reader.bindKeys( keyMap );
    bindKeyboardEvents( reader.keyDispatch );

    page.element.id = "mainText";
    document.body.appendChild( page.element );

    jsonDownloader.value = reader.annotations;
};


var keyLegend = document.getElementById( "keyLegend" );

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
