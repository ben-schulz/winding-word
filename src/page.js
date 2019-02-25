var PageElementFactory = ( function(){

    var charElementType = "div";
    var wordElementType = "div";
    var lineElementType = "div";
    var pageElementType = "div";

    var makeCharElement = function( c ){

	var charElement = document.createElement( charElementType );

	charElement.appendChild(
	    document.createTextNode( c ) );

	charElement.classList.add( "charBox" );

	return charElement;
    };

    var makeWordElement = function( word ){

	var wordElement = document.createElement( wordElementType );
	var charElements = [];

	for( var ix = 0; ix < word.text.length; ++ix ){

	    if( word.isPrintable ){
		var c = word.text[ ix ];
	    }
	    else{
		var c = " ";
	    }

	    var element = makeCharElement( c );
	    wordElement.appendChild( element );
	    charElements.push( element );
	}

	wordElement.classList.add( "wordBox" );

	return [ wordElement, charElements ];
    };

    var makeLineElement = function( words ){

	var lineElement = document.createElement( lineElementType );
	
	var charElements = [];
	var wordElements = [];
	for( var ix = 0; ix < words.length; ++ix ){

	    var childElements = makeWordElement( words[ ix ] );

	    var wordElement = childElements[ 0 ];
	    charElements = charElements.concat(
		childElements[ 1 ] );

	    lineElement.appendChild( wordElement );
	}

	return [ lineElement, charElements ];
    };

    var makePageElement = function( lines ){

	var pageElement = document.createElement( pageElementType );

	var charLines = [];
	lines.forEachWordLine( line => {

	    var childElements = makeLineElement( line );
	    var lineElement = childElements[ 0 ];
	    var charElements = childElements[ 1 ];

	    charLines.push( charElements );

	    pageElement.appendChild( lineElement );
	} );

	return [ pageElement, charLines ];
    };

    return {

	"lineElementType": lineElementType,
	"wordElementType": wordElementType,
	"pageElementType": pageElementType,

	"makeWordElement": makeWordElement,
	"makeLineElement": makeLineElement,
	"makePageElement": makePageElement,
    };

}() );

class TextPage{


    get lineCount(){

	return this._verses.lineCount;
    }

    get currentLineEndCol(){

	return ( this._verses
		 .lineText( this.cursorLine ).length - 1 );
    }

    charBoxAt( line, col ){

	return this._charBoxes[ line ][ col ];
    }

    _setCursor(){

	var line = this.cursorLine;
	var col = this.cursorCol;
	var charBox = this.charBoxAt( line, col );

	if( charBox ){
	    charBox.classList.add( "cursor" );
	}
    }

    _clearCursor(){

	var line = this.cursorLine;
	var col = this.cursorCol;
	var charBox = this.charBoxAt( line, col );

	if( charBox ){
	    charBox.classList.remove( "cursor" );
	}
    }

    cursorDown(){

	this._clearCursor();
	if( this.cursorLine < this.lineCount - 1 ){
	    this.cursorLine += 1;
	}
	this._setCursor();
    }

    cursorUp(){

	this._clearCursor();
	if( 0 < this.cursorLine ){
	    this.cursorLine -= 1;
	}
	this._setCursor();
    }

    cursorRight(){

	this._clearCursor();
	if( this.cursorCol < this.currentLineEndCol ){

	    this.cursorCol += 1;
	}
	else if( this.cursorLine < this.lineCount - 1 ){

	    this.cursorCol = 0;
	    this.cursorLine += 1;
	}
	this._setCursor();
    }

    cursorLeft(){

	this._clearCursor();
	if( 0 < this.cursorCol ){

	    this.cursorCol -= 1;
	}

	else if( 0 < this.cursorLine ){

	    this.cursorLine -= 1;
	    this.cursorCol = this.currentLineEndCol;
	}
	this._setCursor();
    }

    constructor( text, lineLength=60 ){

	var verses = new Verse( text, lineLength );

	this._verses = verses;

	var childNodes =
	    PageElementFactory.makePageElement( verses );

	this.element = childNodes[ 0 ];
	this._charBoxes = childNodes[ 1 ];

	this.cursorLine = 0;
	this.cursorCol = 0;
    }
}
