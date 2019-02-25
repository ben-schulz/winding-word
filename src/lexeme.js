var Patterns = (function(){
    return {

	"singleAlphaNum": /^[a-zA-Z0-9]$/,
	"alphanumOnly": /^[a-zA-Z0-9]+$/,
	"spaceOnly": /^\s+$/,
	"isPrintable": /^\S+$/,
    };
})();


class Lexeme{

    get length(){

	return this.text.length;
    }

    get isSimpleWord(){

	return Patterns.alphanumOnly.test( this.text );
    }

    get isSpace(){

	return Patterns.spaceOnly.test( this.text );
    }

    get isPrintable(){

	return Patterns.isPrintable.test( this.text );
    }

    constructor( text ){

	this.text = text;
    }
}


var Lexer = (function(){

    return{

	"isAlphaNum": function( c ){

	    return Patterns.singleAlphaNum.test( c );
	},

	"lex": function( text ){

	    if( 1 > text.length ){

		return [];
	    }

	    var tokens = [];
	    var currentToken = "";

	    var currentIsAlpha = this.isAlphaNum( text.charAt( 0 ) );
	    var prevIsAlpha = !currentIsAlpha;

	    for( var ix = 0; ix < text.length; ++ix ){

		var c = text.charAt( ix );

		prevIsAlpha = currentIsAlpha;
		currentIsAlpha = this.isAlphaNum( c );

		if( ( prevIsAlpha && currentIsAlpha )
		    || ( !prevIsAlpha && !currentIsAlpha ) ){

		    currentToken += c;
		}

		else{

		    tokens.push( new Lexeme( currentToken ) );
		    currentToken = c;
		}
	    }

	    tokens.push( new Lexeme( currentToken ) );

	    return tokens;
	}
    };

})();
