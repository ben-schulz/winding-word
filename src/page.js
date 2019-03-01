class CharBox{

    constructor( c ){

	this.text = c;
	this.element = document.createElement( "div" );

	this.element.appendChild(
	    document.createTextNode( this.text ) );

	this.element.classList.add( "charBox" );
    }
}

class WordBox{

    constructor( word ){

	this.element = document.createElement( "div" );
	this.childNodes = [];

	for( var ix = 0; ix < word.text.length; ++ix ){

	    if( word.isPrintable ){
		var c = word.text[ ix ];
	    }
	    else{
		var c = " ";
	    }

	    var charBox = new CharBox( c );
	    this.element.appendChild( charBox.element );
	    this.childNodes.push( charBox.element );
	}

	this.element.classList.add( "wordBox" );
    }
}

class LineBox{

    constructor( tokens ){

	this.element = document.createElement( "div" );

	this.charBoxArray = [];
	this.wordBoxArray = [];
	for( var ix = 0; ix < tokens.length; ++ix ){

	    var wordBox = new WordBox( tokens[ ix ] );

	    var wordElement = wordBox.element;
	    var charElements = wordBox.childNodes;

	    this.wordBoxArray.push( wordElement );
	    charElements.forEach(
		c => this.charBoxArray.push( c ) );

	    this.element.appendChild( wordElement );
	}
    }
}

var PageElementFactory = ( function(){

    var lineElementType = "div";
    var pageElementType = "div";

    var makeLineElement = function( words ){

	var lineBox = new LineBox( words );
	return [ lineBox.element, lineBox.charBoxArray ];
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
