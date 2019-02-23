var textLoader = new TextLoader();

document.body.appendChild( textLoader.element );

textLoader.onload = text => {

    var textNode = new TextPage( text )

    document.body.appendChild( textNode.element );
};


var jsonDownloader = new JsonDownload();
document.body.appendChild( jsonDownloader.element );

jsonDownloader.value = { 'ok': 'neat', 'wow':'awesome' };
