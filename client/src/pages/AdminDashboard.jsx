import React, { useState, useEffect } from 'react';
import { Home, Package, Monitor, Palette, Plus } from 'lucide-react';
import HomeTab from '../components/admin/HomeTab';
import MenusTab from '../components/admin/MenusTab';
import ProductsTab from '../components/admin/ProductsTab';
import DesignTab from '../components/admin/DesignTab';
import { getProducts, getMenus } from '../api/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMenu, setSelectedMenu] = useState(1);
  const [products, setProducts] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedMenu]);

  const loadData = async () => {
    try {
      const [menusData, productsData] = await Promise.all([
        getMenus(),
        getProducts(selectedMenu)
      ]);
      setMenus(menusData);
      setProducts(productsData);
    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'home', name: 'דף ראשי', icon: Home },
    { id: 'menus', name: 'תפריטים', icon: Monitor },
    { id: 'products', name: 'מוצרים', icon: Package },
    { id: 'design', name: 'עיצוב', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  const currentMenu = menus.find(m => m.id === selectedMenu) || menus[0];

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-assistant overflow-hidden" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gold text-white p-2 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MenuPro</h1>
                <p className="text-sm text-gray-500">פאנל ניהול תפריטים</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* בחירת תפריט */}
              {menus.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">תפריט:</span>
                  <select
                    value={selectedMenu}
                    onChange={(e) => setSelectedMenu(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    {menus.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <a
                href={`/?menu=${selectedMenu}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold hover:bg-gold-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <span>צפייה בתפריט</span>
                <span>🔗</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'text-gold border-gold bg-gold/5'
                      : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'home' && (
            <HomeTab 
              menus={menus}
              products={products} 
              selectedMenu={selectedMenu}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'menus' && (
            <MenusTab 
              menus={menus}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              onRefresh={loadData}
            />
          )}
        {activeTab === 'products' && (
          <ProductsTab 
            products={products}
            setProducts={setProducts}
            selectedMenu={selectedMenu}
            menus={menus}
            onRefresh={loadData}
          />
        )}
          {activeTab === 'design' && (
            <DesignTab 
              menu={currentMenu}
              onUpdate={loadData}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
