import React from 'react';
import { Package, Monitor, Palette, ArrowLeft, CheckCircle, Plus } from 'lucide-react';

const HomeTab = ({ menus, products, selectedMenu, onNavigate }) => {
  const currentMenu = menus.find(m => m.id === selectedMenu) || menus[0];
  
  const stats = [
    {
      title: 'תפריטים פעילים',
      value: menus.length,
      icon: Monitor,
      color: 'bg-purple-500',
      action: () => onNavigate('menus'),
    },
    {
      title: 'מוצרים בתפריט',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      action: () => onNavigate('products'),
    },
    {
      title: 'מוצרים מומלצים',
      value: products.filter(p => p.is_recommended === 1).length,
      icon: CheckCircle,
      color: 'bg-gold',
      action: () => onNavigate('products'),
    },
  ];

  const quickActions = [
    {
      title: 'צור תפריט חדש',
      description: 'הוסף תפריט נוסף לטלוויזיה נפרדת',
      icon: Plus,
      color: 'bg-purple-500',
      action: () => onNavigate('menus'),
    },
    {
      title: 'ערוך מוצרים',
      description: 'הוסף, ערוך או מחק מוצרים',
      icon: Package,
      color: 'bg-blue-500',
      action: () => onNavigate('products'),
    },
    {
      title: 'התאם עיצוב',
      description: 'שנה צבעים, גופנים ומראה',
      icon: Palette,
      color: 'bg-green-500',
      action: () => onNavigate('design'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* כותרת */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">ברוך הבא לפאנל הניהול</h2>
        <p className="text-gray-600">נהל מספר תפריטים דיגיטליים בקלות</p>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={stat.action}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* תצוגה מקדימה */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">תצוגה מקדימה - {currentMenu?.name}</h3>
          <a
            href={`/?menu=${selectedMenu}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-dark font-semibold flex items-center gap-2"
          >
            פתח במסך מלא
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={`/?menu=${selectedMenu}`}
            className="w-full h-96"
            title="תצוגה מקדימה"
          />
        </div>
      </div>

      {/* פעולות מהירות */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">פעולות מהירות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={action.action}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h4>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* סטטוס תפריט נוכחי */}
      <div className="bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-xl p-6 border border-gold/20">
        <h3 className="text-lg font-bold text-gray-800 mb-3">סטטוס תפריט: {currentMenu?.name}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">לוגו: {currentMenu?.logo_url ? 'מוגדר ✓' : 'לא מוגדר'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">רקע: {currentMenu?.media_url ? 'מוגדר ✓' : 'לא מוגדר'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">מוצרים: {products.length} פריטים</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">קטגוריות: {[...new Set(products.map(p => p.category))].length}</span>
          </div>
        </div>
      </div>

      {/* טיפ מהיר */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          💡 טיפ מהיר
        </h4>
        <p className="text-sm text-blue-700">
          כל תפריט הוא עצמאי עם מוצרים, עיצוב ורקע משלו. אתה יכול לצפות בתפריט על ידי לחיצה על "צפה" או לפתוח אותו בטלוויזיה דרך הכתובת בדפדפן.
        </p>
      </div>
    </div>
  );
};

export default HomeTab;
