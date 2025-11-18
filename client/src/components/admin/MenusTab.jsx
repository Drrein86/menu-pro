import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Monitor, Eye, Upload, Image as ImageIcon, Video, Save, X } from 'lucide-react';
import { createMenu, updateMenu, deleteMenu, uploadFile } from '../../api/api';

const MenusTab = ({ menus, selectedMenu, setSelectedMenu, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    media_url: '',
    media_type: 'image',
    theme_color: '#1a1a1a',
    text_color: '#ffffff',
    accent_color: '#d4af37',
    font_family: 'Assistant',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingMenu(null);
    setFormData({
      name: '',
      logo_url: '',
      media_url: '',
      media_type: 'image',
      theme_color: '#1a1a1a',
      text_color: '#ffffff',
      accent_color: '#d4af37',
      font_family: 'Assistant',
    });
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu.id);
    setFormData({
      name: menu.name,
      logo_url: menu.logo_url || '',
      media_url: menu.media_url || '',
      media_type: menu.media_type || 'image',
      theme_color: menu.theme_color || '#1a1a1a',
      text_color: menu.text_color || '#ffffff',
      accent_color: menu.accent_color || '#d4af37',
      font_family: menu.font_family || 'Assistant',
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingMenu(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.name) {
        alert('שם התפריט הוא שדה חובה');
        return;
      }

      if (isAdding) {
        const newMenu = await createMenu(formData);
        setSelectedMenu(newMenu.id);
      } else if (editingMenu) {
        await updateMenu(editingMenu, formData);
      }

      await onRefresh();
      handleCancel();
    } catch (error) {
      console.error('שגיאה בשמירה:', error);
      alert('שגיאה בשמירת התפריט');
    }
  };

  const handleDelete = async (id) => {
    if (id === 1) {
      alert('לא ניתן למחוק את התפריט הראשי');
      return;
    }
    
    if (!confirm('האם אתה בטוח שברצונך למחוק תפריט זה? כל המוצרים שלו יימחקו!')) {
      return;
    }

    try {
      await deleteMenu(id);
      if (selectedMenu === id) {
        setSelectedMenu(1);
      }
      await onRefresh();
    } catch (error) {
      console.error('שגיאה במחיקה:', error);
      alert('שגיאה במחיקת התפריט');
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadFile(file, setUploadProgress);
      
      if (type === 'logo') {
        setFormData({ ...formData, logo_url: result.url });
      } else if (type === 'media') {
        const isVideo = file.type.startsWith('video/');
        setFormData({ 
          ...formData, 
          media_url: result.url,
          media_type: isVideo ? 'video' : 'image'
        });
      }
      
      setUploadProgress(0);
    } catch (error) {
      console.error('שגיאה בהעלאת קובץ:', error);
      alert('שגיאה בהעלאת הקובץ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">ניהול תפריטים</h2>
          <p className="text-gray-600 mt-1">צור ונהל מספר תפריטים שונים - כל תפריט = טלוויזיה נפרדת</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          תפריט חדש
        </button>
      </div>

      {/* Form (Add/Edit) */}
      {(isAdding || editingMenu) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gold">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {isAdding ? 'יצירת תפריט חדש' : 'עריכת תפריט'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* שם התפריט */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                שם התפריט *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="לדוגמה: תפריט קומה ראשונה"
              />
            </div>

            {/* לוגו */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                לוגו
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="URL של לוגו"
                />
                <label className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  העלה
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.logo_url && (
                <img src={formData.logo_url} alt="Logo" className="mt-2 h-16 object-contain" />
              )}
            </div>

            {/* רקע/וידאו */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                רקע (תמונה או וידאו)
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setFormData({ ...formData, media_type: 'image' })}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    formData.media_type === 'image'
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 mx-auto mb-1" />
                  תמונה
                </button>
                <button
                  onClick={() => setFormData({ ...formData, media_type: 'video' })}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    formData.media_type === 'video'
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Video className="w-4 h-4 mx-auto mb-1" />
                  וידאו
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder={formData.media_type === 'image' ? 'URL של תמונה' : 'URL של וידאו או YouTube'}
                />
                <label className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  העלה
                  <input
                    type="file"
                    accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => handleFileUpload(e, 'media')}
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
              {formData.media_url && (
                <div className="mt-2">
                  {formData.media_type === 'image' ? (
                    <img src={formData.media_url} alt="Background" className="h-24 object-cover rounded" />
                  ) : (
                    <video src={formData.media_url} className="h-24 object-cover rounded" muted />
                  )}
                </div>
              )}
            </div>

            {/* גופן */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                גופן
              </label>
              <select
                value={formData.font_family}
                onChange={(e) => setFormData({ ...formData, font_family: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="Assistant">Assistant - קריא ומודרני</option>
                <option value="Rubik">Rubik - עגול וידידותי</option>
                <option value="Heebo">Heebo - קלאסי ומקצועי</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!formData.name}
              className="flex-1 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Menus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
              selectedMenu === menu.id ? 'ring-2 ring-gold' : ''
            }`}
          >
            {/* תצוגה מקדימה */}
            <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 relative">
              {menu.media_url && (
                menu.media_type === 'image' ? (
                  <img src={menu.media_url} alt={menu.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={menu.media_url} className="w-full h-full object-cover" muted />
                )
              )}
              {menu.logo_url && (
                <img src={menu.logo_url} alt="Logo" className="absolute top-2 right-2 h-12 object-contain bg-white/80 p-1 rounded" />
              )}
            </div>

            {/* פרטים */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{menu.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Monitor className="w-4 h-4" />
                <span>תפריט #{menu.id}</span>
              </div>

              {/* כפתורים */}
              <div className="flex gap-2">
                <a
                  href={`/?menu=${menu.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  צפה
                </a>
                <button
                  onClick={() => handleEdit(menu)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  ערוך
                </button>
                {menu.id !== 1 && (
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenusTab;

