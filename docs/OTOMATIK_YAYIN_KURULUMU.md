# Mikat otomatik yayın kurulumu

Mikat'ın `main` dalına gönderilen değişiklikler GitHub Actions tarafından denetlenir, paketlenir ve mevcut `mikat-komutrotasi` Cloudflare Worker'ına yüklenir. Canlı adres `https://mikat.komutrotasi.com` olarak kullanılır.

## 1. Cloudflare API token oluşturma

1. Cloudflare hesabınızda **My Profile → API Tokens → Create Token** ekranını açın. Doğrudan adres `https://dash.cloudflare.com/profile/api-tokens`.
2. **Edit Cloudflare Workers → Use template** seçeneğini kullanın. Token'a `Mikat GitHub Yayın` adını verin.
3. **Account Resources** altında Mikat Worker'ının bulunduğu hesabı seçin. Şablon **Zone Resources** isterse `komutrotasi.com` bölgesini seçin.
4. Özeti inceleyip token'ı oluşturun. Token değerini sonraki adımda GitHub Secrets alanına yapıştırın.

Cloudflare Pages'e yayın için kullanılan token'ın Worker izinleri ayrıca kontrol edilmelidir. Bu yayın akışı Worker düzenleme yetkisi kullanır.

## 2. GitHub Secrets

`https://github.com/komutrotasi/mikat/settings/secrets/actions` sayfasını açın. **New repository secret** düğmesiyle aşağıdaki iki kaydı oluşturun.

| Name | Secret |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Oluşturduğunuz Cloudflare token değeri |
| `CLOUDFLARE_ACCOUNT_ID` | Mikat Worker'ının bulunduğu Cloudflare hesabının Account ID değeri |

Account ID, Cloudflare Workers & Pages hesap ekranında bulunur. Google OAuth istemci kimliği Mikat uygulamasında kullanılan ayrı bir ayardır.

Token değerini kaynak dosyaya, commit mesajına veya sohbet mesajına yazmayın.

## 3. Yayını etkinleştirme

Aynı GitHub ekranında **Variables → New repository variable** seçeneğiyle bir kayıt oluşturun.

| Name | Value |
| --- | --- |
| `CLOUDFLARE_YAYIN_ETKIN` | `true` |

Bu değişken tanımlanmamışsa testler ve paket hazırlığı çalışır, yayın işi atlanır. Yayını duraklatmak için değeri `false` yapabilirsiniz.

## 4. Yerel kontrol ve ilk gönderim

Terminalde Mikat klasöründe çalıştırın.

```bash
node encoding-kontrol.js
node tests/drive-sync.test.js
node tests/yayin-paketi.test.js
node scripts/uretim-paketi-olustur.js
```

Değişiklikleri `git diff` ve `git status` ile inceleyin. İlk kurulumda aşağıdaki yolları commit'e ekleyin.

```bash
git add .gitignore .htaccess README.md app.js index.html styles.css service-worker.js
git add encoding-kontrol.js js/drive-sync.js tests scripts docs wrangler.jsonc .github/workflows/cloudflare-yayin.yml
git diff --cached --stat
git commit -m "Mikat Drive eşitlemesi ve otomatik Worker yayını"
git push origin main
```

Sonraki güncellemelerde değiştirdiğiniz dosyaları ekleyip commit ve push yapmanız yeterlidir. PR kullanıyorsanız hedefi `main` seçin. Testler başarılı olduğunda PR'ı `main` dalına birleştirin.

## 5. GitHub'da yayını izleme

1. `https://github.com/komutrotasi/mikat/actions` ekranında **Mikat kontrolleri ve canlı yayın** koşumunu açın.
2. **Testler ve üretim paketi** işinin başarılı olduğunu kontrol edin.
3. **Doğrulanmış main paketini yayımla** işinde Worker yüklemesi ve canlı doğrulamanın tamamlandığını kontrol edin.
4. `https://mikat.komutrotasi.com` sayfasını yenileyin. Mikat'ın Drive düğmesinden aynı Google hesabına bağlanın. Google Cloud istemcisinde canlı sitenin origin'i yetkili olmalıdır.

Elle tekrar yayın için **Actions → Mikat kontrolleri ve canlı yayın → Run workflow → Branch main → Run workflow** yolunu izleyin. Düğme workflow dosyası GitHub'ın varsayılan dalına ulaştıktan sonra görünür.

## Paket ve yayın davranışı

- İş akışı Node.js 22 ve Wrangler 4.158.0 kullanır.
- `scripts/uretim-paketi-olustur.js`, açık izin listesindeki uygulama dosyalarını `dist/site` klasörüne kopyalar. Kaynak `.git`, yerel `.wrangler`, test ve belge dosyaları yayın paketine alınmaz.
- `dist/manifest.json` kaynak commit'i ve paket dosyalarının SHA-256 özetlerini içerir. Paket indirilince kaynak dosyalarla yeniden karşılaştırılır.
- Cloudflare güvenlik başlıkları paket içindeki `_headers` dosyasına üretilir. Ana sayfanın CSP'si, Google açılır penceresi desteği ve service worker yeniden doğrulama başlığı uygulanır.
- Yayınlar sırayla çalışır. Yükleme öncesinde commit'in güncel `main` olduğu kontrol edilir.
- `wrangler.jsonc` mevcut `mikat-komutrotasi` Worker'ını ve `mikat.komutrotasi.com` özel alan adını hedefler. Cloudflare'da doğrulanan mevcut `workers.dev` uç noktası da etkindir. Canlı kontrol özel alan adını kullanır.
- Canlı kontrol, tarayıcı açmadan HTTP üzerinden uygulama dosyalarını paketle karşılaştırır. Tarayıcı kabul testi kullanıcı tarafından yapılır.

## Bir adım başarısız olursa

- **Test veya paket hatası** için kırmızı adımı açıp hata mesajındaki dosyayı düzeltin.
- **Yayın işi skipped** durumundaysa `main` dalını ve `CLOUDFLARE_YAYIN_ETKIN=true` değişkenini kontrol edin.
- **Secret eksik veya Cloudflare 403** hatası için Mikat deposundaki Secrets adlarını, Account ID ve token'ın Worker izinlerini kontrol edin.
- **Kaynak commit güncel değil** hatasında yeni commit'e ait koşumu izleyin.
- **Canlı kontrol hatası** yüklemeden sonra ortaya çıkabilir. Cloudflare Worker'ın alan adı, erişim kuralları ve canlı dosyalarını kontrol edin. Geri dönüş gerekirse Cloudflare'da **Workers & Pages → mikat-komutrotasi → Deployments** ekranından önceki başarılı sürümü seçip **Rollback** işlemini uygulayın. Kod düzeltmesini GitHub'a da gönderin.

## Kaynaklar

- [Cloudflare Workers ve GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Statik dosya yapılandırması](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Worker statik dosya başlıkları](https://developers.cloudflare.com/workers/static-assets/headers/)
