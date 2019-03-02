class Verse{

    get lineCount(){

	return this._textLines.length;
    }

    forEachWordLine( f ){

	for( var ix = 0; ix < this.lineCount; ++ix ){

	    f( this.lineWords( ix ) );
	}
    }

    lineWords( lineNumber ){

	if( this._wordLineEnds.length == lineNumber ){

	    var startIndex = this._wordLineEnds[ lineNumber - 1];

	    return this._lexemes.slice( startIndex );
	}

	if( 0 < lineNumber ){

	    var startIndex = this._wordLineEnds[ lineNumber - 1];
	    var endIndex = this._wordLineEnds[ lineNumber ];

	    return this._lexemes.slice( startIndex, endIndex );
	}

	if( 0 == lineNumber ){

	    var startIndex = 0;
	    var endIndex = this._wordLineEnds[ lineNumber ];

	    return this._lexemes.slice( startIndex, endIndex );
	}

    }

    lineText( lineNumber ){

	if( lineNumber >= this._textLines.length ){

	    return null;
	}

	var lineStart = this._textLines[ lineNumber ][ 0 ];
	var lineEnd = this._textLines[ lineNumber ][ 1 ];

	return this._flat.slice( lineStart, lineEnd );
    }

    _calculateLineEndColumns( lineLength ){

	var textLineEnds = [];
	var currentEnd = 0;

	for( var ix = 0; ix < this._lexemes.length; ++ix ){

	    var token = this._lexemes[ ix ];

	    if( token.length + currentEnd > lineLength ){

		textLineEnds.push( currentEnd );
		currentEnd = 0;
	    }
	    currentEnd += token.length;
	}

	textLineEnds.push( currentEnd );

	return textLineEnds;
    }

    _calculateTextLineIndices( lineEnds ){

	var textLines = [];

	var lineNumber = 0;
	while( lineNumber < lineEnds.length ){

	    var startIndex = 0;
	    for( var ix = 0; ix < lineNumber; ++ix ){

		var nextLineLength = lineEnds[ ix ];
		startIndex += nextLineLength;
	    }

	    var endIndex = (
		startIndex + lineEnds[ lineNumber ] );

	    textLines.push( [ startIndex, endIndex ] );
	    lineNumber += 1;
	}

	return textLines;
    }

    _calculateWordLineIndices( lineEnds ){

	var wordLineIndices = [];
	var lexemeIndex = 0;

	for( var ix = 0; ix < lineEnds.length; ++ix ){

	    var lineLength = lineEnds[ ix ];

	    var columnsUsed = 0;
	    while( columnsUsed < lineLength ){

		columnsUsed += this._lexemes[ lexemeIndex ].length;
		lexemeIndex += 1;
	    }

	    wordLineIndices.push( lexemeIndex );
	}

	return wordLineIndices;
    }

    constructor( text, lineLength=40 ){

	this._flat = text;
	this._lexemes = Lexer.lex( text );

	this.lineLength = lineLength;

	var textLineEnds =
	    this._calculateLineEndColumns( lineLength );

	this._textLines = this._calculateTextLineIndices(
	    textLineEnds );

	this._wordLineEnds = this._calculateWordLineIndices(
	    textLineEnds );
    }
}
