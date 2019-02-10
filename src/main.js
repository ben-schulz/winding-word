var textLoader = new TextLoader();

document.body.appendChild( textLoader.element );

textLoader.onload = text => {

    var textNode = document.createTextNode( text );

    document.body.appendChild( textNode );
};


var jsonDownloader = new JsonDownload();
document.body.appendChild( jsonDownloader.element );

jsonDownloader.value = { 'ok': 'neat', 'wow':'awesome' };
