# Week12-Bamazon

## Dependencies
This application requires MySQL and prompt.
`$ npm install mysql`
`$ npm install prompt`

Run the customer view with the command:
`$ node BamazonCustomer.js`

Run the manager view with the command:
`$ node BamazonManager.js`

The SQL Database is in the SQL File directory for the grader. Otherwise, screenshots are provided below.

###Customer View
The Initial Customer View will display all items for sale, their department, quantity, and cost.
<img src="/Images/Customer1.png" alt="Customer View 1">

The Customer can then choose the itemID for the product that they would like to purchase, as well as the quantity they would like to purchase.
<img src="/Images/Customer2.png" alt="Customer View 2" height=20px>

If the item is in stock, the table will update, depleting the quantity by how much the customer has ordered, and display the cost of the customer's order
![Customer View 3](/Images/Customer3.png)

However, if the customer asks for more of an item than is in stock...
![Customer View 4](/Images/Customer4.png)

Then the program will alert that there is not enough in stock, and re-display the table and order prompt.
![Customer View 5](/Images/Customer5.png)

###Manager View
The Initial Manager View will display options for the manager to choose how to interact with the store inventory.
![Manager View 1](/Images/Manager1.png)

Selecting Option 1 will display all inventory in the table, similar to the customer view.

Selecting Option 2 will display all products that have less than 100 in their stock quantity
![Manager View 2](/Images/Manager2.png)

Selecting Option 3 allows the manager to update the quantity of a specific product
![Manager View 3](/Images/Manager3.png)
![Manager View 4](/Images/Manager4.png)
![Manager View 5](/Images/Manager5.png)

Selecting Option 4 allows the manager to add a new product entirely
![Manager View 6](/Images/Manager6.png)
![Manager View 7](/Images/Manager7.png)
