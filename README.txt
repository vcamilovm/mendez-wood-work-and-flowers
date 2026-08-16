# MENDEZ WOOD WORK AND FLOWERS — V3

## Qué incluye
- 8 diseños reales extraídos de la fotografía de colección.
- Catálogo filtrable.
- Carrito de compras con cantidades.
- Soporte para "Precio por definir".
- Formulario de pedido.
- Pedido preparado para WhatsApp.
- 2 videos MP4 reales con controles, reproducción en celular y poster.
- Galería con fotografías reales.
- Diseño responsive.

## Cómo cambiar productos y precios
Abre `script.js` y busca `const products`.
Cada producto tiene:
- `name`: nombre.
- `category`: categoría.
- `price`: usa `null` mientras no tengas precio; después escribe un número, por ejemplo `180000`.
- `description`: descripción.
- `image`: nombre de la fotografía.

## Cómo configurar WhatsApp y redes
Al inicio de `script.js`, en `CONFIG`, cambia:
- `whatsapp`: código país + número, sin +, espacios ni guiones.
- `instagram`: URL de Instagram.
- `facebook`: URL de Facebook.

## Publicación
En tu repositorio GitHub:
1. Reemplaza `index.html`, `styles.css` y `script.js`.
2. Reemplaza/sube la carpeta `assets`.
3. Haz Commit changes.
4. GitHub Pages se actualizará automáticamente.

## Nota sobre videos
Los videos están en H.264 + yuv420p y se sirven como `video/mp4`, con `controls`, `playsinline` y `preload="metadata"` para mejorar compatibilidad en navegadores y celulares.
