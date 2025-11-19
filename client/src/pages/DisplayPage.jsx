import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getProducts, getMenu } from '../api/api';
import { useSearchParams } from 'react-router-dom';

const DisplayPage = () => {
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get('menu') || '1';
  
  const [products, setProducts] = useState([]);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // רענון אוטומטי כל 30 שניות
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [menuId]);

  const loadData = async () => {
    try {
      const [productsData, menuData] = await Promise.all([
        getProducts(menuId),
        getMenu(menuId)
      ]);
      setProducts(productsData);
      setMenu(menuData);
    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
    } finally {
      setLoading(false);
    }
  };

  // קיבוץ מוצרים לפי קטגוריות
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'כללי';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const getFontFamily = () => {
    const fontMap = {
      'Assistant': 'font-assistant',
      'Rubik': 'font-rubik',
      'Heebo': 'font-heebo',
    };
    return fontMap[menu.font_family] || 'font-assistant';
  };

  // חישוב מספר מוצרים מקסימלי לתצוגה במסך אחד
  const maxProductsPerScreen = 8;
  const categoriesToShow = Object.entries(groupedProducts).slice(0, 2); // עד 2 קטגוריות
  const allProducts = categoriesToShow.flatMap(([_, items]) => items).slice(0, maxProductsPerScreen);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-3xl">
        טוען...
      </div>
    );
  }

  // בדיקה אם המדיה היא תמונה או וידאו
  const isVideo = menu.media_type === 'video' || 
                  (menu.media_url && (menu.media_url.includes('youtube.com') || 
                   menu.media_url.includes('youtu.be') ||
                   menu.media_url.endsWith('.mp4') ||
                   menu.media_url.endsWith('.mov')));

  return (
    <div 
      className={`h-screen w-screen flex overflow-hidden ${getFontFamily()}`}
      style={{ 
        backgroundColor: menu.theme_color || '#1a1a1a',
        color: menu.text_color || '#ffffff'
      }}
    >
      {/* רקע מדיה - צד שמאל */}
      <div className="w-1/3 relative overflow-hidden">
        {menu.media_url ? (
          isVideo ? (
            // וידאו
            menu.media_url.includes('youtube.com') || menu.media_url.includes('youtu.be') ? (
              <iframe
                className="absolute inset-0 w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${extractYouTubeID(menu.media_url)}?autoplay=1&mute=1&loop=1&playlist=${extractYouTubeID(menu.media_url)}&controls=0&showinfo=0&rel=0`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={menu.media_url} type="video/mp4" />
              </video>
            )
          ) : (
            // תמונה
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${menu.media_url})` }}
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="text-center text-gray-500">
              <p className="text-6xl mb-4">🍽️</p>
              <p className="text-2xl">אזור מדיה</p>
            </div>
          </div>
        )}
      </div>

      {/* אזור תפריט - צד ימין */}
      <div className="w-2/3 flex flex-col h-screen overflow-hidden">
        <div className="p-8 flex-shrink-0">
          {/* לוגו */}
          {menu.logo_url && (
            <div className="flex justify-end mb-6 fade-in">
              <img 
                src={menu.logo_url} 
                alt="Logo" 
                className="max-h-24 object-contain"
              />
            </div>
          )}
        </div>

        {/* תפריט מוצרים - ללא גלילה */}
        <div className="flex-1 px-8 pb-8 overflow-hidden">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center text-gray-400 text-3xl py-20">
              אין מוצרים להצגה
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {categoriesToShow.map(([category, items], catIdx) => {
                const itemsToShow = items.slice(0, Math.floor(maxProductsPerScreen / categoriesToShow.length));
                
                return (
                  <div key={category} className="mb-6">
                    {/* כותרת קטגוריה */}
                    <h2 
                      className="text-3xl font-bold mb-4 pb-2 border-b-2"
                      style={{ 
                        color: menu.accent_color || '#d4af37',
                        borderColor: menu.accent_color || '#d4af37'
                      }}
                    >
                      {category}
                    </h2>

                    {/* רשימת מוצרים */}
                    <div className="grid grid-cols-1 gap-3">
                      {itemsToShow.map((product) => (
                        <div 
                          key={product.id}
                          className="flex justify-between items-center gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold truncate">
                                {product.name}
                              </h3>
                              {product.is_recommended === 1 && (
                                <Star 
                                  className="w-5 h-5 fill-current flex-shrink-0" 
                                  style={{ color: menu.accent_color || '#d4af37' }}
                                />
                              )}
                            </div>
                            {product.description && (
                              <p className="text-sm opacity-75 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg shadow-lg"
                              />
                            )}
                            <div 
                              className="text-2xl font-bold whitespace-nowrap"
                              style={{ color: menu.accent_color || '#d4af37' }}
                            >
                              ₪{product.price.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* פוטר */}
        <div className="px-8 pb-6 flex-shrink-0">
          <div className="pt-4 border-t border-white/10 text-center text-lg opacity-60">
            תיאבון טוב! 🍽️
          </div>
        </div>
      </div>
    </div>
  );
};

// פונקציה לחילוץ ID של YouTube
const extractYouTubeID = (url) => {
  if (!url) return null;
  
  // Support multiple YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?\/]{11})/,
    /^([^#&?\/]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export default DisplayPage;
