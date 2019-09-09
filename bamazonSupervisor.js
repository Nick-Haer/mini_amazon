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

    supervisor()
})

//the supervisor function contians the logic used in this module
function supervisor () {
    inquirer.prompt (
        {
            name: `deptCheck`,
            message: `Which would you like to do?`,
            type: `list`,
            choices: [`View product sales by department`, `Create New Department`]
        }
    ).then((response) => {

//if the user choices deptCheck, a query is made to check all relevant information. A case statement is used to determine if the current sales exceed overhead costs, and then to phrase either the profits or loss as a profit or loss.

        if (response.deptCheck === `View product sales by department`) {
            let aQuery =`SELECT departments.department_id, departments.department_name, overhead_costs, IFNULL((SUM(product_sales) ), 0) AS product_sales, case 
            WHEN SUM(product_sales) IS NULL 
            THEN "This department hasn't sold anything yet"
            WHEN overhead_costs - SUM(product_sales) > 0 
            THEN CONCAT("No profits yet. The total loss is $", overhead_costs - SUM(product_sales))
            ELSE CONCAT("This department's total profits are $", (SUM(product_sales) - overhead_costs))
            END AS total_profit
            FROM bamazon.departments
            LEFT JOIN bamazon.products
            ON departments.department_name = products.department_name
            GROUP BY departments.department_name;`
            connection.query(aQuery, function(err, data) {
                if (err) {
                    throw err;
                }
                console.table(data)
                connection.end()
            })
        } else {
//this section gives the user a chance to add a department and its associated overhead costs. to add items to the department, the user must use bamazonManager
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
                connection.end()
            })

        })
            
        }
    } )
}


