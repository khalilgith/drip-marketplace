-- First pass: delete existing products for the brands we're adding/replacing
delete from products where brand_id in (
  '72d5834b-8c82-4d32-b6be-d31e44309fc4',
  'b457e310-195c-4d9d-b152-cb9480fab6f7',
  '0112c7b3-739c-462a-874a-aed51e1cf797',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000002'
);

-- Delete new brands in case they already exist (won't delete Nike/Adidas/Off-White which existed before)
delete from brands where id in (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000002'
);

-- Seed: brands
insert into brands (id, name, slug, description, approved, featured) values
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Nike', 'nike', 'Just Do It.', true, true),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Adidas', 'adidas', 'Impossible is Nothing.', true, true),
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Off-White', 'off-white', 'Virgil Abloh visionary streetwear.', true, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Fear of God', 'fear-of-god', 'Luxury streetwear by Jerry Lorenzo.', true, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Balenciaga', 'balenciaga', 'Avant-garde fashion house.', true, true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, description = excluded.description;

-- Seed: products (Nike)
insert into products (brand_id, name, description, price, compare_price, category, sizes, colors, images, stock, featured) values
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Air Max 90', 'Iconic sneaker with visible Air cushioning.', 149.99, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}]', ARRAY['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'], 50, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Air Force 1', 'Timeless classic basketball shoe.', 129.99, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}]', ARRAY['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'], 40, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Dunk Low Retro', 'Basketball icon turned streetwear staple.', 119.99, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#ff0000","name":"Red"},{"hex":"#0000ff","name":"Blue"},{"hex":"#000000","name":"Black"}]', ARRAY['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80'], 35, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Classic Crew Socks', 'Comfortable everyday crew socks.', 19.99, null, 'Accessories', ARRAY['One Size'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}]', ARRAY['https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80'], 100, false),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Tech Fleece Hoodie', 'Premium fleece hoodie with modern fit.', 119.99, 149.99, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"},{"hex":"#000080","name":"Navy"}]', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'], 45, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Windrunner Jacket', 'Lightweight running jacket with iconic chevron.', 149.99, null, 'Women', ARRAY['XS','S','M','L','XL'], '[{"hex":"#0000ff","name":"Blue"},{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}]', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'], 30, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Pegasus Trail 4', 'Trail running shoe with rugged outsole.', 159.99, null, 'Men', ARRAY['7','8','9','10','11','12','13'], '[{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"},{"hex":"#00ff00","name":"Green"}]', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'], 25, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Air Zoom Vapor', 'Elite tennis shoe for match-day performance.', 189.99, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#ffffff","name":"White"},{"hex":"#ff0000","name":"Red"}]', ARRAY['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'], 20, true),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Dri-FIT Training Tee', 'Moisture-wicking training shirt.', 44.99, 59.99, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"},{"hex":"#808080","name":"Grey"}]', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'], 80, false),
  ('72d5834b-8c82-4d32-b6be-d31e44309fc4', 'Air Force 1 Sage Low', 'Low-top platform AF1 for women.', 139.99, null, 'Women', ARRAY['5','6','7','8','9','10'], '[{"hex":"#ffffff","name":"White"},{"hex":"#ffe4e1","name":"Blush"}]', ARRAY['https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=600&q=80'], 35, true);

-- Seed: products (Adidas)
insert into products (brand_id, name, description, price, compare_price, category, sizes, colors, images, stock, featured) values
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Ultraboost 23', 'Ultimate energy return with every stride.', 189.99, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}]', ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'], 30, true),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Superstar', 'The original shell-toe sneaker.', 89.99, null, 'Women', ARRAY['5','6','7','8','9','10'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}]', ARRAY['https://images.unsplash.com/photo-1605196188105-af39f84e06d8?w=600&q=80'], 45, true),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Forum Low', 'Classic basketball sneaker reissued.', 99.99, 129.99, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#0000ff","name":"Blue"}]', ARRAY['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80'], 40, true),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Adilette Slides', 'Comfortable pool slides with iconic stripes.', 34.99, null, 'Accessories', ARRAY['6','7','8','9','10','11','12'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"},{"hex":"#0000ff","name":"Blue"}]', ARRAY['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80'], 120, false),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', '3-Stripes Tee', 'Classic cotton tee with signature 3-Stripes.', 34.99, 44.99, 'Women', ARRAY['XS','S','M','L','XL'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"},{"hex":"#ff69b4","name":"Pink"}]', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'], 90, true),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Adicolor Classic Hoodie', 'French terry hoodie with trefoil logo.', 74.99, null, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#000080","name":"Navy"},{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}]', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'], 55, false),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Runfalcon 3.0', 'Lightweight everyday running shoe.', 69.99, null, 'Women', ARRAY['5','6','7','8','9','10'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff69b4","name":"Pink"}]', ARRAY['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'], 60, false),
  ('b457e310-195c-4d9d-b152-cb9480fab6f7', 'Gazelle Indoor', 'Indoor soccer trainer turned lifestyle sneaker.', 109.99, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"},{"hex":"#00ff00","name":"Green"}]', ARRAY['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80'], 25, true);

-- Seed: products (Off-White)
insert into products (brand_id, name, description, price, compare_price, category, sizes, colors, images, stock, featured) values
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Arrows Hoodie', 'Signature Off-White hoodie with arrow motif.', 395.00, null, 'Men', ARRAY['S','M','L','XL'], '[{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}]', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'], 20, true),
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Diagonal Zip Hoodie', 'Zip hoodie with industrial diagonal zipper.', 525.00, null, 'Men', ARRAY['S','M','L','XL'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"}]', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'], 15, true),
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Off-Court Sneakers', 'High-top sneakers with Off-White branding.', 695.00, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"}]', ARRAY['https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=600&q=80'], 10, true),
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Industrial Belt', 'Yellow industrial belt with arrow print.', 295.00, 350.00, 'Accessories', ARRAY['One Size'], '[{"hex":"#ffff00","name":"Yellow"},{"hex":"#000000","name":"Black"}]', ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'], 50, true),
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Caravaggio Tee', 'Graphic tee with Caravaggio painting print.', 245.00, null, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"}]', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'], 30, false),
  ('0112c7b3-739c-462a-874a-aed51e1cf797', 'Out Of Office Sneakers', 'Low-top sneakers with arrow motif.', 595.00, null, 'Women', ARRAY['5','6','7','8','9','10'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff69b4","name":"Pink"}]', ARRAY['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80'], 12, true);

-- Seed: products (Fear of God)
insert into products (brand_id, name, description, price, compare_price, category, sizes, colors, images, stock, featured) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Essentials Hoodie', 'Signature heavyweight fleece hoodie.', 110.00, null, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#808080","name":"Grey"},{"hex":"#000000","name":"Black"},{"hex":"#f5f5dc","name":"Cream"}]', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'], 80, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Essentials Jogger', 'Relaxed-fit fleece jogger.', 95.00, null, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#808080","name":"Grey"},{"hex":"#000000","name":"Black"},{"hex":"#f5f5dc","name":"Cream"}]', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80'], 60, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Essentials Tee', 'Relaxed-fit crewneck tee.', 65.00, 85.00, 'Men', ARRAY['S','M','L','XL','XXL'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#808080","name":"Grey"}]', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'], 120, false),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'California Bomber', 'Satin bomber jacket with Fear of God branding.', 695.00, null, 'Men', ARRAY['S','M','L','XL'], '[{"hex":"#000000","name":"Black"},{"hex":"#000080","name":"Navy"}]', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'], 15, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Eternal Denim', 'Slim-fit raw denim with signature details.', 350.00, null, 'Men', ARRAY['28','29','30','31','32','33','34'], '[{"hex":"#000080","name":"Indigo"},{"hex":"#000000","name":"Black"}]', ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80'], 25, false);

-- Seed: products (Balenciaga)
insert into products (brand_id, name, description, price, compare_price, category, sizes, colors, images, stock, featured) values
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Speed Trainer', 'Iconic sock-like knit sneaker.', 695.00, null, 'Men', ARRAY['7','8','9','10','11','12'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"}]', ARRAY['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'], 20, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Triple S Sneaker', 'Chunky triple-sole sneaker.', 995.00, null, 'Men', ARRAY['7','8','9','10','11','12','13'], '[{"hex":"#ffffff","name":"White"},{"hex":"#000000","name":"Black"},{"hex":"#ff0000","name":"Red"}]', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'], 10, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Hourglass Sunglasses', 'Oversized shield sunglasses.', 595.00, null, 'Accessories', ARRAY['One Size'], '[{"hex":"#000000","name":"Black"},{"hex":"#c0c0c0","name":"Silver"}]', ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'], 40, false),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Logo T-Shirt', 'Oversized tee with distressed logo.', 390.00, null, 'Women', ARRAY['XS','S','M','L','XL'], '[{"hex":"#000000","name":"Black"},{"hex":"#ffffff","name":"White"}]', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'], 35, true),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'City Bag', 'Iconic motorcycle-inspired handbag.', 2150.00, null, 'Accessories', ARRAY['One Size'], '[{"hex":"#000000","name":"Black"},{"hex":"#8B4513","name":"Brown"}]', ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'], 5, false);
