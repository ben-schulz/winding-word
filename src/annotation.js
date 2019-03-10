class Annotation{

    updateTimeStamp(){

	this.modified = Date.now();
    }

    get currentSubject(){

	return this.marks[ this._markBucket ];
    }

    addSubject(){

	this.marks.push( [] );
    }

    cycleSubject(){

	if( this._markBucket == this.marks.length - 1 ){

	    this._markBucket = 0;
	}

	this._markBucket += 1;
    }

    constructor( original ){

	this.original = original;

	this._markBucket = 0;

	this.marks = [ [] ];

	this.created = Date.now();
	this.modified = Date.now();
    }
}
