var Log = class  {
	static init(){
		if ( typeof this.logs == 'undefined' ) {
        	this.logs = [];
    	}
    	if ( typeof this.maxLength == 'undefined' ) {
        	this.maxLength = 100;
    	}
	}

	static log(x){
		this.init();

		this.logs.push(x);
		if(this.maxLength <= this.logs.length){
			this.logs.pop();
		}
	}

	static empty(){
		this.logs = [];
	}

	static toString(){
		this.init();

		var rv = "";
		for (var l of this.logs){ 
			rv += "### " + l + "\n";
		}
		return rv;
	}


	static toStringLastN(n){
		this.init();

		var rv = "";
		for (var i = Math.max(0, this.logs.length-n); i < this.logs.length; i++) {
			rv += "### " + this.logs[i] + "\n";
		}
		return rv;
	}

};