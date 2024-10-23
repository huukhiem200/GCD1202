var express = require('express');
var router = express.Router();

// Middleware để xử lý dữ liệu POST từ form
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Mock product data stored in-memory (you can replace this with a database)
let products = [
  { id: '1', product: 'car' }
];

/* GET users listing. */
router.get('/', function (req, res, next) {
  // Check nếu session không có, tạo giá trị mặc định
  if (!req.session.authented) {
    req.session.authented = false;
  }

  // check login or not
  let authented = req.session.authented;

  // Generate the product table dynamically based on the 'products' array
  let table = `<table border="1">
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>CRUD</th>
                  </tr>
                  <tr> <form action="/users" method="POST">
                    <td><input type="text" name="id" placeholder="Enter new ID"></td>
                    <td><input type="text" name="product" placeholder="Enter new product"></td>
                    <td><input type="submit" name="btn" value="Add"></td>
                    </form>
                  </tr>`;

  // Loop over products to render each product in a form
  products.forEach((product) => {
    table += `<tr><form action="/users" method="POST">
                <td><input type="text" name="id" value="${product.id}"></td>
                <td><input type="text" name="product" value="${product.product}"></td>
                <td><input type="submit" name="btn" value="Update">
                    <input type="submit" name="btn" value="Delete"></td>
              </form></tr>`;
  });

  table += `</table>`;

  // Check if the user is authenticated, otherwise redirect to login
  if (authented) {
    res.render('users', { title: 'Users page', products_table: table });
  } else {
    res.redirect('/login');
  }
});

/* POST users CRUD. */
router.post('/', function (req, res, next) {
  let { id, product, btn } = req.body;

  console.log("Request body:", req.body); // Debug: in ra req.body để kiểm tra dữ liệu

  if (btn === 'Add') {
    // Check xem có id hoặc product nào trùng không trước khi thêm
    let exists = products.some(p => p.id === id);
    if (!exists) {
      // Thêm sản phẩm mới
      products.push({ id, product });
      console.log('Added:', { id, product });
    } else {
      console.log('Product with this ID already exists!');
    }
  } else if (btn === 'Update') {
    // Cập nhật sản phẩm dựa vào ID
    products = products.map(p => (p.id === id ? { id, product } : p));
    console.log('Updated:', { id, product });
  } else if (btn === 'Delete') {
    // Xoá sản phẩm dựa vào ID
    products = products.filter(p => p.id !== id);
    console.log('Deleted:', id);
  }

  // Redirect back to the user page after the operation
  res.redirect('/users');
});

module.exports = router;
