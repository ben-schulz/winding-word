class TextLoader{

    load( file ){

	var reader = new FileReader();
	reader.onload = event => {

	    var contents = event.target.result; 

	    console.info( contents );
	    if( null !== this.onload ){

		this.onload( contents );
	    }
	};

	reader.readAsText( file );
    }

    constructor(){

	this.onload = null;

	this.element = document.createElement( "div" );
	this.element.classList.add( "textLoader" );

	this.upload = document.createElement( "input" );
	this.upload.type = "file";

	this.upload.addEventListener( "change", event => {

	    this.load( this.upload.files[ 0 ] );
	} );

	this.element.addEventListener( "click", event => {

	    this.upload.click( event );
	} );
    }
}
