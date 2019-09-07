const inquirer = require(`inquirer`);

const mysql = require(`mysql`);

const connection = mysql.createConnection({

    host: `localhost`,

    port: 3306,

    user: `root`,
    Database: `bamazon`,

    password: `63_TRooTandTree!`,
    database: `bamazon`


})

connection.connect((err) => {
    if (err) {
        throw err;
    }
    else {
        console.log("connected correctly")
    }
})


function manager() {



    let query = connection.query(`SELECT * FROM bamazon.products`, function (err, res) {
        if (err) {
            throw err;
        }


        inquirer.prompt({
            name: 'menuQuestion',
            message: "What would you like to do?",
            type: `list`,
            choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`]
        }).then((response) => {
            console.log(response.menuQuestion)

            switch (response.menuQuestion) {
                case `View Products for Sale`:
                    console.table(res)
                    break;
                case `View Low Inventory`:
                    for (let item of res) {
                        if (item.stock_quantity < 5) {
                            console.table(item)
                        }


                    }

                    break;
                case `Add to Inventory`:


                    inquirer.prompt([{

                        name: `addMore`,
                        type: `list`,
                        message: `Which item would you like to add more of to the inventory`,
                        choices: function () {
                            let choicesArr = [];
                            for (let item of res) {
                                choicesArr.push(item.product_name)
                            }
                            return choicesArr;
                        }
                    },

                    {
                        name: `howMuch`,
                        message: `"How much more would you like to add?`,
                        type: `input`
                    }


                    ]).then((choice) => {
                        connection.query(`UPDATE bamazon.products SET stock_quantity = stock_quantity + ? WHERE product_name = ? `, [choice.howMuch, choice.addMore], function (error, data) {
                            if (error) {
                                throw error;
                            }

                            console.log("Inventory Updated")
                        })

                    })

                    break;
                case `Add New Product`:

                    inquirer.prompt([
                    {

                        name: `addItem`,
                        type: `input`,
                        message: `Which item would you like to add to our stock selection?`,
                    },
                    {

                        name: `addDept`,
                        type: `input`,
                        message: `Which department would you like to add this item too?`,
                    },
                    {

                        name: `addPrice`,
                        type: `input`,
                        message: `How much should this item be sold for per unit?`,
                    },

                    {
                        name: `inventoryCount`,
                        message: `"What is the quantity of our initial stock`,
                        type: `input`
                    }


                    ]).then((choice) => {
                        connection.query(`INSERT INTO bamazon.products (product_name, department_name, price, stock_quantity)
                        VALUES(?, ?, ?, ?)`, [choice.addItem, choice.addDept, choice.addPrice, choice.inventoryCount], function (error, data) {
                            if (error) {
                                throw error;
                            }

                            console.log("New Item Added")
                        })

                    })


                    break;

                default:
                    console.log("Please pick a valid option")
            }

        })



    })

}




manager()

function addItem () {
    
}