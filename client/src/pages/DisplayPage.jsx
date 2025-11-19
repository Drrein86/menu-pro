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
      <div className="w-1/3 relative overflow-hidden bg-black">
        {menu.media_url ? (
          isVideo ? (
            // וידאו
            menu.media_url.includes('youtube.com') || menu.media_url.includes('youtu.be') ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: '400%',
                    height: '400%',
                    transform: 'translate(-50%, -50%) scale(1.5)',
                    border: 'none',
                    pointerEvents: 'none'
                  }}
                  src={`https://www.youtube.com/embed/${extractYouTubeID(menu.media_url)}?autoplay=1&mute=1&loop=1&playlist=${extractYouTubeID(menu.media_url)}&controls=0&showinfo=0&rel=0&modestbranding=1&fs=0&disablekb=1&iv_load_policy=3&playsinline=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                />
              </div>
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
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          {/* לוגו */}
          {menu.logo_url && (
            <div className="flex justify-end fade-in">
              <img 
                src={menu.logo_url} 
                alt="Logo" 
                className="max-h-16 object-contain"
              />
            </div>
          )}
        </div>

        {/* תפריט מוצרים - ללא גלילה */}
        <div className="flex-1 px-6 pb-4 overflow-hidden flex flex-col">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center text-gray-400 text-2xl py-20">
              אין מוצרים להצגה
            </div>
          ) : (
            <div className="h-full flex flex-col justify-evenly">
              {categoriesToShow.map(([category, items], catIdx) => {
                const totalCategories = categoriesToShow.length;
                const itemsPerCategory = Math.floor(maxProductsPerScreen / totalCategories);
                const itemsToShow = items.slice(0, itemsPerCategory);
                
                return (
                  <div key={category} className="flex-1 flex flex-col justify-center">
                    {/* כותרת קטגוריה */}
                    <h2 
                      className="text-2xl font-bold mb-3 pb-1 border-b-2"
                      style={{ 
                        color: menu.accent_color || '#d4af37',
                        borderColor: menu.accent_color || '#d4af37'
                      }}
                    >
                      {category}
                    </h2>

                    {/* רשימת מוצרים */}
                    <div className="grid grid-cols-1 gap-2">
                      {itemsToShow.map((product) => (
                        <div 
                          key={product.id}
                          className="flex justify-between items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="text-lg font-semibold truncate">
                                {product.name}
                              </h3>
                              {product.is_recommended === 1 && (
                                <Star 
                                  className="w-4 h-4 fill-current flex-shrink-0" 
                                  style={{ color: menu.accent_color || '#d4af37' }}
                                />
                              )}
                            </div>
                            {product.description && (
                              <p className="text-xs opacity-75 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded-lg shadow-lg"
                              />
                            )}
                            <div 
                              className="text-xl font-bold whitespace-nowrap"
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
        <div className="px-6 pb-3 flex-shrink-0">
          <div className="pt-2 border-t border-white/10 text-center text-base opacity-60">
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
