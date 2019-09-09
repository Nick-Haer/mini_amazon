const inquirer = require(`inquirer`)

const mysql = require(`mysql`)


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
        showItems();
    }
})


function showItems() {
    let query = connection.query(`SELECT * FROM bamazon.products`, function (err, res) {

    //the user is show a table of the products they can purchase, which they will use to provide the information below when prompted.
        console.table(res)

        inquirer.prompt([

            {
                type: `list`,
                name: `boughtItem`,
                message: `Please enter the i.d. of the item you would like to buy`,
                choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            {
                type: `input`,
                name: `amountBought`,
                message: `Please enter how many items you would like to buy`
            }


        ]).then(response => {

            //.this query checks if there is enough of the item in stock to meet the users request
            let query1 = connection.query(`SELECT * FROM bamazon.products WHERE item_id = ?`, [response.boughtItem], function(err, data) {
                if (err) {
                    throw err;
                } else {


                    //this section confirms the users purchase, and then updates the stock to be the right quantity. It then adds the correct amount to the product sales column


                    if (data[0].stock_quantity >= response.amountBought) {
                        console.log(`Congratulations on your purchase of ${response.amountBought} ${data[0].product_name} !`)
                        console.log(`The total cost is $${Math.round(data[0].price * response.amountBought)}`)
                        let query2 = connection.query(`UPDATE bamazon.products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?`, [response.amountBought, response.amountBought * data[0].price, response.boughtItem], function(err, response) {
                            if (err) {
                                throw err;
                            }
                            connection.end()
                        })
                    }
                    else {
                        console.log("sorry, We don't have that many in stock")
                        connection.end()
                    }
                }
            })
        }
        )

    })
}





