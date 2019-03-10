class Reader{

    get markNames(){

	return Object.keys( this.annotations.currentSubject );
    }

    addSubjectAndRedisplay(){

	this.page.clearAll();
	this.annotations.addSubject();

    }

    cycleAndRedisplay(){

	this.page.clearAll();
	this.annotations.cycleSubject();

	this.markNames.forEach( k => {

	    var entries = this.annotations.currentSubject[ k ];
	    entries.forEach( e => {

		var start = e.start;
		var end = e.end;

		this.page.highlightInterval( k, start, end );
	    } );
	} );
    }

    bindHandlers(){

	this.actionDispatch = {
	    "moveUp": _ => this.page.cursorUp(),
	    "moveDown": _ => this.page.cursorDown(),
	    "moveLeft": _ => this.page.cursorLeft(),
	    "moveRight": _ => this.page.cursorRight(),

	    "wordLeft": _ => this.page.wordLeft(),
	    "wordRight": _ => this.page.wordRight(),

	    "centerHere": _ => this.page.centerHere(),

	    "toggleMark": _ => this.page.toggleMark( "text" ),

	    "toggleSubject": _ => this.page.toggleMark( "subject" ),

	    "toggleRelation": _ => this.page.toggleMark( "relation" ),

	    "toggleObject": _ => this.page.toggleMark( "object" ),

	    "unsetMark": _ => this.page.unsetMark(),

	    "persistMarks": _ => this.page.persistMarks(),
	    "clearAll": _ => this.page.clearAll(),

	    "cycleSubject": _ => this.cycleAndRedisplay(),
	    "addSubject": _ => this.addSubjectAndRedisplay()
	};
    }

    bindKeys( keyMap ){

	this.keyDispatch = {};
	Object.keys( keyMap ).forEach( key => {

	    var actionName = keyMap[ key ];

	    this.keyDispatch[ key ] =
		this.actionDispatch[ actionName ];
	} );
    }

    constructor( page, annotations ){

	this.page = page;
	this.annotations = annotations;

	this.keyDispatch = null;
	this.actionDispatch = null;
	this.bindHandlers();

	this.page.onpersist = mark => {

	    annotations.pushMarksToCurrent( mark );
	};
    }
}
