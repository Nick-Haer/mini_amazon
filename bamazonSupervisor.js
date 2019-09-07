const inquirer = require(`inquirer`);

const mysql = require(`mysql`)

const connection = mysql.createConnection ({
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
})

function supervisor () {
    inquirer.prompt (
        {
            name: `deptCheck`,
            message: `Which would you like to do?`,
            type: `list`,
            choices: [`View product sales by department`, `Create New Department`]
        }
    ).then((response) => {
        if (response.deptCheck === `View product sales by department`) {
            let aQuery =`SELECT departments.department_id, departments.department_name, overhead_costs, SUM(product_sales) AS product_sales, case 
            WHEN overhead_costs - product_sales > 0 
            THEN CONCAT("No profits yet. The total loss is ", overhead_costs - SUM(product_sales), ".")
            ELSE SUM(product_sales) - overhead_costs
            END AS total_profit
            FROM bamazon.departments
            JOIN bamazon.products
            ON departments.department_name = products.department_name
            GROUP BY departments.department_name;`
            connection.query(aQuery, function(err, data) {
                console.table(data)
            })
        } else {
            inquirer.prompt([
            {
                name: `deptAddName`,
                message: `Enter the name of the department you'd like to add`,
                type: `input`
            },
            {
                name: `deptAddOverhead`,
                message: `Enter the overhead costs of the department you'd like to add`,
                type: `input`
            }
        ]).then((answers) => {
            connection.query(`INSERT INTO departments(department_name, overhead_costs) VALUES(?,?);`, [answers.deptAddName, answers.deptAddOverhead], (err, res) => {
                if (err) {
                    throw err;
                }
                console.log(`Succesfully added departmentt ${answers.deptAddName} with an overhead cost of ${answers.deptAddOverhead}`)
            })

        })
            
        }
    } )
}

supervisor()
