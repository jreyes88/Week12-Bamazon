var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'Bamazon'
});
connection.connect(function(err) {
	if (err) throw err;
});

var prompt = require('prompt');
prompt.start();

// function create() {
// 	connection.query('INSERT INTO songs SET ?', [{ARTIST: "Lynyrd Skynyrd", TITLE:"Simple Man", GENRE: "Rock"}],
// 		function(err, res) {});
// };

function read() {
	connection.query('SELECT * FROM products', function(err, res) {
		if(err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("\n===============\n" + "Number: " + res[i].itemID + " Product Name: " +  res[i].ProductName + " Department Name: " + res[i].DepartmentName + " Price: " + res[i].Price + " Quantity: " + res[i].StockQuantity + "\n===============");
		}
	});
	promptUser();
};


function promptUser(){
	prompt.get(
		{
			properties: {
				productChoice: {
					message: '\nPlease type the product you would like to purchase'
				},
				productChoiceQuantity: {
					message: '\nHow many would you like to purchase?',
				}
			}
		}, function (err, promptResult) {
	    	console.log("Product: " + promptResult.productChoice);
	    	console.log("Quantity: " + promptResult.productChoiceQuantity);
	    	update(promptResult.productChoice, promptResult.productChoiceQuantity);
		}
	);
};
read();

function update(productChoice, productChoiceQuantity) {
	connection.query("UPDATE products SET ? WHERE ?", 
		[
			{
				ProductName: productChoice
			}, {
				StockQuantity:  -productChoiceQuantity
			}
		],
		function(err, res) {
			
	});
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