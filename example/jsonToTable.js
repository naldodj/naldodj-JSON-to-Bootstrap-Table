(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['createTable'], factory);
  } else {
    root.createTable = factory(root.createTable);
  }
}(this, function() {
	
	function createTable(options) {
		if (window === this) {
        	return new createTable(options);
    	}

		this.tableName = "";
    this.keys = [];
		this.globalConfig = {
			url:"",
			data:"",
			wrapper:"",
			search:true,
			tableClass:"table table-bordered table-hover"
		};
		for (var key in this.globalConfig) {
      if (options.hasOwnProperty(key)) {
        this.globalConfig[key] = options[key];
      }
    }
    if(this.globalConfig.search) {
      this.searchWrapper = document.createElement('div');
      this.searchWrapper.className = "searchBox col-md-4 col-lg-6 col-md-offset-6";
      document.querySelector(this.globalConfig.wrapper).appendChild(this.searchWrapper);
    }
    if(!this.globalConfig.wrapper) {
    	var divWrap = document.createElement("div"),
    			tableWrap = document.createElement("table");
    	divWrap.className = "jsonTable";
    	tableWrap.className = this.globalConfig.tableClass;
    	divWrap.appendChild(tableWrap);
      document.body.appendChild(divWrap);
      this.tableName = tableWrap;
    } else {
      var tableWrap = document.createElement("table");
    	tableWrap.className = this.globalConfig.tableClass;
    	document.querySelector(this.globalConfig.wrapper).appendChild(tableWrap);
      this.tableName = tableWrap;
    } 
	};

  createTable.prototype.create = function() {
    if(this.globalConfig.url)
    {
      var url = this.globalConfig.url;
      var result;
      var xmlhttp=new XMLHttpRequest();
      var search = this.globalConfig.search;     
      console.log(url);
      var self = this;
      xmlhttp.open("GET",url);
      xmlhttp.send();
      xmlhttp.onreadystatechange=function() //This part is actually executed last
      {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) // Was the request processed successfully?
        {
          result = JSON.parse(xmlhttp.responseText);
          console.log(result);
          if (result.Length == 0) {
            throw "got an empty Object";
          }
          sessionStorage.tabledata = xmlhttp.responseText;
          if(search) {
            makeSearchBox.call(self);
          }
          makeTable.call(self, result);
        }
        else {
          throw "Error getting the data. Please check the url";
        }
      }
    }
    else {
      if(this.globalConfig.data && Array.isArray(this.globalConfig.data) ) {
        sessionStorage.tabledata = JSON.stringify(this.globalConfig.data);
        if(this.globalConfig.search) {
          makeSearchBox.call(this);
        }
        makeTable.call(this, this.globalConfig.data);
      }
      else {
        throw "Wrong data passed. Please check the data back" ;
      }
    }
    
  };

  var makeTable = function(data) {
    //debugger;
    var tbody = document.createElement('tbody');
    var trlen = data.length;
    var thead = document.createElement("thead");
    for (var key in data[0]) {
      console.log(key);
      var th = document.createElement("th");
      this.keys.push(key);
      th.innerHTML = key;
      thead.appendChild(th);
    }
    var keylen = this.keys.length;
    for(var i =0;i<trlen;i++) {
      var tr = document.createElement("tr");
      for(var j =0;j<keylen;j++) { 
        var td = document.createElement("td");
        td.className = this.keys[j];
        td.innerHTML = data[i][this.keys[j]];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    this.tableName.appendChild(thead);
    this.tableName.appendChild(tbody);
  };

  var makeSearchBox = function() {
    var input = document.createElement('input');
    input.type = "text";
    input.className = "form-control";
    input.placeholder = "Search";
    input.addEventListener("keydown", this.filter.bind(this, input), false);
    input.addEventListener("keyup", this.filter.bind(this, input), false);
    this.searchWrapper.appendChild(input);
  };

  createTable.prototype.filter = function(inputElement) {
    var filterText = inputElement.value.toLowerCase();
    if (sessionStorage.tabledata) {
      var result = JSON.parse(sessionStorage.tabledata);
      var filteredArray = [];
      //console.log(result);
      var keylen = this.keys.length;
      var reslen = result.length;
      for (var i = 0; i < reslen; i++) {
        for (var j = 0; j < keylen; j++) {
          if (result[i][this.keys[j]].toString().toLowerCase().match(filterText)) {
            filteredArray.push(result[i]);
            break;
          }
        }
      }
      changeTableBody.call(this, filteredArray);
      //console.log(filteredArray);
    } else {
    }
  };

  function changeTableBody(data) {
    var tbody = document.createElement('tbody');
    var trlen = data.length;
    var thead = document.createElement("thead");
    if(data.length>=1) {
      var keylen = this.keys.length;
      for(var i =0;i<trlen;i++) {
        var tr = document.createElement("tr");
        for(var j =0;j<keylen;j++) { 
          var td = document.createElement("td");
          td.className = this.keys[j];
          td.innerHTML = data[i][this.keys[j]];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      var prevTbody = this.tableName.querySelector("tbody");
      if (prevTbody) {
        this.tableName.removeChild(prevTbody);
      }
      this.tableName.appendChild(tbody);
    } else {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.innerHTML = "No matching data found";
      tr.appendChild(td);
      tbody.appendChild(tr);
      var prevTbody = this.tableName.querySelector("tbody");
      if (prevTbody) {
        this.tableName.removeChild(prevTbody);
      }
      this.tableName.appendChild(tbody);
    }
  }

	return createTable;
}));
