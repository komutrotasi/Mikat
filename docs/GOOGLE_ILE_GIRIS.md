# Google hesabıyla giriş — Mikat

## Kullanıcı akışı

1. Mikat'ı hesap açmadan kullanın veya sağ üstten **Giriş yap** bölümünü açın.
2. Google giriş düğmesi yalnızca bu eylemden sonra yüklenir. Resmî Google düğmesinden hesabınızı seçin.
3. Google hesabı bağlandığında e-posta görünür. Bu işlem Drive dosyalarını okumaz, oluşturmaz veya görevleri yüklemez.
4. Drive isterseniz ayrı **Drive eşitlemesini aç** eylemini kullanın. Drive iznini reddetmek yerel kullanımı engellemez.
5. Çıkış, cihazdaki Google görünümünü ve mevcut Drive bağlantısını kapatır. Yerel kayıtlar veya Drive kopyaları silinmez; Google hesabınızın tarayıcıdaki genel oturumu da kapatılmaz.

## İşletmecinin bir kez kontrol edeceği ayarlar

Web istemci kimliği `js/google-account.js` içinde `DEFAULT_CLIENT_ID` olarak tanımlıdır. Client ID herkese açıktır; Client Secret değildir. Google şifresi veya istemci gizli anahtarı kaynak dosyalara yazılmaz.

Google Auth Platform → Clients → ilgili **Web application** kaydı:

- Yetkili JavaScript kaynağı: `https://mikat.komutrotasi.com`.
- Kullanılacaksa yerel geliştirme kaynağı: `http://localhost:8080`.
- Kullanılacaksa workers.dev adresi ayrıca yetkili kaynak olarak tanımlanmalıdır; özel alan adı izni bunu otomatik kapsamaz.
- Marka, destek e-postası, ana sayfa ve gizlilik politikası doğru olmalıdır.
- Google Drive API yalnızca Drive özelliği için etkin olmalıdır.
- Audience/Publishing status **Testing** ise yalnızca izin verilen test kullanıcılarıyla deneme yapılmalıdır. Normal kullanıcıya açmak için Google'ın yayın ve gerekiyorsa doğrulama koşulları ayrıca tamamlanmalıdır. Kodun yayımlanması bu panel durumunu değiştirmez.

Bu değişiklikte Cloud Console ayarları okunmadı veya değiştirilmedi; mevcut istemci kimliği uygulamaya tanımlandı. Gerçek Google hesabıyla tarayıcı kabul testi kullanıcı tarafından yapılır.

## Veri akışı ve yetki sınırı

- **Giriş:** Google Identity Services resmî düğmesi bir ID token döndürür. Tarayıcı, Google'ın herkese açık JWK anahtarlarıyla RS256 imzasını, yayıncıyı, istemci kimliğini, süreyi ve girişe özgü nonce değerini kontrol eder. Kontrol tamamlanmadan hesap görünümü açılmaz.
- **Geçici hesap bilgisi:** Yalnızca istemci kimliği, Google `sub`, e-posta ve süre sonu `sessionStorage.mikat_google_account` kaydında tutulur. ID token, parola, fotoğraf ve ad kalıcı olarak saklanmaz. Süre dolduğunda yeniden giriş gerekebilir.
- **Drive:** Ayrı OAuth token akışı kullanır. `openid`, `userinfo.email` ve `drive.appdata` istenir. `sub`, Drive için seçilen hesabın girişteki hesapla aynı olduğunu denetlemek için kullanılır. Farklı hesap seçilirse eşitleme başlamaz.
- **Geriye uyumluluk:** Önceki `mikat_drive_account` ve geçerli Drive erişim belirteciyle yapılan otomatik eşitleme korunur. Yeni Google girişi, başka bir Drive hesabının etkin bağlantısını kapatır; veri silmez.
- **Kişisel Cloud projesi:** Mevcut `mikat_drive_client_id` ayarı varsa önceliklidir. Normal kullanıcı bu ayarı yapmak zorunda değildir. İstemci değişimi eski proje yedeklerini kendiliğinden taşımaz.
- **Görev içeriği:** Google giriş akışına gönderilmez. Drive ancak ayrı eylemle açılır. Var olan JSON Drive biçimine kullanıcı parolasıyla şifreleme bu değişiklikte eklenmedi; sonraki ayrı çalışmadır.

Bu yapı, sunucuda merkezi kullanıcı oturumu veya ayrı kullanıcı veritabanı oluşturmaz. Hesap görünümü yerel bir kolaylıktır; Google girişi yönetim panelinin PIN kilidini kaldırmaz. Tarayıcı depolaması kullanıcı tarafından değiştirilebilir; gelecekte sunucu üzerinde korunan işlem eklenirse kimlik belirteci sunucuda doğrulanmalı ve sunucu oturumu/yetkilendirme ayrıca tasarlanmalıdır. Mevcut tarayıcı kontrolü sunucu tarafı erişim denetiminin yerine konamaz.

Google betikleri ve oturum çerezleri Google hizmetlerinin kendi veri işleme kurallarına tabidir. Bu entegrasyon KVKK yol haritasının tamamlandığı anlamına gelmez; Google Fonts, Aladhan, şifreli Drive ve hosting incelemeleri ayrı kalır.

## Kullanıcı kabul kontrolü

- [ ] Yeni/gizli profilde Mikat hesap ve istemci ayarı sormadan açılır; görev eklenebilir.
- [ ] Sağ üstteki **Giriş yap** hamburger menüsünün karşısında kalır ve mobil ekrana sığar.
- [ ] Giriş bölümünü açınca resmî Türkçe Google düğmesi görünür; hesap seçimi çalışır.
- [ ] Yalnızca giriş yaptıktan sonra görevler Drive'a yüklenmez; Drive izni ayrıca istenir.
- [ ] Drive'ı açınca doğru hesapla eşitleme yapılabilir; farklı hesap seçimi kayıtları yüklemez.
- [ ] Google çıkışı sonrası yeni otomatik Drive isteği başlamaz; yerel görevler ve uzak yedekler durur.
- [ ] Eski Drive bağlantısı olan tarayıcıda mevcut kayıtlar kaybolmaz.
- [ ] Çevrimdışı kullanımda Google bağlantısı zorlanmaz; dosya adresinde web adresi açıklaması görünür.
- [ ] Eski PWA güncellendiğinde `mikat-v59` önbelleğiyle yeni hesap modülü yüklenir.

Kaynak ve otomatik kontroller:

```bash
node encoding-kontrol.js
node tests/google-account.test.js
node tests/drive-sync.test.js
node tests/admin-login.test.js
node tests/yayin-paketi.test.js
node scripts/uretim-paketi-olustur.js
node scripts/uretim-paketi-olustur.js --dogrula
```

## Birincil teknik kaynaklar

- [Google — Sign in with Google düğmesi](https://developers.google.com/identity/gsi/web/guides/display-button)
- [Google — ID token doğrulama ölçütleri](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [Google — JavaScript API ve nonce](https://developers.google.com/identity/gsi/web/reference/js-reference)
- [Google — OAuth token modeli ve kullanıcı eylemiyle erişim](https://developers.google.com/identity/oauth2/web/guides/use-token-model)

Tarayıcıda imza kontrolü bu projenin sunucusuz akışına yönelik uygulamasıdır; Google'ın belgelediği sunucu oturumu doğrulama örnekleriyle aynı dağıtım modeli değildir.
