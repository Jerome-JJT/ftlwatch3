<?php 


function getProducts()
{
  $query = "SELECT products.id, products.name, products.slug, 
  products.description, products.price, products.quantity, products.image,
  products.is_uniq, products.one_time_purchase
  FROM products
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $products = executeQuerySelect($query, $data);

  return $products;
}

