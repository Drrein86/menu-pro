import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Image as ImageIcon, Save, X, Upload, Package } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, uploadFile } from '../../api/api';

const ProductsTab = ({ products, setProducts, selectedMenu, menus, onRefresh }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'כללי',
    is_recommended: 0,
    image_url: '',
  });
  const [selectedMenus, setSelectedMenus] = useState([selectedMenu]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || 'כללי',
      is_recommended: product.is_recommended,
      image_url: product.image_url || '',
      menu_id: product.menu_id || selectedMenu,
    });
    setSelectedMenus([product.menu_id || selectedMenu]);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'כללי',
      is_recommended: 0,
      image_url: '',
      menu_id: selectedMenu,
    });
    setSelectedMenus([selectedMenu]);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'כללי',
      is_recommended: 0,
      image_url: '',
      menu_id: selectedMenu,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.price) {
        alert('שם ומחיר הם שדות חובה');
        return;
      }

      if (isAdding) {
        // יצירת מוצר חדש - אפשר למספר תפריטים
        if (selectedMenus.length === 0) {
          alert('יש לבחור לפחות תפריט אחד');
          return;
        }
        
        // יצירת מוצר לכל תפריט שנבחר
        for (const menuId of selectedMenus) {
          await createProduct({
            ...formData,
            menu_id: menuId
          });
        }
        
        if (selectedMenus.length > 1) {
          alert(`המוצר נוסף בהצלחה ל-${selectedMenus.length} תפריטים!`);
        }
      } else if (editingProduct) {
        // עריכת מוצר קיים - רק התפריט הנוכחי
        await updateProduct(editingProduct, formData);
      }

      await onRefresh();
      handleCancel();
    } catch (error) {
      console.error('שגיאה בשמירה:', error);
      alert('שגיאה בשמירת המוצר');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      return;
    }

    try {
      await deleteProduct(id);
      await onRefresh();
    } catch (error) {
      console.error('שגיאה במחיקה:', error);
      alert('שגיאה במחיקת המוצר');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadFile(file, setUploadProgress);
      setFormData({ ...formData, image_url: result.url });
      setUploadProgress(0);
    } catch (error) {
      console.error('שגיאה בהעלאת תמונה:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const categories = [...new Set(products.map(p => p.category || 'כללי'))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">ניהול מוצרים</h2>
          <p className="text-gray-600 mt-1">ערוך, הוסף ומחק מוצרים מהתפריט</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          הוסף מוצר
        </button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-800 mb-1">💡 שיוך מוצרים לתפריטים</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>הוספת מוצר חדש:</strong> אפשר לבחור תפריט אחד או יותר - המוצר יתווסף לכולם!</li>
              <li>• <strong>עריכת מוצר:</strong> שינויים חלים רק על התפריט הנוכחי.</li>
              <li>• <strong>מחיקת מוצר:</strong> נמחק רק מהתפריט הנוכחי (לא משפיע על תפריטים אחרים).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form (Add/Edit) */}
      {(isAdding || editingProduct) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gold">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {isAdding ? 'הוספת מוצר חדש' : 'עריכת מוצר'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                שם המוצר *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="לדוגמה: המבורגר"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                מחיר *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            {/* בחירת תפריטים - רק בהוספת מוצר חדש */}
            {isAdding && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  שייך לתפריטים *
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {menus && menus.map((menu) => (
                      <label
                        key={menu.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMenus.includes(menu.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMenus([...selectedMenus, menu.id]);
                            } else {
                              setSelectedMenus(selectedMenus.filter(id => id !== menu.id));
                            }
                          }}
                          className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{menu.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 בחר תפריט אחד או יותר. המוצר יתווסף לכל התפריטים שנבחרו.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                קטגוריה
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                list="categories"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="כללי"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                תמונה
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="URL של תמונה"
                />
                <label className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  העלה
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && (
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gold h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                תיאור
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                rows="3"
                placeholder="תיאור קצר של המוצר..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_recommended === 1}
                  onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked ? 1 : 0 })}
                  className="w-5 h-5 text-gold focus:ring-gold rounded"
                />
                <Star className="w-5 h-5 text-gold" />
                <span className="font-semibold text-gray-700">סמן כמוצר מומלץ</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              שמור
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">אין מוצרים עדיין</p>
            <p className="mt-2">לחץ על "הוסף מוצר" כדי להתחיל</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">תמונה</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">שם</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">תיאור</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">מחיר</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">קטגוריה</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">תפריט</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">מומלץ</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {product.description || '-'}
                  </td>
                  <td className="px-6 py-4 font-bold text-gold">₪{product.price}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {menus?.find(m => m.id === product.menu_id)?.name || 'לא ידוע'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.is_recommended === 1 && (
                      <Star className="w-5 h-5 text-gold fill-current mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ערוך"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="מחק"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;

