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
    }
})


function showItems() {
    let query = connection.query(`SELECT * FROM bamazon.products`, function (err, res) {
        console.table(res)

        inquirer.prompt([

            {
                type: `list`,
                name: `boughtItems`,
                message: `Please enter the i.d. of the item you would like to buy`,
                choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            {
                type: `input`,
                name: `amountBought`,
                message: `Please enter how many items you would like to buy`
            }


        ]).then(response => {
            console.log(response)
            console.log(response.boughtItems)
            let query1 = connection.query(`SELECT * FROM bamazon.products WHERE item_id = ?`, [response.boughtItems], function(err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log(data)
                    console.log(data[0].stock_quantity)

                    if (data[0].stock_quantity >= response.amountBought) {
                        console.log(`Congratulations on your purchase of ${response.amountBought} ${data[0].product_name} !`)
                        console.log(`The total cost is $${Math.round(data[0].price * response.amountBought)}`)
                        let query2 = connection.query(`UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?`, [data[0].stock_quantity - response.amountBought, response.boughtItems], function(err, response) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Worked!")
                            }
                        })
                    }
                    else {
                        console.log("sorry, We don't have that many in stock")
                    }
                }
            })
        }
        )

    })
}



showItems();

