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

    _charPos( line, col ){

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

    charBoxAt( line, col ){

	return this.charBoxes[ this._charPos( line, col ) ];
    }

    charBoxRange( line1, col1, line2, col2 ){

	var ix1 = this._charPos( line1, col1 );
	var ix2 = this._charPos( line2, col2 );

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
	    currentLine - 1, col, currentLine, col - 1 );

	if( this.cursorLine > this.markLine ){

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].setHighlight();
	    }
	}
	else{

	    for( var ix = 0; ix < changedBoxes.length; ++ix ){

		changedBoxes[ ix ].toggleHighlight();
	    }
	}

	this.setMarkAt( this.cursorLine, this.cursorCol );
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

    cursorRight(){

	if( this.isAfterMark( this.cursorLine, this.cursorCol ) ){

	    this.cursorBox.setHighlight();
	    this._highlightedText.push( this.cursorText );
	}
	else{

	    this.cursorBox.clearHighlight();
	    this._highlightedText.pop();
	}

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
