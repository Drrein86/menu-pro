# MenuPro Local Display 🍽️

מערכת יצירת תפריטים דיגיטליים לעסק אחד עם וידאו רקע, לוגו דינמי ופאנל ניהול מלא.

## תכונות עיקריות

✨ דף תצוגה מעוצב עם וידאו רקע  
🖼️ לוגו דינמי ניתן להחלפה  
🍽️ ניהול מוצרים, מחירים ותיאורים  
🎨 התאמות עיצוב מלאות  
📱 מותאם לתצוגה על מסך טלוויזיה/טאבלט  

## התקנה

### שלב 1: התקנת תלויות שרת
```bash
npm install
```

### שלב 2: התקנת תלויות קליינט
```bash
cd client
npm install
cd ..
```

### שלב 3: הרצת המערכת
```bash
npm run dev
```

המערכת תעלה על:
- **דף תצוגה**: http://localhost:5173
- **פאנל ניהול**: http://localhost:5173/admin
- **שרת API**: http://localhost:3000

## מבנה הפרויקט

```
menu2/
├── server/           # Backend - Express + SQLite
│   ├── index.js
│   ├── db.js
│   └── routes/
├── client/           # Frontend - React + Vite
│   └── src/
│       ├── pages/
│       ├── components/
│       └── App.jsx
├── uploads/          # קבצים שהועלו
└── package.json
```

## טכנולוגיות

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite
- **File Upload**: Multer

---
נוצר עם ❤️

