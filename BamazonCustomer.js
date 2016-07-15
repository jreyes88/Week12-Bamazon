var mysql = require('mysql');
var connection = mysql.createConnection(
	{
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'Bamazon'
	}
);
connection.connect(
	function(err) {
		if (err) throw err;
	}
);

var prompt = require('prompt');
prompt.start();

function read() {
	connection.query('SELECT * FROM products', function(err, res) {
		if(err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("-------------------------------------------------------------------------------------------------------------------------------\n" + "ItemID: " + res[i].itemID + " || Product Name: " +  res[i].ProductName + " || Department Name: " + res[i].DepartmentName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity);
		}
		promptUser();
	});
};


function promptUser(){
	prompt.get(
		{
			properties: {
				productChoiceItemID: {
					message: '\nPlease type the index of the product you would like to purchase'
				},
				productChoiceQuantity: {
					message: '\nHow many would you like to purchase?',
				}
			}
		}, function (err, promptResult) {
	    	updateStock(promptResult.productChoiceItemID, promptResult.productChoiceQuantity);
		}
	);
};
read();

function checkStockQuantity() {

};

function updateStock(productChoiceItemID, productChoiceQuantity) {
	var newStockQuantity;
	connection.query('SELECT * FROM products WHERE ?', {itemID:productChoiceItemID},
		function(err, res) {
			// console.log("results: " + res[0].StockQuantity);
			var newStockQuantity = res[0].StockQuantity -= productChoiceQuantity;
			updateTableQuantity(productChoiceItemID, newStockQuantity);
		});
			
};

function updateTableQuantity(productChoiceItemID, newStockQuantity) {
 	connection.query("UPDATE products SET ? WHERE ?", [
 		{
 			StockQuantity: newStockQuantity
 		}, {
 			itemID: productChoiceItemID
 		}
 	], function(err, res) {})
	read();
};


// function remove() {
// 	connection.query("DELETE FROM songs WHERE ?", 
// 		{artist: "Eagle Eye Cherry"}, function(err, res){
// 			console.log(res);
// 		}
// 	);
// };

// CRUD 
// C - CREATE- 
// INSERT INTO pets (name, type, age)
// VALUES ('fido', 'dog', 3);

// R - READ
// SELECT * FROM pets

// U - UPDATE
// UPDATED pets SET name = 'under dog' WHERE type = 'dog';

// D - DELETE
// DELETE FROM pets WHERE type = 'mouse';