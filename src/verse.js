class Verse{

    charAt( line, col ){

	var index = this.lineLength * line + col;

	if( this._flat.length < index ){

	    return null;
	}

	return this._flat[ index ];
    }

    line( lineNumber ){

	if( lineNumber >= this._lines.length ){

	    return null;
	}

	var lineStart = this._lines[ lineNumber ][ 0 ];
	var lineEnd = this._lines[ lineNumber ][ 1 ];

	return this._flat.slice( lineStart, lineEnd );
    }

    _calculateLineEndColumns( lineLength ){

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

	return lineEnds;
    }

    _calculateLineIndices( lineEnds ){

	var lines = []

	var lineNumber = 0;
	while( lineNumber < lineEnds.length ){

	    var startIndex = 0;
	    for( var ix = 0; ix < lineNumber; ++ix ){

		var nextLineLength = lineEnds[ ix ];
		startIndex += nextLineLength;
	    }

	    var endIndex = (
		startIndex + lineEnds[ lineNumber ] );

	    lines.push( [ startIndex, endIndex ] );
	    lineNumber += 1;
	}

	return lines;
    }

    constructor( text, lineLength=40 ){

	this._flat = text;
	this._lexemes = Lexer.lex( text );

	this.lineLength = lineLength;

	var lineEnds = this._calculateLineEndColumns( lineLength );
	this._lines = 	this._calculateLineIndices( lineEnds );
    }
}
