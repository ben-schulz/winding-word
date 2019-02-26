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

    lineEndCol( line ){

	return ( this._verses
		 .lineText( line ).length - 1 );
    }

    get currentLineEndCol(){

	return ( this._verses
		 .lineText( this.cursorLine ).length - 1 );
    }

    charBoxAt( line, col ){

	return this._charBoxes[ line ][ col ];
    }

    setMarkAt( line, col ){

	this.charBoxAt( line, col ).classList.add( "mark" );
    }

    clearMarkAt( line, col ){

	this.charBoxAt( line, col ).classList.remove( "mark" );
    }

    charBoxRange( line1, col1, line2, col2 ){

	if( line1 < line2 ){

	    var startLine = line1;
	    var endLine = line2;

	    var startCol = col1;
	    var endCol = col2;
	}
	else if( line1 > line2 ){

	    var startLine = line2;
	    var endLine = line1;

	    var startCol = col2;
	    var endCol = col1;
	}
	else{

	    var line = line1;

	    var startCol = Math.min( col1, col2 );
	    var endCol = Math.max( col1, col2 );

	    var result = [];
	    for( var col = startCol; col <= endCol; ++col ){

		result.push( this.charBoxAt( line, col ) );
	    }

	    return result;
	}

	var result = [];
	var firstLineLength = this.lineEndCol( startLine );

	for( var col = startCol; col <= firstLineLength; ++col ){

	    result.push( this.charBoxAt( startLine, col ) );
	}

	for( var line = startLine + 1; line < endLine; ++line ){

	    for( var col = 0; col <= this.lineEndCol( line ); ++col ){
		result.push( this.charBoxAt( line, col ) );
	    }
	}

	for( var col = 0; col <= endCol; ++col ){

	    result.push( this.charBoxAt( endLine, col ) );
	}

	return result;
    }

    get cursorBox(){

	return this.charBoxAt(
	    this.cursorLine, this.cursorCol );
    }

    get markSet(){

	return null !== this.markLine;
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

	if( !this.markSet ){

	    return;
	}

	var currentLine = this.cursorLine;
	var prevLine = currentLine - 1;
	var col = this.cursorCol;

	var changedBoxes = this.charBoxRange(
	    prevLine, col, currentLine, col );

	if( prevLine >= this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].classList.add( "mark" );
	    }
	}
	else if( prevLine < this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].classList.toggle( "mark" );
	    }
	}

	this.setMarkAt( this.cursorLine, this.cursorCol );
	this.setMarkAt( this.markLine, this.markCol );
    }

    cursorUp(){

	this._clearCursor();
	if( 0 < this.cursorLine ){
	    this.cursorLine -= 1;
	}
	this._setCursor();

	if( !this.markSet ){

	    return;
	}

	var currentLine = this.cursorLine;
	var prevLine = currentLine + 1;
	var col = this.cursorCol;

	var changedBoxes = this.charBoxRange(
	    prevLine, col, currentLine, col );

	if( prevLine > this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].classList.toggle( "mark" );
	    }
	}
	else if( prevLine <= this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].classList.add( "mark" );
	    }
	}

	this.setMarkAt( this.cursorLine, this.cursorCol );
	this.setMarkAt( this.markLine, this.markCol );
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

	if( !this.markSet ){
	    return;
	}

	if( this.markLine < this.cursorLine ){

	    this.cursorBox.classList.add( "mark" );
	}
	else if( this.markLine == this.cursorLine
		 && this.cursorCol < this.markCol ){

	    this.cursorBox.classList.remove( "mark" );
	}
	else{

	    this.cursorBox.classList.add( "mark" );
	}
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

	if( !this.markSet ){
	    return;
	}

	if( this.markLine < this.cursorLine ){

	    this.cursorBox.classList.remove( "mark" );
	}
	else if( this.markLine == this.cursorLine
	       && this.markCol < this.cursorCol ){

	    this.cursorBox.classList.remove( "mark" );
	}
	else{
	    this.cursorBox.classList.add( "mark" );
	}

    }

    setMark(){

	this.markLine = this.cursorLine;
	this.markCol = this.cursorCol;

	this.cursorBox.classList.add( "mark" );
    }

    clearMark(){

	this.markLine = null;
	this.markCol = null;
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

	this._setCursor();

	this.markLine = null;
	this.markCol = null;
    }
}
