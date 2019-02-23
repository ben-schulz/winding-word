var PageElementFactory = ( function(){

    var lineElementType = "div";
    var wordElementType = "span";
    var pageElementType = "div";

    var makeWordElement = function( word ){

	var wordElement = document.createElement( wordElementType );

	wordElement.appendChild(
	    document.createTextNode( word.text ) );

	return wordElement;
    };

    var makeLineElement = function( words ){

	var lineElement = document.createElement( lineElementType );
	
	var wordElements = [];
	for( var ix = 0; ix < words.length; ++ix ){

	    var wordElement = makeWordElement( words[ ix ] );
	    lineElement.appendChild( wordElement );
	}

	return lineElement;
    };

    var makePageElement = function( lines ){

	var pageElement = document.createElement( pageElementType );

	lines.forEachWordLine( line => {

	    pageElement.appendChild(
		makeLineElement( line ) );
	} );

	return pageElement;
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

    cursorDown(){

	if( this.cursorLine < this.lineCount - 1 ){
	    this.cursorLine += 1;
	}
    }

    cursorUp(){

	if( 0 < this.cursorLine ){
	    this.cursorLine -= 1;
	}
    }

    cursorRight(){

	if( this.cursorCol < this.currentLineEndCol ){

	    this.cursorCol += 1;
	}
	else if( this.cursorLine < this.lineCount - 1 ){

	    this.cursorCol = 0;
	    this.cursorLine += 1;
	}
    }

    cursorLeft(){

	if( 0 < this.cursorCol ){

	    this.cursorCol -= 1;
	}

	else if( 0 < this.cursorLine ){

	    this.cursorLine -= 1;
	    this.cursorCol = this.currentLineEndCol;
	}
    }

    constructor( text, lineLength=40 ){

	var verses = new Verse( text, lineLength );

	this._verses = verses;
	this.element = PageElementFactory.makePageElement( verses );

	this.cursorLine = 0;
	this.cursorCol = 0;
    }
}
