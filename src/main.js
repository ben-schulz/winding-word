var textLoader = new TextLoader();

document.body.appendChild( textLoader.element );

textLoader.onload = text => {

    var textNode = document.createTextNode( text );

    document.body.appendChild( textNode );
};
