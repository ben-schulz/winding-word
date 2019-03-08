class TextSlice{

    get length(){

	return this.end - this.start;
    }

    get isValid(){

	return "number" === typeof this.start
	    && "number" === typeof this.end;
    }

    get isClosed(){

	return "number" === typeof this.start
	    && "number" === typeof this.end
	    && 0 <= this.start
	    && 0 <= this.end;
    }

    constructor( start, end ){

	this.start = Math.min( start, end )
	this.end = Math.max( start, end )
    }
}

class CharBox{

    get innerText(){

	return this.element.innerText;
    }

    setCursor(){

	this.element.id = "cursor";

	var rect = this.element.getBoundingClientRect();

	if( 0 >= rect.top ){

	    window.scrollBy( 0, -window.innerHeight + 40 );
	}

	if( window.innerHeight <= rect.bottom ){

	    window.scrollBy( 0, window.innerHeight - 40 );
	}
    }

    clearCursor(){

	this.element.id = null;
    }

    setHighlight( type="text" ){

	this.element.classList.add( type + "Mark" );
    }

    clearHighlight( type="text" ){

	this.element.classList.remove( type + "Mark" );
    }

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

	this.text = word.text;
	this.charBoxes = [];

	for( var ix = 0; ix < word.text.length; ++ix ){

	    if( !Patterns.singleSpace.test( word.text[ ix ] ) ){
		var c = word.text[ ix ];
	    }
	    else{
		var c = " ";
	    }

	    var charBox = new CharBox( c );
	    this.element.appendChild( charBox.element );
	    this.charBoxes.push( charBox );
	}

	this.element.classList.add( "wordBox" );
    }
}

class LineBox{

    get length(){

	return this.charBoxes.length;
    }

    constructor( tokens ){

	this.element = document.createElement( "div" );

	this.charBoxes = [];
	this.wordBoxArray = [];
	for( var ix = 0; ix < tokens.length; ++ix ){

	    var wordBox = new WordBox( tokens[ ix ] );

	    var wordElement = wordBox.element;
	    var charElements = wordBox.charBoxes;

	    this.wordBoxArray.push( wordElement );
	    charElements.forEach(
		c => this.charBoxes.push( c ) );

	    this.element.appendChild( wordElement );
	}
    }
}

class PageBox{

    get lastPos(){

	return this.charBoxes.length - 1;
    }

    home( line ){

	if( 0 < line ){

	    var prevLine = line - 1;

	    return this.lineEnds[ prevLine ] + 1;
	}

	return 0;
    }

    end( line ){

	return this.lineEnds[ line ];
    }

    charPos( line, col ){

	var _line = Math.max( 0, line );
	var prevLine = Math.max( 0, _line - 1 );

	if( 0 < _line ){

	    var lineChars = this.lineEnds[ prevLine ] + 1;
	}
	else{
	    var lineChars = 0;
	}

	return lineChars + col;
    }

    lineNumber( charIndex ){

	if( 0 > charIndex || charIndex > this.lastPos ){

	    return -1;
	}

	var line = 0;
	while( charIndex > this.lineEnds[ line ] ){

	    line += 1;
	}

	return line;
    }

    textSlice( start, end ){

	if( 0 > start || this.lastPos < end ){

	    return null;
	}

	return this.text.slice( start, end ).join( "" );
    }

    charBoxAt( line, col ){

	return this.charBoxes[ this.charPos( line, col ) ];
    }

    charBoxRange( line1, col1, line2, col2 ){

	var ix1 = this.charPos( line1, col1 );
	var ix2 = this.charPos( line2, col2 );

	if( ix1 == ix2 ){

	    return [];
	}

	var slice = new TextSlice( ix1, ix2 );

	return this.charBoxes.slice( slice.start, slice.end + 1 );
    }

    constructor( lexerOutput ){

	this.element = document.createElement( "div" );
	this.element.classList.add( "textReader" );

	this.lines = [];
	this.lineEnds = [];
	this.charBoxes = [];
	this.text = [];

	var charCount = 0;
	lexerOutput.forEachWordLine( line => {

	    var lineBox = new LineBox( line );

	    charCount += lineBox.length;
	    this.lineEnds.push( charCount - 1 );

	    this.lines.push( lineBox );
	    lineBox.charBoxes.forEach( c => {

		this.charBoxes.push( c );
		this.text.push( c.text );
	    } );

	    this.element.appendChild( lineBox.element );
	} );
    }
}

class TextPage{


    get charCount(){

	return this.pageBox.charBoxes.length;
    }

    get lineCount(){

	return this._verses.lineCount;
    }

    lineEndCol( line ){

	if( line < this.lineCount ){

	    return ( this._verses
		     .lineText( line ).length - 1 );
	}

	return -1;
    }

    get currentLineEndCol(){

	return this.lineEndCol( this.cursorLine );
    }

    charBoxAt( line, col ){

	return this.pageBox.charBoxAt( line, col );
    }

    get cursorPos(){

	return this.pageBox.charPos(
	    this.cursorLine, this.cursorCol );
    }

    get markStartPos(){

	if( this.markSet ){

	    return this.pageBox.charPos(
		this.markLine, this.markCol );
	}

	return -1;
    }

    get cursorBox(){

	return this.charBoxAt(
	    this.cursorLine, this.cursorCol );
    }

    get cursorText(){

	return this.charBoxAt(
	    this.cursorLine, this.cursorCol ).text;
    }

    get markSet(){

	return null !== this.markLine;
    }

    _setCursor(){

	var line = this.cursorLine;
	var col = this.cursorCol;
	var charBox = this.charBoxAt( line, col );

	if( charBox ){
	    charBox.setCursor();
	}
    }

    _clearCursor(){

	var line = this.cursorLine;
	var col = this.cursorCol;
	var charBox = this.charBoxAt( line, col );

	if( charBox ){
	    charBox.clearCursor();
	}
    }

    cursorDown(){

	var nextLine = this.cursorLine + 1;

	if( this.lineCount <= nextLine ){

	    return;
	}

	var nextColumn = Math.min( this.cursorCol,
				   this.lineEndCol( nextLine ) );

	var nextPos = this.pageBox.charPos( nextLine,
					    nextColumn );

	var forwardMoves = nextPos - this.cursorPos;

	this.cursorRight( forwardMoves );
    }

    cursorUp(){

	var nextLine = this.cursorLine - 1;

	if( nextLine < 0 ){

	    return;
	}

	var nextColumn = Math.min( this.cursorCol,
				   this.lineEndCol( nextLine ) );

	var nextPos = this.pageBox.charPos( nextLine,
					    nextColumn );

	var backwardMoves = this.cursorPos - nextPos;

	this.cursorLeft( backwardMoves );
    }

    cursorRight( count=1 ){

	var prevPos = this.cursorPos;

	var colsRemaining = (
	    this.pageBox.end( this.cursorLine ) - this.cursorPos );

	this._clearCursor();
	if( count <= colsRemaining ){

	    this.cursorCol += count;
	}
	else if( this.cursorLine < this.lineCount - 1 ){

	    var newLineNumber = this.pageBox.lineNumber(
		this.cursorPos + count );

	    var newLineHome =
		this.pageBox.home( newLineNumber );

	    var newCol = (
		this.cursorPos + count  - newLineHome );

	    this.cursorCol = newCol;
	    this.cursorLine = newLineNumber;
	}
	else{

	    this.cursorCol = (
		this.pageBox.end( this.cursorLine )
		    - this.pageBox.home( this.cursorLine ) );
	}
	this._setCursor();

	if( !this.markSet ){

	    return;
	}

	var currentPos = this.cursorPos;
	for( var pos = prevPos; pos < currentPos; ++pos ){

	    if( this.markStartPos <= pos ){

		this.highlightChar( pos );
	    }
	    else{

		this.clearChar( pos );
	    }
	}

	this.markEndPos = Math.min( this.markEndPos + count,
				    this.charCount - 1 );
    }

    cursorLeft( count=1 ){

	var prevPos = this.cursorPos;
	var colsRemaining = this.cursorCol;

	this._clearCursor();
	if( count <= colsRemaining ){

	    this.cursorCol -= count;
	}
	else if( this.cursorLine > 0 ){

	    var newLine = this.pageBox.lineNumber(
		this.cursorPos - count );

	    var currentLineHome =
		this.pageBox.home( newLine );

	    var currentLineEnd =
		this.pageBox.lineEnds[ newLine ];

	    var newCol = (
		this.cursorPos - count - currentLineHome );

	    this.cursorCol = newCol;
	    this.cursorLine = newLine;
	}
	else{

	    this.cursorCol = 0;
	}
	this._setCursor();

	if( !this.markSet ){

	    return;
	}

	var currentPos = this.cursorPos;
	for( var pos = currentPos; pos < prevPos; ++pos ){

	    if( this.markStartPos > pos ){

		this.highlightChar( pos );
	    }
	    else{

		this.clearChar( pos );
	    }
	}

	this.markEndPos = Math.max( this.markEndPos - count, 0 );
    }

    wordRight(){

	if( this.cursorCol == this.pageBox.lastPos ){

	    return;
	}

	this.cursorRight();
	while( " " == this.cursorText ){

	    this.cursorRight();
	}

	var prevPos = this.cursorPos - 1;
	while( this.cursorText != " "
	       && prevPos != this.cursorPos ){

	    prevPos = this.cursorPos;
	    this.cursorRight();
	}
    }

    wordLeft(){

	if( 0 == this.cursorCol ){

	    return;
	}

	this.cursorLeft();
	while( " " == this.cursorText ){

	    this.cursorLeft();
	}

	var prevPos = this.cursorPos + 1;
	while( this.cursorText != " "
	       && prevPos != this.cursorPos ){

	    prevPos = this.cursorPos;
	    this.cursorLeft();
	}

	if( 1 < this.cursorPos ){
	    this.cursorRight();
	}
    }

    highlightChar( pos ){

	this.pageBox.charBoxes[ pos ]
	    .setHighlight( this.markType );
    }

    clearChar( pos, markType=null ){

	if( null === markType ){

	    var markType = this.markType;
	}

	this.pageBox.charBoxes[ pos ]
	    .clearHighlight( markType );
    }

    toggleMark( type="text" ){

	if( null !== this.markType && type != this.markType ){

	    return;
	}

	if( this.markSet ){

	    this.unsetMark( type );
	}
	else{

	    this.setMark( type );
	}
    }

    setMark( type="text" ){

	this.markLine = this.cursorLine;
	this.markCol = this.cursorCol;

	this.markType = type;

	this.markEndPos = this.markStartPos;

	this.activeMarks[ type ] = {

	    "start": this.markStartPos,
	    "end": null
	};
    }

    unsetMark( type="text" ){

	this.activeMarks[ type ][ "end" ] =
	    this.markEndPos;

	if( undefined === this.closedMarks[ type ] ){

	    this.closedMarks[ type ] = [];
	}

	var slice =
	    new TextSlice( this.markStartPos, this.markEndPos );

	this.closedMarks[ type ].push( {
	    "start": slice.start,
	    "end": slice.end
	} );

	this.clearMark();
    }

    clearMark(){

	this.markLine = null;
	this.markCol = null;

	this.markType = null;
	this.markEndPos = null;
    }

    get markedText(){

	var slice =
	    new TextSlice( this.markStartPos, this.markEndPos );

	return this.pageBox.textSlice( slice.start, slice.end );
    }

    persistMarks(){

	if( null == this.onpersist ){

	    return;
	}

	var output = {};
	this.markTypes.forEach( t => {

	    if( null === this.activeMarks[ t ].end ){

		var start = this.activeMarks[ t ].start;
		var end = this.cursorPos;

		var slice = new TextSlice( start, end );

		this.closedMarks[ t ].push( {
		    "start": slice.start,
		    "end": slice.end
		} );

	    }

	    output[ t ] = this.closedMarks[ t ];
	} );

	this.onpersist( output );
	this.clearAll();
    }

    get markTypes(){

	return Object.keys( this.activeMarks );
    }

    clearAll(){

	this.markTypes.forEach( t => {

	    this.closedMarks[ t ].forEach( m => {

		for( var pos = m.start; pos <= m.end; ++pos ){

		    this.clearChar( pos, t );
		}
	    } );
	} );

	this.clearMark();

	this.activeMarks = {};
	this.closedMarks = {};
    }

    constructor( text, lineLength=60 ){

	var verses = new Verse( text, lineLength );

	this._verses = verses;

	this.pageBox = new PageBox( verses );
	this.element = this.pageBox.element;

	this.cursorLine = 0;
	this.cursorCol = 0;

	this._setCursor();

	this.markLine = null;
	this.markCol = null;

	this.markType = null;
	this.markEndPos = null;

	this.activeMarks = {};
	this.closedMarks = {};

	this.onpersist = null;
	this._highlightedText = [];
    }
}
