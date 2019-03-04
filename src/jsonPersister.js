class JsonPersister{

    download( data ){

	var json = JSON.stringify( data );
	var type = "application/json";

	var file = new Blob( [ json ], { "type": type } );

	this.ondownload( file );
    }

    constructor( ondownload ){

	this.ondownload = ondownload;
    }
}


class JsonDownload{

    _download( file ){

	var a = document.createElement( "a" );
	var url = URL.createObjectURL( file );

	a.href = url;
	a.download = this.filename || "out.json";
	document.body.appendChild( a );

	a.click();

	setTimeout(function() {

	    document.body.removeChild( a );
	    window.URL.revokeObjectURL( url );

	}, 0);
    }

    downloadObject( value ){

	this._persister.download( value );
    }

    click(){

	if( null !== this.value ){

	    this.downloadObject( this.value );
	}
    }

    constructor( displayText="download marks" ){

	this.element = document.createElement( "div" );

	this.element.appendChild(
	    document.createTextNode( displayText ) );

	this.element.classList.add( "jsondownloader" );

	this.filename = 'out.json';
	this.value = null;

	this._persister = new JsonPersister( this._download );

	this.element.addEventListener( "click", event => {

	    this.click( event );
	} );
    }
}
