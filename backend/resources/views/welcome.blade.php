<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clothing Store API</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #2c3e50; }
        .endpoint { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .method { display: inline-block; width: 70px; font-weight: bold; color: #fff; padding: 2px 8px; border-radius: 3px; text-align: center; }
        .get { background: #28a745; }
        .post { background: #007bff; }
        .put { background: #fd7e14; }
        .delete { background: #dc3545; }
    </style>
</head>
<body>
    <h1>Clothing Store REST API v1.0</h1>
    <p>Welcome to the Clothing E-commerce API. Use the endpoints below to interact with the platform.</p>
    <h2>Base URL: <code>/api/v1</code></h2>
    <h3>Authentication</h3>
    <div class="endpoint"><span class="method post">POST</span> /auth/register</div>
    <div class="endpoint"><span class="method post">POST</span> /auth/login</div>
    <div class="endpoint"><span class="method post">POST</span> /auth/logout</div>
    <div class="endpoint"><span class="method get">GET</span> /auth/me</div>
    <h3>Products</h3>
    <div class="endpoint"><span class="method get">GET</span> /products</div>
    <div class="endpoint"><span class="method get">GET</span> /products/{slug}</div>
    <h3>Categories</h3>
    <div class="endpoint"><span class="method get">GET</span> /categories</div>
    <div class="endpoint"><span class="method get">GET</span> /categories/{slug}/products</div>
    <p>For full documentation, see the API reference.</p>
</body>
</html>
