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

    constructor( text, lineLength=40 ){

	var verses = new Verse( text, lineLength );

	this.element = PageElementFactory.makePageElement( verses );

    }
}
