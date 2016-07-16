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

promptManager();

// Function that prompts for item selection and quantity =================== //
function promptManager(){
	console.log('Select a Manager Action: \n  1. View Products for Sale\n  2. View Low Inventory\n  3. Add to Inventory\n  4. Add New Inventory');
	prompt.get(['managerActionSelect'], function (err, result) {
    	console.log('  selection: ' + result.managerActionSelect);
    	if (result.managerActionSelect == 1) {
    		read();
    	} else if (result.managerActionSelect == 2) {
    		readLowQuantity();
    	} else if (result.managerActionSelect == 3) {
    		addToInventoryPrompt();
    	} else if (result.managerActionSelect == 4) {
    		addNewInventoryPrompt();
    	}
  	});
};

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
		promptManager();
	});
};

// Show Low Quantity ======================================================= //
function readLowQuantity() {
	
	var table = new Table(
		{
	    	head:[
	    		'ItemID',
	    		'Product Name',
	    		'Department Name',
	    		'Price',
	    		'Quantity'
	    	], colWidths:[
	    		20,
	    		40,
	    		20,
	    		20,
	    		20
	    	]
	    }
	);

	connection.query('SELECT * FROM products', function(err, res) {
		if(err) throw err;
		for (var i = 0; i < res.length; i++) 
			{
				// console.log(res[i].ProductName)
				if (res[i].StockQuantity <= 100) {
					table.push(
						[
							res[i].itemID,
							res[i].ProductName,
							res[i].DepartmentName,
							res[i].Price,
							res[i].StockQuantity
						]
					)
					
				}
			};
		console.log(table.toString());
		promptManager();
	});
};

// Add Inventory to Existing product ======================================= //
function addToInventoryPrompt() {
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
		prompt.get(
			{
				properties: {
					productChoiceID: {
						message: '\nPlease type the index of the index of the product you would like to add inventory to.'
					},
					productChoiceQuantity: {
						message: '\nHow much inventory would you like to add?',
					}
				}
			}, function (err, promptResult) {
				console.log("Product ID to Update: " + promptResult.productChoiceID);
				console.log("Amount to Add: " + promptResult.productChoiceQuantity);
				addToInventory(promptResult.productChoiceID, promptResult.productChoiceQuantity)
			}
		);
	});
}

function addToInventory(updateChoiceID, updateChoiceQuantity) {
	var newStockQuantity;
	connection.query('SELECT * FROM products WHERE ?', {itemID:updateChoiceID},
		function(err, res) {
			newStockQuantity = res[0].StockQuantity += parseInt(updateChoiceQuantity);
			updateTableQuantity(updateChoiceID, newStockQuantity);
		});
};

function updateTableQuantity(updateChoiceID, newStockQuantity) {
 	connection.query("UPDATE products SET ? WHERE ?", [
 		{
 			StockQuantity: newStockQuantity
 		}, {
 			itemID: updateChoiceID
 		}
 	], function(err, res) {})
	read();
};

// Add new inventory products ============================================== //
function addNewInventoryPrompt() {
	prompt.get(
		{
			properties: {
				newProductName: {
					message: '\nPlease type the name of the product you would like to add to inventory'
				},
				newProductDepartmentName: {
					message: '\nWhat department does this product belong in?'
				},
				newProductPrice: {
					message: '\nWhat is the price for this product?'
				},
				newProductStockQuantity: {
					message: '\nWhat is the stock quantity for this product?'
				}
			}
		}, function (err, promptResult) {
			console.log("Product Name to Add: " + promptResult.newProductName);
			console.log("Product Department to Add: " + promptResult.newProductDepartmentName);
			console.log("Product Price to Add: " + promptResult.newProductPrice);
			console.log("Product Quantity to Add: " + promptResult.newProductStockQuantity);
			addNewInventory(promptResult.newProductName, promptResult.newProductDepartmentName, promptResult.newProductPrice, promptResult.newProductStockQuantity);
		}
	);

	function addNewInventory(newProductName, newProductDepartmentName, newProductPrice, newProductStockQuantity) {

		connection.query('INSERT INTO products SET ?', [{ProductName: newProductName, DepartmentName: newProductDepartmentName, Price: newProductPrice, StockQuantity: newProductStockQuantity}],
		function(err, res) {
			read();
		});

	}
};