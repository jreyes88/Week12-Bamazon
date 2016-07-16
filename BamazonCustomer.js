// Require and connect to MySQL ============================================ //
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

// Require and start Prompt ================================================ //
var prompt = require('prompt');
prompt.start();


var Table = require('cli-table');

// Function that displays initial store inventory ========================== //
function read() {
	connection.query('SELECT * FROM products', function(err, res) {
		if(err) throw err;

		var table = new Table(
			{
		    	head:[
		    		'ItemID',
		    		'Product Name',
		    		'Department Name',
		    		'Price',
		    		'Quantity'
		    	],
		    	colWidths:[
		    		20,
		    		40,
		    		20,
		    		20,
		    		20
		    	]
		    }
		);
		for (var i = 0; i < res.length; i++) {
			table.push(
				[
					res[i].itemID,
					res[i].ProductName,
					res[i].DepartmentName,
					res[i].Price,
					res[i].StockQuantity
				]
			);

		};
		console.log(table.toString());

		promptUser();
	});
};

// Function that prompts for item selection and quantity =================== //
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

// If-Else Statement for out of stock or proceeding to update quantity ===== //
function updateStock(productChoiceItemID, productChoiceQuantity) {
	var newStockQuantity;
	connection.query('SELECT * FROM products WHERE ?', {itemID:productChoiceItemID},
		function(err, res) {
			newStockQuantity = res[0].StockQuantity -= productChoiceQuantity;
			if (newStockQuantity >= 0) {
				var customerTotalCost = (res[0].Price * productChoiceQuantity);
				console.log("Total Cost: $" + customerTotalCost);
				updateTableQuantity(productChoiceItemID, newStockQuantity);
			} else {
				console.log("You don't have enough in stock!");
				read();
			};
		});
};

// Updates quantity in database and re-runs the view script ================ //
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