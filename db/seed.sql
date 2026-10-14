INSERT INTO customers (name, email, city) VALUES
  ('Aarav Sharma', 'aarav@example.com', 'Kanpur'),
  ('Diya Verma', 'diya@example.com', 'Lucknow'),
  ('Kabir Singh', 'kabir@example.com', NULL);

INSERT INTO products (name, price_paise) VALUES
  ('Arduino Uno Kit', 149900),
  ('Servo Motor SG90', 19900),
  ('Ultrasonic Sensor HC-SR04', 9900),
  ('Breadboard 830', 12900);

INSERT INTO orders (customer_id, status) VALUES
  (1, 'paid'),
  (1, 'pending'),
  (2, 'shipped'),
  (3, 'cancelled');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_paise) VALUES
  (1, 1, 1, 149900),
  (1, 2, 2, 19900),
  (2, 3, 4, 9900),
  (3, 4, 1, 12900),
  (3, 2, 1, 19900),
  (4, 1, 1, 149900);
