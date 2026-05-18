insert into brands (name, slug, description, approved, featured) values
  ('Nike', 'nike', 'Just Do It.', true, true),
  ('Adidas', 'adidas', 'Impossible Is Nothing.', true, true),
  ('Off-White', 'off-white', 'Street luxury.', true, true);

insert into products (brand_id, name, description, price, category, sizes, colors, images, stock, featured) values
  ((select id from brands where slug = 'nike'), 'Air Max 90', 'Iconic sneaker with visible Air cushioning.', 149.99, 'Men', '{"7","8","9","10","11"}', '[{"name":"White","hex":"#ffffff"},{"name":"Black","hex":"#000000"}]', '{"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"}', 50, true),
  ((select id from brands where slug = 'nike'), 'Air Force 1', 'Timeless classic basketball shoe.', 129.99, 'Men', '{"7","8","9","10","11"}', '[{"name":"White","hex":"#ffffff"},{"name":"Black","hex":"#000000"}]', '{"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600"}', 40, true),
  ((select id from brands where slug = 'adidas'), 'Ultraboost 23', 'Ultimate energy return with every stride.', 189.99, 'Men', '{"7","8","9","10","11"}', '[{"name":"Black","hex":"#000000"},{"name":"Grey","hex":"#808080"}]', '{"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"}', 30, true),
  ((select id from brands where slug = 'off-white'), 'Arrows Hoodie', 'Signature Off-White hoodie with arrow motif.', 395.00, 'Men', '{"S","M","L","XL"}', '[{"name":"Black","hex":"#000000"},{"name":"Grey","hex":"#808080"}]', '{"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"}', 20, true),
  ((select id from brands where slug = 'nike'), 'Dunk Low Retro', 'Basketball icon turned streetwear staple.', 119.99, 'Men', '{"7","8","9","10","11"}', '[{"name":"Red","hex":"#ff0000"},{"name":"Blue","hex":"#0000ff"}]', '{"https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600"}', 35, false),
  ((select id from brands where slug = 'adidas'), 'Superstar', 'The original shell-toe sneaker.', 89.99, 'Women', '{"5","6","7","8","9"}', '[{"name":"White","hex":"#ffffff"},{"name":"Black","hex":"#000000"}]', '{"https://images.unsplash.com/photo-1605196188105-af39f84e06d8?w=600"}', 45, true),
  ((select id from brands where slug = 'nike'), 'Classic Crew Socks', 'Comfortable everyday crew socks.', 19.99, 'Accessories', '{"One Size"}', '[{"name":"White","hex":"#ffffff"},{"name":"Black","hex":"#000000"}]', '{"https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600"}', 100, false);
