class RaggedArray{

    charAt( line, col ){

	var index = this.lineLength * line + col;

	if( this._flat.length < index ){

	    return null;
	}

	return this._flat[ index ];
    }

    line( lineNumber ){

	var startIndex = 0;
	for( var ix = 0; ix < lineNumber; ++ix ){

	    var nextLineLength = this._lines[ ix ];
	    startIndex += nextLineLength;
	}

	var endIndex = startIndex + this._lines[ lineNumber ];

	return this._flat.slice( startIndex, endIndex );
    }

    constructor( text, lineLength=40 ){

	this._flat = text;
	this._lexemes = Lexer.lex( text );

	this.lineLength = lineLength;

	var lineEnds = [];
	var currentEnd = 0;
	for( var ix = 0; ix < this._lexemes.length; ++ix ){

	    var token = this._lexemes[ ix ];

	    if( token.length + currentEnd > lineLength ){

		lineEnds.push( currentEnd );
		currentEnd = 0;
	    }
	    currentEnd += token.length;
	}

	lineEnds.push( currentEnd );

	this._lines = lineEnds;
    }
}
