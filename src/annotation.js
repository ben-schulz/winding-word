class Annotation{

    updateTimeStamp(){

	this.modified = Date.now();
    }

    get currentSubject(){

	return this.marks[ this._markBucket ];
    }

    pushToCurrent( key, value ){

	if( undefined === this.currentSubject[ key ] ){

	    this.currentSubject[ key ] = [];
	}

	if( !value ){

	    return;
	}

	value.forEach( x => {

	    var mark = {

		"start": x.start,
		"end": x.end
	    };

	    this.currentSubject[ key ].push( mark );
	} );
    }

    addSubject(){

	this.marks.push( {} );
	this._markBucket = this.marks.length - 1;
    }

    cycleSubject(){

	if( this._markBucket == this.marks.length - 1 ){

	    this._markBucket = 0;
	}
	else{

	    this._markBucket += 1;
	}
    }

    constructor(){

	this.original = null;

	this._markBucket = 0;

	this.marks = [ {} ];

	this.created = Date.now();
	this.modified = Date.now();
    }
}
