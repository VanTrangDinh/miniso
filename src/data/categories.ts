export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: 'ao',
    name: 'Áo',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    slug: 'ao'
  },
  {
    id: 'quan',
    name: 'Quần',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    slug: 'quan'
  },
  {
    id: 'dam',
    name: 'Đầm',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    slug: 'dam'
  },
  {
    id: 'phu-kien',
    name: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    slug: 'phu-kien'
  }
]; 