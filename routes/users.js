var express = require('express');
var router = express.Router();
const pool = require("../models/pg_connector");

// Middleware để xử lý dữ liệu POST từ form
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET user product page. */
router.get('/', async function (req, res, next) {
  // Kiểm tra session đăng nhập
  if (!req.session.authented) {
    req.session.authented = false;
  }

  let authented = req.session.authented;

  if (authented) {
    let shop_id = 1;  // Hoặc lấy từ session hoặc body
    let table = await generate_table_with_crud(shop_id);
    res.render('users', { title: 'Users page', products_table: table });
  } else {
    res.redirect('/login');
  }
});

/* POST xử lý CRUD cho users. */
router.post('/', async function (req, res, next) {
  let { id, product_name, price, shop_id, amount, btn } = req.body;

  if (btn === 'Add') {
    // Kiểm tra xem sản phẩm có tồn tại chưa
    let query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [id]
    };
    let result = await pool.query(query);
    if (result.rows.length === 0) {
      // Thêm sản phẩm mới
      query = {
        text: 'INSERT INTO products (id, product_name, price, shop_id, amount) VALUES ($1, $2, $3, $4, $5)',
        values: [id, product_name, price, shop_id, amount]
      };
      await pool.query(query);
      console.log('Added:', { id, product_name, price, shop_id, amount });
    } else {
      console.log('Product with this ID already exists!');
    }
  } else if (btn === 'Update') {
    // Cập nhật sản phẩm
    let query = {
      text: 'UPDATE products SET product_name = $2, price = $3, shop_id = $4, amount = $5 WHERE id = $1',
      values: [id, product_name, price, shop_id, amount]
    };
    await pool.query(query);
    console.log('Updated:', { id, product_name, price, shop_id, amount });
  } else if (btn === 'Delete') {
    // Xóa sản phẩm
    let query = {
      text: 'DELETE FROM products WHERE id = $1',
      values: [id]
    };
    await pool.query(query);
    console.log('Deleted:', id);
  }

  // Sau khi thao tác, chuyển hướng về trang users
  res.redirect('/users');
});

/* Hàm tạo bảng sản phẩm với CRUD */
async function generate_table_with_crud(shop_id) {
  let table = "";
  let query = "";

  // Tùy theo shop_id để lấy sản phẩm
  if (shop_id == 1) {
    query = `SELECT * FROM products`;
  } else {
    query = {
      text: 'SELECT * FROM products WHERE shop_id = $1',
      values: [shop_id],
    }
  }

  try {
    const result = await pool.query(query);
    const rows = result.rows;
    const fields = result.fields;

    // Tạo bảng với các form CRUD
    table = `<table border=1><tr>`;
    let col_list = [];

    // Tạo tiêu đề cột
    for (let field of fields) {
      table += `<th>${field.name}</th>`;
      col_list.push(field.name);
    }
    table += `<th>CRUD</th></tr>`;

    // Tạo form thêm mới sản phẩm
    table += `<tr><form action="/users" method="POST">
                <td><input type="text" name="id" placeholder="Enter new ID"></td>
                <td><input type="text" name="product_name" placeholder="Enter new product"></td>
                <td><input type="number" name="price" placeholder="Enter price"></td>
                <td><input type="number" name="shop_id" placeholder="Enter shop ID"></td>
                <td><input type="number" name="amount" placeholder="Enter amount"></td>
                <td><input type="submit" name="btn" value="Add"></td>
              </form></tr>`;

    // Tạo form update/delete cho mỗi sản phẩm
    for (let row of rows) {
      table += `<tr><form action="/users" method="POST">`;
      for (let col of col_list) {
        let cell = row[col];
        table += `<td><input type="text" name="${col}" value="${cell}"></td>`;
      }
      table += `<td>
                  <input type="submit" name="btn" value="Update">
                  <input type="submit" name="btn" value="Delete">
                </td>`;
      table += `</form></tr>`;
    }
    table += `</table>`;
  } catch (err) {
    console.log(err);
    table = "Cannot connect to DB";
  }
  return table;
}

module.exports = router;
