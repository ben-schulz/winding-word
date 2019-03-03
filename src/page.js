class CharBox{

    get innerText(){

	return this.element.innerText;
    }

    setCursor(){

	this.element.classList.add( "cursor" );
    }

    clearCursor(){

	this.element.classList.remove( "cursor" );
    }

    setHighlight(){

	this.element.classList.add( "mark" );
    }

    clearHighlight(){

	this.element.classList.remove( "mark" );
    }

    toggleHighlight(){

	this.element.classList.toggle( "mark" );
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

	    return this.lineEnds[ prevLine ];
	}

	return 0;
    }

    end( line ){

	return this.lineEnds[ line ] - 1;
    }

    charPos( line, col ){

	var _line = Math.max( 0, line );
	var prevLine = Math.max( 0, _line - 1 );

	if( 0 < line ){

	    var lineChars = this.lineEnds[ prevLine ];
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

    charBoxAt( line, col ){

	return this.charBoxes[ this.charPos( line, col ) ];
    }

    charBoxRange( line1, col1, line2, col2 ){

	var ix1 = this.charPos( line1, col1 );
	var ix2 = this.charPos( line2, col2 );

	if( ix1 == ix2 ){

	    return [];
	}

	var start = Math.min( ix1, ix2 );
	var end = Math.max( ix1, ix2 );

	return this.charBoxes.slice( start, end + 1 );
    }

    constructor( lexerOutput ){

	this.element = document.createElement( "div" );

	this.lines = [];
	this.lineEnds = [];
	this.charBoxes = [];

	var charCount = 0;
	lexerOutput.forEachWordLine( line => {

	    var lineBox = new LineBox( line );

	    charCount += lineBox.length;
	    this.lineEnds.push( charCount );

	    this.lines.push( lineBox );
	    lineBox.charBoxes.forEach( c => {

		this.charBoxes.push( c );
	    } );

	    this.element.appendChild( lineBox.element );
	} );
    }
}

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

	return this.pageBox.charBoxAt( line, col );
    }

    setMarkAt( line, col ){

	this.charBoxAt( line, col ).setHighlight();
    }

    clearMarkAt( line, col ){

	this.charBoxAt( line, col ).clearHighlight();
    }

    get cursorPos(){

	return this.pageBox.charPos(
	    this.cursorLine, this.cursorCol );
    }

    get markPos(){

	if( this.markSet ){

	    return this.pageBox.charPos(
		this.markLine, this.markCol );
	}

	return -1;
    }

    isAfterMark( line, col ){

	return ( this.markSet
		 && ( line > this.markLine
		      || ( line == this.markLine
			   && col >= this.markCol ) ) )
    }

    isBeforeMark( line, col ){

	return ( this.markSet
		 && ( line > this.markLine
		      || ( line == this.markLine
			   && col < this.markCol ) ) )
    }

    get cursorBox(){

	if( !this.charBoxAt(
	    this.cursorLine, this.cursorCol ) ){

	    console.info( this.cursorLine, this.cursorCol );
	}

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

	this._clearCursor();
	if( this.cursorLine < this.lineCount - 1 ){
	    this.cursorLine += 1;
	}
	this._setCursor();

	if( !this.markSet ){

	    return;
	}

	var currentLine = this.cursorLine;
	var col = this.cursorCol;

	var changedBoxes = this.pageBox.charBoxRange(
	    currentLine - 1, col, currentLine, col );

	if( this.cursorLine > this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].setHighlight();
	    }
	}
	else if( this.cursorLine < this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].clearHighlight();
	    }
	}
	else{

	    if( this.cursorPos < this.markPos ){

		for( var ix = 0; ix < this.cursorPos + 1; ++ix ){

		    this.pageBox.charBoxes[ ix ].clearHighlight();
		}
	    }
	    else{

		for( var ix = this.pageBox.home( this.cursorLine );
		     ix < this.markPos;
		     ++ix ){

		    this.pageBox.charBoxes[ ix ].clearHighlight();
		}

		for( var ix = this.markPos;
		     ix < this.cursorPos + 1; ++ix ){

		    this.pageBox.charBoxes[ ix ].setHighlight();
		}
	    }
	}
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

	var changedBoxes = this.pageBox.charBoxRange(
	    currentLine + 1, col, currentLine, col );

	if( this.cursorLine > this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].toggleHighlight( "mark" );
	    }
	}
	else if( this.cursorLine < this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].setHighlight( "mark" );
	    }
	}
	else{

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].toggleHighlight( "mark" );
	    }

	    this.setMarkAt( this.markLine, this.markCol );
	}
    }

    cursorRight( count=1 ){

	if( this.isAfterMark( this.cursorLine, this.cursorCol ) ){

	    this.cursorBox.setHighlight();
	    this._highlightedText.push( this.cursorText );
	}
	else{

	    this.cursorBox.clearHighlight();
	    this._highlightedText.pop();
	}

	var colsRemaining = (
	    this.pageBox.end( this.cursorLine ) - this.cursorPos );

	this._clearCursor();
	if( count <= colsRemaining ){

	    this.cursorCol += count;
	}
	else if( 0 == colsRemaining
		 && this.cursorLine < this.lineCount - 1 ){

	    this.cursorCol = 0;
	    this.cursorLine += 1;
	}
	else if( this.cursorLine < this.lineCount - 1 ){

	    var newLineNumber = this.pageBox.lineNumber(
		this.cursorPos + count );

	    var prevLineEnd =
		this.pageBox.lineEnds[ newLineNumber - 1 ];

	    this.cursorCol = (
		this.cursorPos + count  - prevLineEnd );

	    this.cursorLine = newLineNumber;

	}
	this._setCursor();
    }

    cursorLeft( count=1 ){

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
	this._setCursor();

	if( this.isBeforeMark( this.cursorLine, this.cursorCol ) ){

	    this.cursorBox.setHighlight();
	    this._highlightedText.push( this.cursorText );
	}
	else{

	    this.cursorBox.clearHighlight();
	    this._highlightedText.pop();
	}
    }

    setMark(){

	this.markLine = this.cursorLine;
	this.markCol = this.cursorCol;
    }

    clearMark(){

	this.markLine = null;
	this.markCol = null;
    }

    highlight(){

	if( null !== this.onhighlight ){

	    this.onhighlight( this._highlightedText.join( "" ) );
	}
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

	this.onhighlight = null;
	this._highlightedText = [];
    }
}
