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

	    if( word.isPrintable ){
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

    unsetMark(){

	this.activeMarks[ this.markType ][ "end" ] =
	    this.markEndPos;

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

	    var slice = new TextSlice(
		this.activeMarks[ t ].start,
		this.activeMarks[ t ].end );

	    if( slice.isClosed ){

		output[ t ] =
		    this.pageBox.textSlice(
			slice.start, slice.end );
	    }
	} );

	this.onpersist( output );
	this.clearAll();
    }

    get markTypes(){

	return Object.keys( this.activeMarks );
    }

    clearAll(){

	this.markTypes.forEach( t => {

	    var slice = new TextSlice(
		    this.activeMarks[ t ].start,
		    this.activeMarks[ t ].end );

	    if( slice.isValid ){

		for( var pos = slice.start;
		     pos <= slice.end; ++pos ){

		    this.clearChar( pos, t );
		}
	    }

	} );

	this.clearMark();

	this.activeMarks = {};
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

	this.onpersist = null;
	this._highlightedText = [];
    }
}
