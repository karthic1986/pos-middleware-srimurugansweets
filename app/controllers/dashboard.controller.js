
const db = require("../models/index");
const sequelize = require("sequelize");

exports.last7daysSales = (req, res)=>{
  console.log("test");
  const qry = `Select LastWeek.Days as orderDate,ifnull(O.totalAmount,0) as totalAmount from (SELECT a.Days 
    FROM (
        SELECT curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS Days
        FROM       (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
        CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
        CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
    ) a
    WHERE a.Days >= curdate() - INTERVAL 6 DAY) LastWeek
    Left Join (select sum(totalAmount) as totalAmount,Date(orderDate) as orderDate from orders where orderDate >= DATE(NOW() - INTERVAL 7 DAY)
    GROUP by Date(orderDate)) as O on Date(O.orderDate) = LastWeek.Days
    Order by LastWeek.Days;`;
  db.sequelize.query(qry,
      {type: sequelize.QueryTypes.SELECT})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
        err.message || "Some error occurred while retrieving report.",
        });
      });
};

