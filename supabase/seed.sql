-- Pantera — seed inicial con catálogo actual.
-- Idempotente: usa ON CONFLICT por slug.

-- ── COLECCIONES ─────────────────────────────────────────────────
insert into collections (slug, name, tagline, image_url, sort_order) values
  ('campo',  'Campo',  'Crudo, liviano, de los días largos', '/images/modelos3.jpg', 0),
  ('sombra', 'Sombra', 'Elegancia oscura en movimiento',     '/images/modelos1.jpg', 1)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

-- ── PRODUCTOS ───────────────────────────────────────────────────
-- Inserta por slug; referencia colección por slug también.
insert into products (slug, collection_id, look, name, short_name, description, material, image_label, image_url, price, sort_order) values
  ('abrigo-sombra',        (select id from collections where slug='sombra'), '01', 'Abrigo Sombra',         E'Abrigo\nSombra',         'El abrigo que camina solo de noche. Lana merino estructurada, forro de seda, caída líquida.',                              'MERINO / SHADOW',            'LOOK 01 · 4:5', '/images/modelos1.jpg', 30000, 1),
  ('set-campo',            (select id from collections where slug='campo'),  '02', 'Set Campo',             E'Set\nCampo',             'Conjunto liviano de algodón sin teñir. Camisa oversize y short corto; uniforme de los días largos.',                       'ALGODÓN CRUDO / TIERRA',     'LOOK 02 · 4:5', '/images/modelos3.jpg', 15000, 2),
  ('chaqueta-piel-sombra', (select id from collections where slug='sombra'), '03', 'Chaqueta Piel Sombra',  E'Chaqueta\nPiel Sombra',  'Cuero napa tratado en mate. Crop alto, cremallera asimétrica; segunda piel para el animal urbano.',                        'NAPA MATE / ÓNIX',           'LOOK 03 · 4:5', '/images/modelos4.jpg', 28000, 3),
  ('sudadera-bruma',       (select id from collections where slug='campo'),  '04', 'Sudadera Bruma',        E'Sudadera\nBruma',        'Algodón pesado en blanco roto con paneles internos en obsidiana. Capucha estructurada, gráfico bordado al tono.',           'ALGODÓN PESADO / BLANCO ROTO','LOOK 04 · 4:5', '/images/ropa.jpg',    18000, 4),
  ('gabardina-nocturna',   (select id from collections where slug='sombra'), '05', 'Gabardina Nocturna',    E'Gabardina\nNocturna',    'Gabardina con cuerpo y silencio. Construcción técnica con caída fluida; hombros que no se ven, se intuyen.',                'GABARDINA / SEDA',           'LOOK 05 · 4:5', null,                  27000, 5),
  ('sueter-medianoche',    (select id from collections where slug='sombra'), '06', 'Suéter Medianoche',     E'Suéter\nMedianoche',     'Cashmere denso, cuello cerrado. La prenda para entrar al hábitat sin hacer ruido.',                                         'CASHMERE / NOIR',            'LOOK 06 · 4:5', null,                  19000, 6),
  ('pantalon-caza',        (select id from collections where slug='campo'),  '07', 'Pantalón Caza',         E'Pantalón\nCaza',         'Lana fría con caída precisa. Cintura alta, pierna recta; corta como una sombra recta sobre el suelo.',                      'LANA FRÍA / CARBÓN',         'LOOK 07 · 4:5', null,                  20000, 7),
  ('vestido-eclipse',      (select id from collections where slug='sombra'), '08', 'Vestido Eclipse',       E'Vestido\nEclipse',       'Seda salvaje con drapeado bajo. Espalda al aire, frente cerrado; aparece de noche y no se explica.',                        'SEDA SALVAJE / NOIR',        'LOOK 08 · 4:5', null,                  24000, 8),
  ('blazer-cazador',       (select id from collections where slug='sombra'), '09', 'Blazer Cazador',        E'Blazer\nCazador',        'Construcción sastre con hombro vivo. Solapa estrecha, cintura marcada; un arma vestida de elegancia.',                      'LANA / OBSIDIANA',           'LOOK 09 · 4:5', null,                  26000, 9),
  ('camisa-acechante',     (select id from collections where slug='campo'),  '10', 'Camisa Acechante',      E'Camisa\nAcechante',      'Popelín pesado con cuello rígido. Silueta amplia, puños cerrados; camina antes que la pisada.',                             'POPELÍN / GRAFITO',          'LOOK 10 · 4:5', null,                  16000, 10),
  ('falda-medianoche',     (select id from collections where slug='sombra'), '11', 'Falda Medianoche',      E'Falda\nMedianoche',      'Lana cruda al tobillo. Tablones profundos que se abren al andar; ritmo de cazador que cuenta sus pasos.',                   'LANA CRUDA / TINTA',         'LOOK 11 · 4:5', null,                  21000, 11),
  ('trench-niebla',        (select id from collections where slug='sombra'), '12', 'Trench Niebla',         E'Trench\nNiebla',         'Gabardina técnica con cinturón flojo. Largo a media pierna; se desliza, no se viste.',                                       'GABARDINA TÉCNICA / HUMO',   'LOOK 12 · 4:5', null,                  27000, 12),
  ('botas-paso-mudo',      (select id from collections where slug='campo'),  '13', 'Botas Paso Mudo',       E'Botas\nPaso Mudo',       'Cuero crudo, suela de goma silente. Caña alta, hormado anatómico; el sonido que la ciudad nunca escucha.',                  'CUERO CRUDO / GOMA',         'LOOK 13 · 4:5', null,                  25000, 13)
on conflict (slug) do nothing;

-- ── TALLES POR PRODUCTO ─────────────────────────────────────────
-- XS-XL para ropa; 36-41 para las botas.
insert into product_sizes (product_id, label, stock, sort_order)
select p.id, s.label, 99, s.sort_order
from products p
cross join (values
  ('XS', 0), ('S', 1), ('M', 2), ('L', 3), ('XL', 4)
) as s(label, sort_order)
where p.slug <> 'botas-paso-mudo'
on conflict (product_id, label) do nothing;

insert into product_sizes (product_id, label, stock, sort_order)
select p.id, s.label, 99, s.sort_order
from products p
cross join (values
  ('36', 0), ('37', 1), ('38', 2), ('39', 3), ('40', 4), ('41', 5)
) as s(label, sort_order)
where p.slug = 'botas-paso-mudo'
on conflict (product_id, label) do nothing;
