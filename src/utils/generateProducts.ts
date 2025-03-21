import { Product } from '../types';

const categories = ['men', 'women', 'accessories'];
const colors = ['Đen', 'Trắng', 'Xám', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const productNames = [
  'Áo thun nam',
  'Áo sơ mi nam',
  'Quần jean nam',
  'Áo khoác nam',
  'Áo thun nữ',
  'Áo sơ mi nữ',
  'Quần jean nữ',
  'Áo khoác nữ',
  'Túi xách',
  'Ví da',
  'Thắt lưng',
  'Khăn quàng',
];

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = productNames[Math.floor(Math.random() * productNames.length)];
    const price = Math.floor(Math.random() * (1000000 - 100000) + 100000);
    const originalPrice = Math.random() > 0.5 ? price * 1.5 : undefined;
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    const reviewCount = Math.floor(Math.random() * 1000);
    const productColors = Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => colors[Math.floor(Math.random() * colors.length)]
    );
    const productSizes = Array.from(
      { length: Math.floor(Math.random() * 3) + 2 },
      () => sizes[Math.floor(Math.random() * sizes.length)]
    );

    return {
      id: `product-${index + 1}`,
      name: `${name} ${index + 1}`,
      price,
      originalPrice,
      image: `https://picsum.photos/seed/${index}/400/500`,
      rating,
      reviewCount,
      description: `Mô tả chi tiết cho sản phẩm ${name} ${index + 1}. Đây là một sản phẩm chất lượng cao, được thiết kế với phong cách hiện đại và thời trang.`,
      category,
      colors: productColors,
      sizes: productSizes,
      images: Array.from(
        { length: 4 },
        (_, imgIndex) => `https://picsum.photos/seed/${index}-${imgIndex}/400/500`
      ),
      inStock: Math.random() > 0.1, // 90% sản phẩm có sẵn
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}; 