

var _Log = class _Log{
	constructor() {
		this.logs = [];
	}

	log(x){
		this.logs.push(x);
	}

	toString(){
		var rv = "";
		for (var log of this.logs){ 
			rv += log + "\n";
		}
		return rv;
	}

};

var Log = new _Log();