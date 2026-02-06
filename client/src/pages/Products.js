import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Plus,
  Search,
  Filter,
  Package,
  DollarSign,
  Tag,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const ProductsContainer = styled.div`
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 25px;
    align-items: stretch;
    padding: 30px 20px;
  }
  
  .header-left {
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin-bottom: 10px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      font-weight: 400;
    }
  }
`;

const AddProductButton = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 18px 32px;
  }
`;

const FiltersSection = styled.div`
  padding: 0 40px 30px 40px;
  display: flex;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 0 20px 30px 20px;
    flex-direction: column;
    gap: 15px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 20px 12px 45px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0a6b1;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  
  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #a0a6b1;
  }
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
  
  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const ProductsGrid = styled.div`
  padding: 0 40px 40px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 0 20px 40px 20px;
    grid-template-columns: 1fr;
    gap: 25px;
    max-height: calc(100vh - 400px);
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f3f4;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    color: #a0a6b1;
  }
  
  .category-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(102, 126, 234, 0.9);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }
`;

const ProductInfo = styled.div`
  padding: 25px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #27ae60;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  .label {
    font-size: 12px;
    color: #7f8c8d;
    margin-bottom: 4px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  
  &.view {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &.edit {
    background: #f39c12;
    color: white;
    
    &:hover {
      background: #e67e22;
    }
  }
  
  &.delete {
    background: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
    }
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 24px;
  color: #7f8c8d;
  
  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px auto;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a0a6b1;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #2c3e50;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    name: 'Samsung TV 55" QLED 4K',
    price: 12500000,
    category: 'Televizor',
    brand: 'Samsung',
    model: 'QE55Q70A',
    stock: 15,
    image: null
  },
  {
    id: 2,
    name: 'LG Muzlatgich Side by Side',
    price: 8900000,
    category: 'Muzlatgich',
    brand: 'LG',
    model: 'GSL761PZXV',
    stock: 8,
    image: null
  },
  {
    id: 3,
    name: 'Artel Kir Yuvish Mashinasi',
    price: 4200000,
    category: 'Kir yuvish mashinasi',
    brand: 'Artel',
    model: 'ART-WM-60L',
    stock: 12,
    image: null
  },
  {
    id: 4,
    name: 'iPhone 15 Pro Max 256GB',
    price: 18500000,
    category: 'Smartfon',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    stock: 5,
    image: null
  },
  {
    id: 5,
    name: 'MacBook Air M2 13"',
    price: 16800000,
    category: 'Noutbuk',
    brand: 'Apple',
    model: 'MacBook Air M2',
    stock: 7,
    image: null
  },
  {
    id: 6,
    name: 'Artel Konditsioner Split',
    price: 3500000,
    category: 'Konditsioner',
    brand: 'Artel',
    model: 'ART-AC-12',
    stock: 20,
    image: null
  }
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Televizor', 'Muzlatgich', 'Kir yuvish mashinasi', 'Smartfon', 'Noutbuk', 'Konditsioner'];

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const handleAddProduct = () => {
    // TODO: Open add product modal
    console.log('Add new product');
  };

  const handleViewProduct = (product) => {
    // TODO: Open product details modal
    console.log('View product:', product);
  };

  const handleEditProduct = (product) => {
    // TODO: Open edit product modal
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Haqiqatan ham "${product.name}" mahsulotini o'chirmoqchimisiz?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  return (
    <ProductsContainer>
      <Header>
        <div className="header-left">
          <h1>Mahsulotlar</h1>
          <p>Barcha mahsulotlarni boshqarish ({filteredProducts.length} ta mahsulot)</p>
        </div>
        
        <AddProductButton onClick={handleAddProduct}>
          <Plus size={22} />
          Yangi mahsulot qo'shish
        </AddProductButton>
      </Header>

      <FiltersSection>
        <SearchContainer>
          <Search size={20} className="search-icon" />
          <SearchInput
            type="text"
            placeholder="Mahsulot nomi, brend yoki model bo'yicha qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <FilterButton
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              <Filter size={16} />
              {category === 'all' ? 'Barchasi' : category}
            </FilterButton>
          ))}
        </div>
      </FiltersSection>

      <ProductsGrid>
        {filteredProducts.length === 0 ? (
          <EmptyState>
            <div className="icon">
              <Package size={40} />
            </div>
            <h3>Mahsulot topilmadi</h3>
            <p>Qidiruv shartlariga mos mahsulot mavjud emas</p>
            <AddProductButton onClick={handleAddProduct}>
              <Plus size={18} />
              Yangi mahsulot qo'shish
            </AddProductButton>
          </EmptyState>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage>
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <Package size={48} className="placeholder" />
                )}
                <div className="category-badge">{product.category}</div>
              </ProductImage>
              
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>
                  <DollarSign size={20} />
                  {product.price.toLocaleString()} so'm
                </ProductPrice>
                
                <ProductDetails>
                  <DetailItem>
                    <div className="label">Brend</div>
                    <div className="value">{product.brand}</div>
                  </DetailItem>
                  <DetailItem>
                    <div className="label">Model</div>
                    <div className="value">{product.model}</div>
                  </DetailItem>
                  <DetailItem>
                    <div className="label">Omborda</div>
                    <div className="value">{product.stock} dona</div>
                  </DetailItem>
                  <DetailItem>
                    <div className="label">Kategoriya</div>
                    <div className="value">{product.category}</div>
                  </DetailItem>
                </ProductDetails>
                
                <ProductActions>
                  <ActionButton className="view" onClick={() => handleViewProduct(product)}>
                    <Eye size={14} />
                    Ko'rish
                  </ActionButton>
                  <ActionButton className="edit" onClick={() => handleEditProduct(product)}>
                    <Edit size={14} />
                    Tahrir
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => handleDeleteProduct(product)}>
                    <Trash2 size={14} />
                    O'chirish
                  </ActionButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))
        )}
      </ProductsGrid>
    </ProductsContainer>
  );
};

export default Products;