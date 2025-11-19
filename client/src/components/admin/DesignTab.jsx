import React, { useState } from 'react';
import { Save, Palette, Type, RefreshCw, ZoomIn } from 'lucide-react';
import { updateMenu } from '../../api/api';

const DesignTab = ({ menu, onUpdate }) => {
  const [formData, setFormData] = useState({
    business_name: menu.business_name || '',
    business_slogan: menu.business_slogan || '',
    theme_color: menu.theme_color || '#1a1a1a',
    text_color: menu.text_color || '#ffffff',
    accent_color: menu.accent_color || '#d4af37',
    font_family: menu.font_family || 'Assistant',
    video_zoom: menu.video_zoom || 2.0,
  });

  const handleSave = async () => {
    try {
      await updateMenu(menu.id, formData);
      await onUpdate();
      alert('העיצוב נשמר בהצלחה!');
    } catch (error) {
      console.error('שגיאה בשמירה:', error);
      alert('שגיאה בשמירת העיצוב');
    }
  };

  const handleReset = () => {
    if (!confirm('האם אתה בטוח שברצונך לאפס את העיצוב לברירת המחדל?')) {
      return;
    }

    setFormData({
      business_name: menu.business_name || '',
      business_slogan: menu.business_slogan || '',
      theme_color: '#1a1a1a',
      text_color: '#ffffff',
      accent_color: '#d4af37',
      font_family: 'Assistant',
      video_zoom: 2.0,
    });
  };

  const presetThemes = [
    {
      name: 'קלאסי זהוב',
      theme_color: '#1a1a1a',
      text_color: '#ffffff',
      accent_color: '#d4af37',
    },
    {
      name: 'כחול מודרני',
      theme_color: '#0f172a',
      text_color: '#f1f5f9',
      accent_color: '#3b82f6',
    },
    {
      name: 'ירוק טבעי',
      theme_color: '#064e3b',
      text_color: '#ecfdf5',
      accent_color: '#10b981',
    },
    {
      name: 'סגול אלגנטי',
      theme_color: '#1e1b4b',
      text_color: '#ede9fe',
      accent_color: '#a855f7',
    },
    {
      name: 'אדום חם',
      theme_color: '#450a0a',
      text_color: '#fef2f2',
      accent_color: '#ef4444',
    },
  ];

  const fonts = [
    { name: 'Assistant', label: 'Assistant - קריא ומודרני' },
    { name: 'Rubik', label: 'Rubik - עגול וידידותי' },
    { name: 'Heebo', label: 'Heebo - קלאסי ומקצועי' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">עיצוב התפריט: {menu.name}</h2>
        <p className="text-gray-600 mt-1">התאם צבעים, גופנים ומראה כללי</p>
      </div>

      {/* Main Design Panel */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Settings */}
          <div className="space-y-6">
            {/* שם ושם עסק */}
            <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">פרטי העסק</h3>
              
              <div className="space-y-4">
                {/* שם העסק */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    שם העסק (יוצג למעלה במסך)
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="לדוגמה: מסעדת הזהב"
                  />
                </div>

                {/* סלוגן */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    סלוגן / משפט פרסומי
                  </label>
                  <input
                    type="text"
                    value={formData.business_slogan}
                    onChange={(e) => setFormData({ ...formData, business_slogan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="לדוגמה: הטעם האמיתי של הבית"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Palette className="w-6 h-6" />
              הגדרות צבעים
            </h3>

            {/* Theme Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                צבע רקע ראשי
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.theme_color}
                  onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                  className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={formData.theme_color}
                  onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-mono"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                צבע טקסט
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                  className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-mono"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                צבע הדגשה (מחירים, כותרות)
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-mono"
                />
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Type className="w-5 h-5" />
                גופן
              </label>
              <select
                value={formData.font_family}
                onChange={(e) => setFormData({ ...formData, font_family: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                {fonts.map((font) => (
                  <option key={font.name} value={font.name}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Zoom Control */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ZoomIn className="w-5 h-5" />
                זום וידאו רקע
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={formData.video_zoom}
                  onChange={(e) => setFormData({ ...formData, video_zoom: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>רחוק (1x)</span>
                  <span className="font-bold text-gold text-base">{formData.video_zoom}x</span>
                  <span>קרוב מאוד (6x)</span>
                </div>
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  💡 ערכים גבוהים יותר יקרבו את הוידאו ויסתירו את המסגרת השחורה
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                שמור עיצוב
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                אפס
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">תצוגה מקדימה</h3>
            <div
              className="rounded-lg p-8 min-h-[400px]"
              style={{
                backgroundColor: formData.theme_color,
                color: formData.text_color,
                fontFamily: formData.font_family,
              }}
            >
              <h2
                className="text-3xl font-bold mb-6 pb-3 border-b-2"
                style={{ color: formData.accent_color, borderColor: formData.accent_color }}
              >
                מנות עיקריות
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start p-4 rounded bg-white/5">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">המבורגר בית</h3>
                    <p className="opacity-80 text-sm">
                      המבורגר עסיסי עם ירקות טריים ורטבים מיוחדים
                    </p>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: formData.accent_color }}>
                    ₪52
                  </div>
                </div>

                <div className="flex justify-between items-start p-4 rounded bg-white/5">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">פסטה קרבונרה</h3>
                    <p className="opacity-80 text-sm">
                      פסטה עם רטב שמנת, בייקון ופרמזן
                    </p>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: formData.accent_color }}>
                    ₪56
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t opacity-60 text-center" style={{ borderColor: formData.text_color + '20' }}>
                תיאבון טוב! 🍽️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">ערכות נושא מוכנות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {presetThemes.map((theme, idx) => (
            <button
              key={idx}
              onClick={() => setFormData({ ...formData, ...theme })}
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-gold transition-all"
            >
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.theme_color }}
                />
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.accent_color }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-gold">
                {theme.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          💡 טיפים לעיצוב מוצלח
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• וודא שיש ניגודיות מספקת בין צבע הרקע לצבע הטקסט</li>
          <li>• צבע ההדגשה צריך להיות בולט ובולט ביחס לרקע</li>
          <li>• בחר גופן קריא ונוח לקריאה ממרחק</li>
          <li>• בדוק את התצוגה על מסך הטלוויזיה בפועל</li>
        </ul>
      </div>
    </div>
  );
};

export default DesignTab;
