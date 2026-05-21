# Axborot Tizimi Test

Bu loyiha `index.html` ichida 100 ta axborot tizimiga oid savollardan iborat test tizimini o'z ichiga oladi.

## Xususiyatlar
- 2 qismga bo'lingan test (savol 1-50 va 51-100)
- Har bir savol uchun 15 soniya taymer
- To'g'ri/noto'g'ri javob ranglari bilan ko'rsatish
- Natija hisobi va guruh bo'yicha natijalar jadvali
- Qism tanlash va qayta boshlash imkoniyati

## GitHub-ga joylash uchun
Agar loyiha papkasida bo'lsangiz, quyidagi komandalarni ishga tushiring:

```bash
git init
git add .
git commit -m "Add Axborot Tizimi Test website"
git branch -M main
git remote add origin https://github.com/saidkamol1203/test.git
git push -u origin main
```

`https://github.com/saidkamol1203/test.git` o'rniga boshqa URL kerak bo'lsa, uni o'zgartiring.

## GitHub Pages orqali link bilan ishlash
1. Repository sahifasiga kiring: `https://github.com/saidkamol1203/test`
2. `Settings` -> `Pages` bo‘limini oching.
3. `Source` uchun `main` branch va `root` papka tanlang.
4. Saqlang.

Keyin sayt bu manzilda ishlaydi:

`https://saidkamol1203.github.io/test/`

Agar GitHub Pages bir oz kutsa, ba'zi daqiqadan keyin sahifaga kirib ko'ring.

## Google Sheets orqali natijalarni saqlash

Bu loyihani Google Sheetsga ulash uchun quyidagicha amalga oshiring:

1. `https://script.google.com/` saytiga kiring va yangi `Apps Script` loyihasini yarating.
2. Quyidagi kodni `Code.gs` ichiga joylang:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.openById('SHEET_ID').getSheetByName('Sheet1');
    sheet.appendRow([
      new Date(),
      data.name,
      data.group,
      data.correct,
      data.incorrect,
      data.skipped,
      data.percentage,
      data.total,
      data.timestamp
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. `SHEET_ID` o‘rniga Google Sheets hujjatingiz ID sini yozing.
4. `Deploy` → `New deployment` → `Web app` ni tanlang.
5. `Execute as` uchun `Me` va `Who has access` uchun `Anyone` (yoki `Anyone with the link`) ni tanlang.
6. `Deploy` qiling va hosil bo‘lgan `Web app URL` ni oling.
7. `index.html` ichida `googleSheetApiUrl` qiymatini o‘sha URL bilan almashtiring.

Endi test yakunlanganda natijalar avtomatik Google Sheetsga yuboriladi.
