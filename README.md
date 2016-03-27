# JSON-to-Bootstrap-Table
Convert JSON Data from URL/Data to Bootstrap table

###This light weight plugin uses Bootstrap CSS to convert a JSON data into a Bootstrap table.

###Demo - http://demo.prashantb.me/JsonToTable/

###Code to be used - 

```
<script src="jsonToTable.js"></script>
<script>
	  var dtbl = new createTable({
							  url:'example.json',
							  wrapper:".createTableJSON"
							  }).create();
</script>
```

###Parameters Available -

```
url:"",
data:"",
wrapper:"",
search:true,
tableClass:"table table-bordered table-hover"
```

* URL - Get Request to a URL which returns a JSON Object.
* Data - Optional - Can directly convert a passed JSON Data.
* Search - To Enable/Disable Search in the Table
