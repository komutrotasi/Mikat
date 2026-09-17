# Mikat Projesi Agent Kuralları

Bu dizinde (`mikat`) çalışacak yapay zeka ajanları aşağıdaki kurallara harfiyen uymak zorundadır.

## 1. Proje Bağlamı ve Sınırları
- Aktif odak alanı sadece `mikat` klasörüdür. Kullanıcı açık onay vermedikçe başka hiçbir projeye (örn: python, seyir) geçiş yapılamaz (Zero Cross-Project Leakage kuralı).
- Tema CSS değişkeni: `mikatTheme`.
- LocalStorage Anahtarı: Kayıtlar daima `mikat` anahtarı baz alınarak yapılır. Diğer projelere ait verilerle çakışmaması esastır.
- İçerik Dili ve Encoding: Proje her zaman Türkçe'dir. Türkçe karakterlerin (ç, ğ, ı, ö, ş, ü) bozulmamasına en üst düzeyde dikkat edilmelidir (BOM'suz UTF-8).

## 2. Arayüz ve Tasarım Kuralları
- Ortak Arayüz: Masaüstü ve Mobil Header/Drawer mimarisinde Komut Rotası ortak UI kuralları (Logonun yanında kalın font, slogan, hamburger menü, sağ aksiyon butonları vb.) geçerlidir.

## 3. Kodlama ve Temizlik Standartları
- Yapılacak her kalıcı değişiklik sonrası projenin genel yapısında mutlaka ana dizindeki `node encoding-kontrol.js` (Güvenlik Kapısı) testinden geçilmesi zorunludur.
- Tarayıcı bazlı manuel testler Agent tarafından yapılmaz, görev tamamlandığında test işlemi kullanıcıya devredilir.
