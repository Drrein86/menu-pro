# 🚀 פריסה ל-Vercel - מדריך צעד אחר צעד

## ⚠️ אם קיבלת DNS_PROBE_FINISHED_NXDOMAIN

זה אומר שהפריסה לא הצליחה. בוא נעשה את זה שלב אחר שלב:

---

## 📋 דרך 1: דרך האתר (מומלץ!)

### שלב 1: וודא שהפרויקט ב-GitHub

1. **גש ל**: https://github.com/Drrein86/menu-pro
2. **וודא** שהפרויקט קיים עם כל הקבצים

אם **אין**, הרץ:
```
upload-to-github-Drrein86.bat
```

---

### שלב 2: התחבר ל-Vercel

1. **גש ל**: https://vercel.com
2. **Sign Up / Login** עם GitHub
3. **אשר** את הגישה ל-GitHub

---

### שלב 3: Import הפרויקט

1. **Dashboard** → **Add New...** → **Project**
2. **Import Git Repository**
3. **בחר**: `Drrein86/menu-pro`
4. אם לא רואה - לחץ **"Adjust GitHub App Permissions"**

---

### שלב 4: הגדרות הפרויקט

**בעמוד הקונפיגורציה, מלא:**

#### General:
- **Framework Preset**: `Other` (או השאר ריק)
- **Root Directory**: `./` (ברירת מחדל)

#### Build Settings:
```
Build Command: cd client && npm install && npm run build
Output Directory: client/dist
Install Command: npm install
```

#### Environment Variables:
**לחץ** "Add" לכל אחד:

**משתנה 1:**
- Name: `SUPABASE_URL`
- Value: `https://lykcxbuxqanujqqalxsh.supabase.co`

**משתנה 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzgzMDQsImV4cCI6MjA3OTA1NDMwNH0.0TZeIUC2CvXbNWQucP1vbkAvixBlFA2B3UoaggqA7p4`

**משתנה 3:**
- Name: `SUPABASE_SERVICE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ3ODMwNCwiZXhwIjoyMDc5MDU0MzA0fQ.F6FwwGWdSvCu7cD-O3pOHbqvrY408JX3JDYUl6tm0V4`

---

### שלב 5: Deploy!

**לחץ** על כפתור **"Deploy"**

**המתן** 2-5 דקות...

---

### שלב 6: בדוק את התוצאה

אם הכל טוב, תראה:
```
🎉 Your project has been deployed!
```

**URL שלך יהיה:** `https://menu-pro-xxx.vercel.app`

---

## 🔴 אם קיבלת שגיאה:

### בעיה 1: "Build Failed"

**לחץ** על "View Function Logs"

**שגיאות נפוצות:**

#### "Cannot find module..."
**פתרון:**
1. Settings → Environment Variables
2. וודא שיש את 3 המשתנים
3. Deployments → ... → Redeploy

#### "Build script failed"
**פתרון:**
1. Settings → General → Build & Development Settings
2. **Build Command**: `cd client && npm install && npm run build`
3. **Output Directory**: `client/dist`
4. Redeploy

---

## 📋 דרך 2: Vercel CLI

### התקנה:
```bash
npm install -g vercel
```

### התחברות:
```bash
vercel login
```

### פריסה:
```bash
vercel
```

**ענה על השאלות:**
```
? Set up and deploy? → Y
? Which scope? → [Your account]
? Link to existing project? → N
? What's your project's name? → menu-pro
? In which directory is your code located? → ./
```

### הוספת משתני סביבה:
```bash
vercel env add SUPABASE_URL
# הדבק: https://lykcxbuxqanujqqalxsh.supabase.co

vercel env add SUPABASE_ANON_KEY
# הדבק את ה-key

vercel env add SUPABASE_SERVICE_KEY
# הדבק את ה-key
```

### פריסה ל-Production:
```bash
vercel --prod
```

---

## 🆘 עדיין לא עובד?

### בדוק את זה:

1. **GitHub Repository קיים?**
   - גש ל: https://github.com/Drrein86/menu-pro
   - וודא שיש קבצים

2. **Vercel מחובר ל-GitHub?**
   - Vercel → Settings → Git
   - GitHub Account צריך להיות מחובר

3. **משתני הסביבה מוגדרים?**
   - Vercel → Project → Settings → Environment Variables
   - צריכים להיות 3 משתנים

4. **הלוגים מראים מה?**
   - Vercel → Project → Deployments → [Latest] → View Function Logs

---

## 💡 חלופה זמנית - הרץ מקומי:

אם Vercel מסבך, תמיד אפשר להריץ מקומית:

```bash
npm install
npm run dev
```

ואז על הטלוויזיה:
```
http://[IP_שלך]:5173/?menu=1
```

---

## 📸 אם אתה תקוע:

שלח לי צילום מסך של:
1. Vercel Dashboard
2. Deployment Logs
3. השגיאה שאתה מקבל

ואני אעזור לתקן!

---

**מה הסטטוס עכשיו? איפה אתה תקוע? 🤔**

