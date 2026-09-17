# ⏳ MİKAT — Vakit, İbadet & Üretkenlik Asistanı

[![Canlı Yayın](https://img.shields.io/badge/Canlı%20Yayın-mikat.komutrotasi.com-3ecfb0?style=for-the-badge&logo=googlechrome&logoColor=white)](https://mikat.komutrotasi.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Çevrimdışı%20Destekli-0d1117?style=for-the-badge&logo=pwa&logoColor=white)](https://mikat.komutrotasi.com)
[![License: MIT](https://img.shields.io/badge/Lisans-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Ekosistem-Komut%20Rotası-orange?style=for-the-badge)](https://komutrotasi.com)

> *"Vaktin Kıymetini Bilenler İçin"*

Mikat, modern üretkenlik araçları ile manevi yaşam ritmini tek bir potada eriten kapsamlı bir kişisel takip asistanıdır. Canlı ezan vakitleri (AlAdhan API), Kur'an/hadis kütüphanesi, Pomodoro tekniği, gelişmiş alışkanlık ve görev takip motoru ile çevrimdışı (Offline PWA) tam uyumlu olarak çalışır.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🕌 Vakit & İbadet Asistanı
* **Canlı Ezan Vakitleri:** AlAdhan API entegrasyonuyla konuma göre otomatik hesaplanan imsak, güneş, öğle, ikindi, akşam ve yatsı vakitleri.
* **Kalan Süre Sayacı:** Sıradaki namaz vaktine dinamik geri sayım ve bildirim uyarıları.
* **Kıble Pusulası:** Cihaz sensörleri ve manyetik pusula desteği ile anlık kıble yönü tespiti.
* **Namaz Çetelesi:** Günlük 5 vakit ve kaza namazlarının interaktif takibi.

### 2. ⚡ Üretkenlik & Görev Yönetimi
* **Pomodoro Sayacı:** 25 dk odaklanma / 5 dk mola döngüleriyle derin çalışma seansları.
* **Görev & Yapılacaklar (To-Do):** Öncelik seviyeli, etiketli ve tamamlanma istatistikli görev listesi.
* **Alışkanlık Takip Motoru:** Günlük ve haftalık alışkanlık zincirleri (Zinciri Kırma).

### 3. 📖 Manevi & Kültürel Kütüphane
* **Kur'an-ı Kerim & Sureler:** Sure mealleri, Arapça hat metinleri ve sesli tilavet desteği.
* **Hadis & Günün Duası:** Günlük dinamik değişen hadis-i şerifler ve mektuplar.
* **Esmâü'l-Hüsnâ:** 99 esmanın anlamları, faziletleri ve dijital zikirmatik entegrasyonu.
* **Gelişmiş Zikirmatik:** Titreşim ve ses destekli, hedef sayacı ayarlanabilir zikir aracı.

### 4. 📱 Çevrimdışı (PWA) & Tasarım
* **Tam PWA Desteği:** `service-worker.js` ve `manifest.json` sayesinde internet bağlantısı olmadan da tam işlevsellik.
* **Koyu / Açık Tema:** Göz yormayan kurumsal açık tema (varsayılan) ve karanlık mod seçeneği.
* **Yönetim Paneli (`admin.html`):** Görev, alışkanlık, içerik ve sistem ayarlarını yönetebileceğiniz entegre demo yönetim arayüzü.

---

## 🛠️ Teknoloji Yığını

* **Çekirdek:** Modern HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Design Tokens & HSL Renk Paleti)
* **API:** [AlAdhan Prayer Times API](https://aladhan.com/prayer-times-api) (Açık, anahtarsız servis)
* **Veri Depolama:** Tarayıcı tabanlı `localStorage` ve `IndexedDB` (Kullanıcı gizliliği odaklı, yerel veri saklama)
* **Yazı Tipleri:** Google Fonts (Outfit & Plus Jakarta Sans)
* **İkonlar:** FontAwesome 6 Free

---

## 🚀 Yerel Geliştirme ve Kurulum

Projeyi çalıştırmak için herhangi bir derleyici veya ağır bağımlılık gerekmez:

```bash
# 1. Depoyu klonlayın
git clone git@github.com:komutrotasi/mikat.git
cd mikat

# 2. Yerel bir HTTP sunucusu başlatın (Örn: Python veya Node)
python3 -m http.server 8080
# veya
npx serve .

# 3. Tarayıcınızda açın
http://localhost:8080
```

---

## 📁 Proje Dizin Yapısı

```text
mikat/
├── index.html            # Ana uygulama arayüzü
├── admin.html            # Yönetim ve kontrol paneli
├── app.js                # Ana uygulama mantığı ve servisler
├── styles.css            # Tasarım sistemi ve responsive stiller
├── service-worker.js     # PWA çevrimdışı önbellekleme
├── manifest.json         # PWA yükleme meta verisi
├── CNAME                 # mikat.komutrotasi.com yönlendirmesi
├── data.json             # Statik içerik ve dua/ayet derlemesi
├── data/                 # Modüler JSON veri setleri (ayet, hadis, esma)
├── css/ & js/            # Yönetim paneli bileşenleri
└── icons/ & assets/      # PWA simgeleri ve maskot görselleri
```

---

## 🌐 Canlı Yayın ve Bağlantılar

* **Canlı Uygulama:** [mikat.komutrotasi.com](https://mikat.komutrotasi.com)
* **Merkezi Portal:** [nexus.komutrotasi.com](https://nexus.komutrotasi.com)
* **Geliştirici:** [Komut Rotası](https://github.com/komutrotasi)

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında korunmaktadır.
