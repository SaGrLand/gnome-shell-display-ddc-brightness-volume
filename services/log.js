class Log {
	static init(){
		if ( typeof Log.logs == 'undefined' ) {
        	Log.logs = [];
    	}
    	if ( typeof Log.maxLength == 'undefined' ) {
        	Log.maxLength = 50;
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
		this.init();

		Log.logs = [];
	}

	static toString(){
		this.init();

		var rv = "";
		for (var log of Log.logs){ 
			rv += "### " + log + "\n";
		}
		return rv;
	}

};