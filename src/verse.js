class RaggedArray{

    charAt( line, col ){

	var index = this.lineLength * line + col;

	if( this._flat.length < index ){

	    return null;
	}

	return this._flat[ index ];
    }

    constructor( objs, lineLength=40 ){

	this._flat = objs;

	this.lineLength = lineLength;
    }
}
