class Log {
	static init(){
		if ( typeof Log.logs == 'undefined' ) {
        	Log.logs = [];
    	}
    	if ( typeof Log.maxLength == 'undefined' ) {
        	Log.maxLength = 100;
    	}
	}

	static log(x){
		this.init();

		Log.logs.push(x);
		if(Log.maxLength <= Log.logs.length){
			Log.logs.pop();
		}
	}

	static empty(){
		Log.logs = [];
	}

	static toString(){
		this.init();

		var rv = "";
		for (var l of Log.logs){ 
			rv += "### " + l + "\n";
		}
		return rv;
	}


	static toStringLastN(n){
		this.init();

		var rv = "";
		for (var i = Math.min(0, Log.logs.length-n); i < Log.logs.length; i++) {
			rv += "### " + Log.logs[i] + "\n";
		}
		return rv;
	}

};