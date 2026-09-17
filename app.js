
'use strict';

// Safe NexusAuth Fallback
if (typeof window.NexusAuth === 'undefined') {
  
// Safe Global Logout Fallback
function logout(redirectUrl) {
  if (window.NexusAuth && typeof window.NexusAuth.logout === 'function') {
    window.NexusAuth.logout(redirectUrl);
  } else {
    try {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
    } catch (e) {}
    window.location.href = redirectUrl || '../login.html';
  }
}
window.logout = logout;

window.NexusAuth = {
    logout: function(redirectUrl) {
      try {
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
      } catch (e) {}
      window.location.href = redirectUrl || '../login.html';
    },
    requireAuth: function() {}
  };
}

/* ── RENK PALETİ ── */
const COLOR_PALETTE = [
  { hex: '#e8b84b', bg: 'rgba(232,184,75,.12)' },
  { hex: '#fb923c', bg: 'rgba(251,146,60,.12)' },
  { hex: '#3ecfb0', bg: 'rgba(62,207,176,.12)' },
  { hex: '#5b9cf6', bg: 'rgba(91,156,246,.12)' },
  { hex: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  { hex: '#f06878', bg: 'rgba(240,104,120,.12)' },
  { hex: '#4ade80', bg: 'rgba(74,222,128,.12)' },
  { hex: '#f472b6', bg: 'rgba(244,114,182,.12)' },
  { hex: '#38bdf8', bg: 'rgba(56,189,248,.12)' },
  { hex: '#a3e635', bg: 'rgba(163,230,53,.12)' },
  { hex: '#e879f9', bg: 'rgba(232,121,249,.12)' },
  { hex: '#9aa0b8', bg: 'rgba(154,160,184,.12)' },
];

/* ── VARSAYILAN KATEGORİLER ── */
const DEFAULT_CATS = {
  dini: { l: 'Dini Görevler', i: '🤲', c: '#e8b84b', bg: 'rgba(232,184,75,.12)' },
  kuran: { l: 'Kuran & Zikir', i: '📖', c: '#fb923c', bg: 'rgba(251,146,60,.12)' },
  is: { l: 'İş & Projeler', i: '💼', c: '#3ecfb0', bg: 'rgba(62,207,176,.12)' },
  okul: { l: 'Öğretmenlik', i: '🎓', c: '#5b9cf6', bg: 'rgba(91,156,246,.12)' },
  aile: { l: 'Aile', i: '❤️', c: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  kitap: { l: 'Kitap & Gelişim', i: '📚', c: '#f06878', bg: 'rgba(240,104,120,.12)' },
  diger: { l: 'Diğer', i: '📌', c: '#9aa0b8', bg: 'rgba(154,160,184,.12)' },
};

/* ── VARSAYILAN ALIŞKANLIKLAR (BAŞLANGIÇTA BOŞ) ── */
const DEFAULT_HABITS = [];

/* ── ZİKİR LİSTESİ ── */
let DAILY_ZIKIR = [
  {
    ar: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
    t: "Estağfirullâhel Azîm",
    n: "100 defa",
    m: "Yüce Allah'tan bağışlanma dilerim."
  },
  {
    ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    t: "Sübhânallâhi ve bihamdihî sübhânallâhil azîm",
    n: "100 defa",
    m: "Allah'ı hamd ile tesbih ederim, Yüce Allah'ı noksan sıfatlardan tenzih ederim."
  },
  {
    ar: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    t: "Lâ ilâhe illallâh",
    n: "100 defa",
    m: "Allah'tan başka ilah yoktur."
  },
  {
    ar: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    t: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr",
    n: "100 defa",
    m: "Allah'tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye gücü yetendir."
  },
  {
    ar: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ",
    t: "Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed",
    n: "100 defa",
    m: "Allah'ım! Efendimiz Muhammed'e ve efendimiz Muhammed'in ailesine salât ve selâm eyle."
  }
];

/* ── GÜNLÜK İÇERİK (data/*.json'dan yüklenir, yüklenene kadar fallback) ── */
let DAILY_AYATS = [
  { t: "Rabbin, kendisinden başkasına kulluk etmemenizi ve anne babaya iyilik etmenizi emretti.", s: "İsrâ 17/23" },
  { t: "Şüphesiz her güçlükle beraber bir kolaylık vardır. Gerçekten, her güçlükle beraber bir kolaylık vardır.", s: "İnşirâh 94/5-6" },
  { t: "Allah, hiç kimseye gücünün üstünde bir yük yüklemez. Herkesin kazandığı iyilik kendi yararınadır.", s: "Bakara 2/286" },
  { t: "Ey iman edenler! Sabır ve namazla yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.", s: "Bakara 2/153" },
  { t: "Beni anın ki ben de sizi anayım. Bana şükredin, nankörlük etmeyin.", s: "Bakara 2/152" },
  { t: "Biliniz ki kalpler ancak Allah'ı anmakla huzur bulur.", s: "Ra'd 13/28" },
  { t: "Şüphesiz namaz, müminler üzerine belirli vakitlerde yazılmış bir farzdır.", s: "Nisâ 4/103" },
  { t: "De ki: Eğer Allah'ı seviyorsanız bana uyun ki Allah da sizi sevsin ve günahlarınızı bağışlasın.", s: "Âl-i İmrân 3/31" },
  { t: "İnsan için ancak çalıştığının karşılığı vardır ve çalıştığı ileride mutlaka görülecektir.", s: "Necm 53/39-40" },
  { t: "Kullarıma söyle, en güzel sözü söylesinler. Çünkü şeytan aralarını bozmak ister.", s: "İsrâ 17/53" }
];

/* ── ZİKİR İLE İLGİLİ KUTSAL AYETLER ── */
const ZIKIR_AYATS = [
  {
    ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا",
    tr: "Ahzâb 33/41",
    m: "Ey iman edenler! Allah'ı çokça zikredin."
  },
  {
    ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    tr: "Ra'd 13/28",
    m: "Biliniz ki kalpler ancak Allah'ı anmakla huzur bulur."
  },
  {
    ar: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    tr: "Bakara 2/152",
    m: "Beni anın ki ben de sizi anayım. Bana şükredin, nankörlük etmeyin."
  },
  {
    ar: "الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ",
    tr: "Âl-i İmrân 3/191",
    m: "Onlar ayaktayken, otururken ve yanları üzerine yatarken Allah'ı anarlar."
  },
  {
    ar: "وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ",
    tr: "Cuma 62/10",
    m: "Allah'ı çokça zikredin ki kurtuluşa eresiniz."
  },
  {
    ar: "وَاذْكُرْ رَبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً",
    tr: "A'râf 7/205",
    m: "Rabbini içinden, alçak gönüllülükle ve derin bir saygıyla an."
  },
  {
    ar: "فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ",
    tr: "Nisâ 4/103",
    m: "Namazı kıldıktan sonra; ayaktayken, otururken ve yanlarınız üzerindeyken Allah'ı zikredin."
  }
];
let DAILY_HADITHS = [
  { t: "Merhamet etmeyene merhamet olunmaz. İnsanlara merhamet etmeyene Allah da merhamet etmez.", s: "Buhârî, Edeb, 18" },
  { t: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.", s: "Buhârî, Cihâd, 164" },
  { t: "Sizin en hayırlınız, ahlakı en güzel olanınızdır.", s: "Buhârî, Edeb, 38" },
  { t: "Müslüman, elinden ve dilinden diğer Müslümanların emniyette olduğu kimsedir.", s: "Buhârî, Îmân, 4" },
  { t: "İki nimet vardır ki insanların çoğu onların kıymetini bilmekte aldanmıştır: Sağlık ve boş vakit.", s: "Buhârî, Rikâk, 1" },
  { t: "Hiçbiriniz kendi nefsi için istediğini mümin kardeşi için de istemedikçe gerçek manada iman etmiş olamaz.", s: "Buhârî, Îmân, 7" },
  { t: "Güzel söz sadakadır. Camiye gitmek için atılan her adım sadakadır.", s: "Buhârî, Cihâd, 128" },
  { t: "Komşusu açken tok yatan bizden değildir.", s: "Hâkim, el-Müstedrek, 2166" },
  { t: "Ameller ancak niyetlere göredir. Herkes için ancak niyet ettiğinin karşılığı vardır.", s: "Buhârî, Bed'ü'l-Vahy, 1" },
  { t: "Veren el, alan elden üstündür. Harcamaya kendi bakmakla yükümlü olduğun kimselerden başla.", s: "Buhârî, Zekât, 18" }
];
let DAILY_DUAS = [
  { t: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi cehennem azabından koru.", s: "Bakara 2/201" },
  { t: "Rabbim! Göğsümü genişlet, işimi kolaylaştır, dilimdeki bağı çöz ki sözümü anlasınlar.", s: "Tâhâ 20/25-28" },
  { t: "Rabbim! Beni ve neslimi namazı devamlı kılanlardan eyle. Rabbimiz, duamı kabul buyur.", s: "İbrâhîm 14/40" },
  { t: "Rabbimiz! Hesap görüleceği gün beni, anne babamı ve bütün müminleri bağışla.", s: "İbrâhîm 14/41" },
  { t: "Rabbimiz! Üzerimize sabır yağdır, adımlarımızı sağlamlaştır ve kafirler topluluğuna karşı bize yardım et.", s: "Bakara 2/250" },
  { t: "Allah'ım! Senden hidayet, takva, iffet ve gönül zenginliği istiyorum.", s: "Müslim, Zikir, 72" },
  { t: "Rabbim! İlmimi artır ve beni salih kimselerin arasına kat.", s: "Şuarâ 26/83" },
  { t: "Allah'ım! Faydasız ilimden, korkmayan kalpten, doymayan nefisten ve kabul olunmayan duadan Sana sığınırım.", s: "Müslim, Zikir, 73" },
  { t: "Rabbimiz! Kalplerimizi doğru yola ilettikten sonra saptırma, bize katından bir rahmet bağışla.", s: "Âl-i İmrân 3/8" }
];
let ESMA_LIST = [
  { ar: "الرَّحْمَنُ", tr: "Er-Rahmân", m: "Dünyada tüm yaratıklara sonsuz rahmet eden." },
  { ar: "الرَّحِيمُ", tr: "Er-Rahîm", m: "Ahirette müminlere özel merhamet eden." },
  { ar: "الْمَلِكُ", tr: "El-Melik", m: "Gerçek hükümdar, mutlak otorite sahibi." },
  { ar: "الْقُدُّوسُ", tr: "El-Kuddûs", m: "Her türlü noksanlıktan münezzeh, en pak olan." },
  { ar: "السَّلَامُ", tr: "Es-Selâm", m: "Esenlik kaynağı, kusursuz barış veren." },
  { ar: "الْمُؤْمِنُ", tr: "El-Mü'min", m: "İman veren, güven ve emniyet bahşeden." },
  { ar: "الْمُهَيْمِنُ", tr: "El-Müheymin", m: "Her şeye hâkim olan, gözetip koruyan." },
  { ar: "الْعَزِيزُ", tr: "El-Azîz", m: "Benzersiz güç ve yenilmez üstünlük sahibi." },
  { ar: "الْجَبَّارُ", tr: "El-Cebbâr", m: "Zulme uğrayanları haklarına kavuşturan." },
  { ar: "الْمُتَكَبِّرُ", tr: "El-Mütekebbir", m: "Sınırsız büyüklük ve yücelik sahibi." },
  { ar: "الْخَالِقُ", tr: "El-Hâlık", m: "Yoktan her şeyi yaratan, var eden." },
  { ar: "الْبَارِئُ", tr: "El-Bâri'", m: "Yarattıklarını birbirinden ayırıp düzenleyen." },
  { ar: "الْمُصَوِّرُ", tr: "El-Musavvir", m: "Varlıklara biçim ve şekil veren." },
  { ar: "الْغَفَّارُ", tr: "El-Ğaffâr", m: "Günahları tekrar tekrar bağışlayan." },
  { ar: "الْقَهَّارُ", tr: "El-Kahhâr", m: "Her şeye üstün gelen, her şeyi emri altında tutan." },
  { ar: "الْوَهَّابُ", tr: "El-Vehhâb", m: "Karşılıksız ve sürekli bağışlayan, ihsan eden." },
  { ar: "الرَّزَّاقُ", tr: "Er-Razzâk", m: "Tüm varlıkların rızkını veren." },
  { ar: "الْفَتَّاحُ", tr: "El-Fettâh", m: "Her güçlüğü açan, her sorunun çözümünü veren." },
  { ar: "الْعَلِيمُ", tr: "El-Alîm", m: "Her şeyi en ince ayrıntısına kadar bilen." },
  { ar: "الْقَابِضُ", tr: "El-Kâbız", m: "Rızkı daraltan, dilediğinden alan." },
  { ar: "الْبَاسِطُ", tr: "El-Bâsıt", m: "Rızkı genişleten, dilediğine bol veren." },
  { ar: "الْخَافِضُ", tr: "El-Hâfız", m: "Zalimleri ve kâfirleri alçaltan." },
  { ar: "الرَّافِعُ", tr: "Er-Râfi'", m: "Müminleri ve evliyasını yükselten." },
  { ar: "الْمُعِزُّ", tr: "El-Muizz", m: "Dilediğine izzet ve şeref veren." },
  { ar: "الْمُذِلُّ", tr: "El-Müzill", m: "Dilediğini zillete düşüren." },
  { ar: "السَّمِيعُ", tr: "Es-Semî'", m: "Her sesi ve duayı işiten." },
  { ar: "الْبَصِيرُ", tr: "El-Basîr", m: "Her şeyi gören, gizlisini ve aşikâresini bilen." },
  { ar: "الْحَكَمُ", tr: "El-Hakem", m: "En adil hüküm veren, hakkın ta kendisi." },
  { ar: "الْعَدْلُ", tr: "El-Adl", m: "Mutlak adalet sahibi, asla haksızlık etmeyen." },
  { ar: "اللَّطِيفُ", tr: "El-Latîf", m: "En ince sırları bilen, lütufkâr davranan." },
  { ar: "الْخَبِيرُ", tr: "El-Habîr", m: "Her şeyin iç yüzünden haberdar olan." },
  { ar: "الْحَلِيمُ", tr: "El-Halîm", m: "Çok sabırlı, acele etmeden ceza vermeyen." },
  { ar: "الْعَظِيمُ", tr: "El-Azîm", m: "Sınırsız büyüklük sahibi." },
  { ar: "الْغَفُورُ", tr: "El-Ğafûr", m: "Günahları çokça ve tam olarak bağışlayan." },
  { ar: "الشَّكُورُ", tr: "Eş-Şekûr", m: "Az ameli çok değerlendiren, mükâfatlandıran." },
  { ar: "الْعَلِيُّ", tr: "El-Aliyy", m: "En yüce, pek yüksek olan." },
  { ar: "الْكَبِيرُ", tr: "El-Kebîr", m: "Büyüklükte sınır tanımayan." },
  { ar: "الْحَفِيظُ", tr: "El-Hafîz", m: "Her şeyi koruyup muhafaza eden." },
  { ar: "الْمُقِيتُ", tr: "El-Mukît", m: "Her varlığa gücünü ve kuvvetini veren." },
  { ar: "الْحَسِيبُ", tr: "El-Hasîb", m: "Her şeyin hesabını gören, yetip artan." },
  { ar: "الْجَلِيلُ", tr: "El-Celîl", m: "Ulu ve sonsuz ihtişam sahibi." },
  { ar: "الْكَرِيمُ", tr: "El-Kerîm", m: "Sonsuz cömert, ikram sahibi." },
  { ar: "الرَّقِيبُ", tr: "Er-Rakîb", m: "Her şeyi gözetip takip eden." },
  { ar: "الْمُجِيبُ", tr: "El-Mücîb", m: "Duaları kabul eden, çağrıya cevap veren." },
  { ar: "الْوَاسِعُ", tr: "El-Vâsi'", m: "Rahmeti ve ilmi her şeyi kuşatan." },
  { ar: "الْحَكِيمُ", tr: "El-Hakîm", m: "En derin hikmet sahibi, her işi yerli yerinde." },
  { ar: "الْوَدُودُ", tr: "El-Vedûd", m: "Kullarını seven, sevilmeye layık." },
  { ar: "الْمَجِيدُ", tr: "El-Mecîd", m: "Yüce şeref ve sonsuz kerem sahibi." },
  { ar: "الْبَاعِثُ", tr: "El-Bâis", m: "Ölüleri dirilten, peygamberler gönderen." },
  { ar: "الشَّهِيدُ", tr: "Eş-Şehîd", m: "Her zaman ve her yerde hâzır ve nâzır." },
  { ar: "الْحَقُّ", tr: "El-Hak", m: "Varlığı zorunlu olan gerçek, değişmeyen." },
  { ar: "الْوَكِيلُ", tr: "El-Vekîl", m: "Her şeyin vekilliğini üstlenen, güvenilir." },
  { ar: "الْقَوِيُّ", tr: "El-Kaviyy", m: "Sonsuz güç ve kuvvet sahibi." },
  { ar: "الْمَتِينُ", tr: "El-Metîn", m: "Sağlamlıkta ve güçte rakipsiz." },
  { ar: "الْوَلِيُّ", tr: "El-Veliyy", m: "Müminlerin dostu ve yardımcısı." },
  { ar: "الْحَمِيدُ", tr: "El-Hamîd", m: "Her türlü övgü ve hamd'e layık olan." },
  { ar: "الْمُحْصِي", tr: "El-Muhsî", m: "Her şeyi sayıp kaydeden." },
  { ar: "الْمُبْدِئُ", tr: "El-Mübdi'", m: "Yaratmaya başlayan, ilk var eden." },
  { ar: "الْمُعِيدُ", tr: "El-Muîd", m: "Yok olanı yeniden var eden." },
  { ar: "الْمُحْيِي", tr: "El-Muhyî", m: "Hayat veren, canlılık bağışlayan." },
  { ar: "الْمُمِيتُ", tr: "El-Mümît", m: "Ölümü yaratan, her canlıyı öldüren." },
  { ar: "الْحَيُّ", tr: "El-Hayy", m: "Ebedî hayat sahibi, her zaman diri." },
  { ar: "الْقَيُّومُ", tr: "El-Kayyûm", m: "Kendi kendine var olan, her şeyi ayakta tutan." },
  { ar: "الْوَاجِدُ", tr: "El-Vâcid", m: "Her şeyi bulan, hiçbir şey kendisine gizli kalmayan." },
  { ar: "الْمَاجِدُ", tr: "El-Mâcid", m: "Şeref ve büyüklük sahibi." },
  { ar: "الْوَاحِدُ", tr: "El-Vâhid", m: "Tek olan, ortağı ve benzeri bulunmayan." },
  { ar: "الأَحَدُ", tr: "El-Ehad", m: "Mutlak birlik sahibi, bölünmez." },
  { ar: "الصَّمَدُ", tr: "Es-Samed", m: "Her şey ona muhtaç, o hiçbir şeye muhtaç değil." },
  { ar: "الْقَادِرُ", tr: "El-Kâdir", m: "Her şeye güç yetiren, sonsuz kudret sahibi." },
  { ar: "الْمُقْتَدِرُ", tr: "El-Muktedir", m: "Dilediği her şeyi yapmaya muktedir." },
  { ar: "الْمُقَدِّمُ", tr: "El-Mukaddim", m: "Dilediğini öne geçiren, yükselten." },
  { ar: "الْمُؤَخِّرُ", tr: "El-Muahhir", m: "Dilediğini geri bırakan, geciktiren." },
  { ar: "الأَوَّلُ", tr: "El-Evvel", m: "Başlangıcı olmayan, her şeyden önce var olan." },
  { ar: "الآخِرُ", tr: "El-Âhir", m: "Sonu olmayan, her şeyden sonra da var olan." },
  { ar: "الظَّاهِرُ", tr: "Ez-Zâhir", m: "Varlığının delilleri her yerde açıkça görünen." },
  { ar: "الْبَاطِنُ", tr: "El-Bâtın", m: "Akılların kavrayamayacağı kadar gizli olan." },
  { ar: "الْوَالِي", tr: "El-Vâlî", m: "Tüm evreni yöneten ve idare eden." },
  { ar: "الْمُتَعَالِي", tr: "El-Müteâlî", m: "Sıfatlarıyla her şeyin üzerinde yükselen." },
  { ar: "الْبَرُّ", tr: "El-Berr", m: "İyilik ve lütuf kaynağı." },
  { ar: "التَّوَّابُ", tr: "Et-Tevvâb", m: "Tövbeleri kabul eden, dönüşü kolaylaştıran." },
  { ar: "الْمُنْتَقِمُ", tr: "El-Müntakim", m: "Haksızlıkları cezalandıran." },
  { ar: "الْعَفُوُّ", tr: "El-Afüvv", m: "Günahları affeden, silen." },
  { ar: "الرَّؤُوفُ", tr: "Er-Raûf", m: "Çok şefkatli, yumuşak davranan." },
  { ar: "مَالِكُ الْمُلْكِ", tr: "Mâlikü'l-Mülk", m: "Mülkün ve hükümranlığın gerçek sahibi." },
  { ar: "ذُو الْجَلَالِ وَالإِكْرَامِ", tr: "Zü'l-Celâl", m: "Büyüklük ve ikram sahibi." },
  { ar: "الْمُقْسِطُ", tr: "El-Muksît", m: "Adaletli davranan, hakkaniyetle hükmeden." },
  { ar: "الْجَامِعُ", tr: "El-Câmi'", m: "Her şeyi bir araya getiren, toplayan." },
  { ar: "الْغَنِيُّ", tr: "El-Ğaniyy", m: "Hiçbir şeye muhtaç olmayan, zenginliği sonsuz." },
  { ar: "الْمُغْنِي", tr: "El-Muğnî", m: "Zenginlik ve yeterlilik veren." },
  { ar: "الْمَانِعُ", tr: "El-Mâni'", m: "Dilediğini engelleyen, zarar dokundurmayan." },
  { ar: "الضَّارُّ", tr: "Ed-Dârr", m: "Hikmeti gereği zarar verebilen." },
  { ar: "النَّافِعُ", tr: "En-Nâfi'", m: "Fayda veren, yararlı kılan." },
  { ar: "النُّورُ", tr: "En-Nûr", m: "Gökleri ve yeri nurlandıran." },
  { ar: "الْهَادِي", tr: "El-Hâdî", m: "Doğru yolu gösteren, hidayet eden." },
  { ar: "الْبَدِيعُ", tr: "El-Bedî'", m: "Eşsiz ve benzersiz biçimde yaratan." },
  { ar: "الْبَاقِي", tr: "El-Bâkî", m: "Ebedî olarak var olan, yok olmayan." },
  { ar: "الْوَارِثُ", tr: "El-Vâris", m: "Her şeyin gerçek varisi, sonunda her şey ona döner." },
  { ar: "الرَّشِيدُ", tr: "Er-Reşîd", m: "Doğru yolu gösteren, işleri en güzel şekilde yürüten." },
  { ar: "الصَّبُورُ", tr: "Es-Sabûr", m: "Son derece sabırlı, acele etmeden muamele eden." }
];

/* ── NAMAZ VAKİTLERİ (varsayılan — API yoksa) ── */
let PRAYERS = [
  { n: 'Sabah', t: '05:30', h: 5 },
  { n: 'Öğle', t: '12:15', h: 12 },
  { n: 'İkindi', t: '15:30', h: 15 },
  { n: 'Akşam', t: '18:45', h: 18 },
  { n: 'Yatsı', t: '20:15', h: 20 },
];

/* ── DURUM ── */
let CATS = { ...DEFAULT_CATS };
let HABITS = [...DEFAULT_HABITS];

let SUNRISE_TIME = null;
let IMSAK_TIME = null;
let AUTH_USER = null;

let S = {
  tasks: [], prayers: {}, habits: {}, zikirDone: {}, nafile: {}, qada: {},
  catTime: {}, timerSess: {}, theme: 'light',
  cats: null, habitDefs: null, lastReset: '',
  notifEnabled: false, namazCity: 'Konya',
  autoBackup: false, lastBackup: '',
  lat: null, lng: null,
  userName: '',
  mascotReminderInterval: 10,
};

const NAMAZ_DAILY_AYATS = [
  {
    ar: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ",
    t: "Namazlara ve orta namaza devam edin. Allah'a saygı ve bağlılık içinde namaz kılın.",
    s: "Bakara 2/238"
  },
  {
    ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    t: "Namazı kılın, zekatı verin ve rüku edenlerle birlikte rüku edin.",
    s: "Bakara 2/43"
  },
  {
    ar: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    t: "Şüphesiz namaz, müminler üzerine belirli vakitlerde yazılmış bir farzdır.",
    s: "Nisâ 4/103"
  },
  {
    ar: "وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِنَ اللَّيْلِ",
    t: "Gecenin iki tarafında ve gündüzün saçaklarında namaz kıl.",
    s: "Hûd 11/114"
  },
  {
    ar: "وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا",
    t: "Güneşin doğmasından önce ve batmasından önce Rabbini hamd ile tesbih et.",
    s: "Tâhâ 20/130"
  },
  {
    ar: "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ",
    t: "Güneşin batıya yönelmesinden gecenin karanlığına kadar namaz kıl. Sabah kuranını da unutma.",
    s: "İsrâ 17/78"
  },
  {
    ar: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    t: "Sabır ve namazla Allah'tan yardım isteyin. Şüphesiz bu, huşu duyanlardan başkasına ağır gelir.",
    s: "Bakara 2/45"
  },
  {
    ar: "اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ",
    t: "Kitaptan sana vahyedileni oku ve namazı kıl. Şüphesiz namaz, kötülüklerden ve hayâsızlıktan alıkoyar.",
    s: "Ankebût 29/45"
  },
  {
    ar: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    t: "Müminler kesinlikle kurtuluşa ermişlerdir; onlar ki namazlarında huşu içindedirler.",
    s: "Mü'minûn 23/1-2"
  },
  {
    ar: "وَالَّذِينَ هُمْ عَلَىٰ صَلَوَاتِهِمْ يُحَافِظُونَ أُولَٰئِكَ هُمْ الْوَارِثُونَ",
    t: "Onlar ki namazlarını titizlikle korurlar. İşte varis olacaklar onlardır.",
    s: "Mü'minûn 23/9-10"
  }
];

let editId = null, tmpSubs = [], activeCat = null, statusF = 'all';
let editCatKey = null, selectedColor = COLOR_PALETTE[0];
let selectedDate = today();
let _habitEditIdx = null;
const expandedTasks = new Set();

/* ── YARDIMCI ── */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function gid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function dOff(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dayOfYear() {
  const n = new Date(), s = new Date(n.getFullYear(), 0, 0);
  return Math.floor((n - s) / 86400000);
}
function initDailyQuotes() {
  const filteredAyats = (DAILY_AYATS || []).filter(a => a && a.t && a.t.trim().length >= 18);
  const filteredHadiths = (DAILY_HADITHS || []).filter(h => h && h.t && h.t.trim().length >= 18);
  const filteredDuas = (DAILY_DUAS || []).filter(d => d && d.t && d.t.trim().length >= 18);

  const ayatList = filteredAyats.length ? filteredAyats : DAILY_AYATS;
  const hadisList = filteredHadiths.length ? filteredHadiths : DAILY_HADITHS;
  const duaList = filteredDuas.length ? filteredDuas : DAILY_DUAS;

  // Her açılışta / sayfada rastgele ve farklı gelsin
  const rAyat = Math.floor(Math.random() * ayatList.length);
  const rHadis = Math.floor(Math.random() * hadisList.length);
  const rDua = Math.floor(Math.random() * duaList.length);

  const ayat = ayatList[rAyat];
  const hadis = hadisList[rHadis];
  const dua = duaList[rDua];

  const ayatText = document.getElementById('dailyAyatText');
  const ayatArabic = document.getElementById('dailyAyatArabic');
  const ayatSrc = document.getElementById('dailyAyatSrc');
  const hadisText = document.getElementById('dailyHadisText');
  const hadisSrc = document.getElementById('dailyHadisSrc');
  const duaText = document.getElementById('dailyDuaText');
  const duaSrc = document.getElementById('dailyDuaSrc');

  if (ayatText && ayatSrc && ayat) {
    if (ayatArabic) ayatArabic.textContent = ayat.ar || '';
    ayatText.textContent = ayat.t || '';
    ayatSrc.textContent = ayat.s || '';
  }
  if (hadisText && hadisSrc && hadis) {
    hadisText.textContent = hadis.t || '';
    hadisSrc.textContent = hadis.s || '';
  }
  if (duaText && duaSrc && dua) {
    duaText.textContent = dua.t || '';
    duaSrc.textContent = dua.s || '';
  }
  renderEsma();
  renderDailyZikir();
}
function parseYmd(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s || '') ? new Date(s + 'T00:00:00') : null;
}
function diffDays(a, b) {
  return Math.floor((b - a) / 86400000);
}
function isRepeatDueOn(t, dayStr) {
  const d = parseYmd(dayStr);
  if (!d) return false;
  const dow = d.getDay();
  const dom = d.getDate();
  const rep = t.rep;
  if (rep === 'gunluk') return true;
  if (rep === 'haftalik') {
    const days = Array.isArray(t.repDays) && t.repDays.length ? t.repDays : [1];
    return days.includes(dow);
  }
  if (rep === 'aylik') {
    const days = Array.isArray(t.repDays) && t.repDays.length ? t.repDays : [1];
    return days.includes(dom);
  }
  if (rep === 'ay_son') {
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return dom === last;
  }
  if (rep === 'her_2_gunde' || rep === 'ozel') {
    const interval = rep === 'her_2_gunde' ? 2 : (Number.isInteger(t.repInterval) && t.repInterval > 1 ? t.repInterval : 2);
    const start = parseYmd(t.due) || parseYmd(t.created) || parseYmd(today());
    if (!start) return false;
    const diff = diffDays(start, d);
    if (diff < 0 || diff % interval !== 0) return false;
    if (rep === 'ozel' && t.repEnd) {
      const end = parseYmd(t.repEnd);
      if (end && d > end) return false;
    }
    return true;
  }
  return false;
}
function fmtSec(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}sa ${m}dk` : `${m}dk`;
}

/* ── XSS KORUMALARI ── */
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function safeText(s, max = 500) {
  return String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}
function safeKey(k) {
  return String(k ?? '').toLowerCase().replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '').slice(0, 32) || ('cat_' + gid());
}
function safeColor(v, fallback = '#9aa0b8') {
  v = String(v ?? '').trim();
  if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v)) return v;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*(0|1|0?\.\d+))?\s*\)$/.test(v)) return v;
  if (/^var\(--[a-zA-Z0-9_-]+\)$/.test(v)) return v;
  return fallback;
}

/* ── NORMALİZASYON ── */
function normalizeCats(src) {
  const out = {};
  const base = (src && typeof src === 'object' && !Array.isArray(src)) ? src : DEFAULT_CATS;
  Object.entries(base).slice(0, 80).forEach(([rawKey, raw]) => {
    const key = safeKey(rawKey);
    const c = (raw && typeof raw === 'object') ? raw : {};
    const color = safeColor(c.c, '#9aa0b8');
    out[key] = {
      l: safeText(c.l || 'Kategori', 60),
      i: safeText(c.i || '📌', 8),
      c: color,
      bg: safeColor(c.bg, color + '20'),
    };
  });
  return Object.keys(out).length ? out : JSON.parse(JSON.stringify(DEFAULT_CATS));
}
function normalizeHabits(src) {
  const arr = Array.isArray(src) ? src : DEFAULT_HABITS;
  const seen = new Set();
  return arr.slice(0, 50).map((h, i) => {
    const raw = (h && typeof h === 'object') ? h : {};
    let id = safeKey(raw.id || ('h_' + i));
    while (seen.has(id)) id = 'h_' + gid();
    seen.add(id);
    return { id, l: safeText(raw.l || 'Alışkanlık', 80) };
  });
}
function sanitizeTask(t) {
  const firstCat = Object.keys(CATS)[0] || 'diger';
  const raw = (t && typeof t === 'object') ? t : {};
  return {
    id: safeText(raw.id || gid(), 40),
    name: safeText(raw.name || 'Adsız görev', 300),
    cat: CATS[raw.cat] ? raw.cat : firstCat,
    pri: ['yuksek', 'orta', 'dusuk'].includes(raw.pri) ? raw.pri : 'orta',
    due: /^\d{4}-\d{2}-\d{2}$/.test(raw.due || '') ? raw.due : '',
    rep: ['yok', 'gunluk', 'her_2_gunde', 'haftalik', 'aylik', 'ay_son', 'ozel'].includes(raw.rep) ? raw.rep : 'yok',
    repDays: Array.isArray(raw.repDays) ? raw.repDays.filter(n => Number.isInteger(n)) : [],
    repInterval: Number.isInteger(raw.repInterval) && raw.repInterval > 1 ? raw.repInterval : null,
    repEnd: /^\d{4}-\d{2}-\d{2}$/.test(raw.repEnd || '') ? raw.repEnd : '',
    reminderTime: /^\d{2}:\d{2}$/.test(raw.reminderTime || '') ? raw.reminderTime : '',
    reminderRepeat: ['none', 'once', 'daily', 'weekly'].includes(raw.reminderRepeat) ? raw.reminderRepeat : 'none',
    est: String(raw.est || '').replace(/[^0-9]/g, '').slice(0, 4),
    tag: safeText(raw.tag || '', 40),
    note: safeText(raw.note || '', 3000),
    subs: Array.isArray(raw.subs) ? raw.subs.slice(0, 80).map(s => ({
      id: safeText(s?.id || gid(), 40),
      text: safeText(s?.text || '', 600),
      done: !!(s?.done),
    })) : [],
    done: !!(raw.done),
    created: raw.created || new Date().toISOString(),
    completedAt: typeof raw.completedAt === 'string' ? raw.completedAt : null,
  };
}
function sanitizeState(raw) {
  const def = {
    tasks: [], prayers: {}, habits: {}, zikirDone: {}, nafile: {}, qada: {},
    catTime: {}, timerSess: {}, theme: 'light',
    cats: null, habitDefs: null, lastReset: '',
    notifEnabled: false, namazCity: 'Konya',
    autoBackup: false, lastBackup: '',
    lat: null, lng: null,
    books: [], quotes: [], teacherTasks: [], snippets: [], webTools: [], subdomains: [],
    customMenus: { komutrotasi: false, teacher: false, books: false },
    customMenuNames: { komutrotasi: '🌐 Komut Rotası', teacher: '🏫 Bilişimci Hocam', books: '📚 Kitaplık' },
    userName: '',
    mascotReminderInterval: 10
  };
  const st = Object.assign(def, (raw && typeof raw === 'object') ? raw : {});
  st.theme = st.theme === 'dark' ? 'dark' : 'light';
  st.namazCity = safeText(st.namazCity || 'Konya', 40) || 'Konya';
  st.notifEnabled = !!(st.notifEnabled);
  st.autoBackup = !!(st.autoBackup);
  st.lastBackup = safeText(st.lastBackup || '', 40);
  st.lat = typeof st.lat === 'number' ? st.lat : null;
  st.lng = typeof st.lng === 'number' ? st.lng : null;
  st.lastReset = /^\d{4}-\d{2}-\d{2}$/.test(st.lastReset || '') ? st.lastReset : '';
  st.mascotReminderInterval = (typeof st.mascotReminderInterval === 'number') ? st.mascotReminderInterval : 10;
  if (!st.customMenus || typeof st.customMenus !== 'object') {
    st.customMenus = { komutrotasi: false, teacher: false, books: false };
  } else {
    st.customMenus = {
      komutrotasi: st.customMenus.komutrotasi === true,
      teacher: st.customMenus.teacher === true,
      books: st.customMenus.books === true,
    };
  }
  if (!st.customMenuNames || typeof st.customMenuNames !== 'object') {
    st.customMenuNames = { komutrotasi: '🌐 Komut Rotası', teacher: '🏫 Bilişimci Hocam', books: '📚 Kitaplık' };
  } else {
    let bName = safeText(st.customMenuNames.books || '📚 Kitaplık', 50);
    const bLower = bName.toLowerCase();
    if (!bName || !bLower.includes('kitap') || bLower.includes('bilisim') || bLower.includes('bilişim') || bLower.includes('hocam') || bLower.includes('test')) {
      bName = '📚 Kitaplık';
    }
    let kName = safeText(st.customMenuNames.komutrotasi || '🌐 Komut Rotası', 50);
    if (!kName || kName.toLowerCase().includes('test')) kName = '🌐 Komut Rotası';
    let tName = safeText(st.customMenuNames.teacher || '🏫 Bilişimci Hocam', 50);
    if (!tName || tName.toLowerCase().includes('test')) tName = '🏫 Bilişimci Hocam';

    st.customMenuNames = {
      komutrotasi: kName,
      teacher: tName,
      books: bName,
    };
  }
  st.cats = normalizeCats(st.cats || CATS); CATS = st.cats;
  st.habitDefs = normalizeHabits(st.habitDefs || HABITS); HABITS = st.habitDefs;
  st.tasks = Array.isArray(st.tasks) ? st.tasks.slice(0, 3000).map(sanitizeTask) : [];
  ['prayers', 'habits', 'zikirDone', 'catTime', 'timerSess', 'nafile', 'qada', 'esmaMemorized'].forEach(k => {
    if (!st[k] || typeof st[k] !== 'object' || Array.isArray(st[k])) st[k] = {};
  });
  ['books', 'quotes', 'teacherTasks', 'snippets', 'webTools', 'subdomains'].forEach(k => {
    if (!Array.isArray(st[k])) st[k] = [];
  });
  ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi', 'vitir'].forEach(k => {
    st.qada[k] = Number.isInteger(st.qada[k]) && st.qada[k] >= 0 ? st.qada[k] : 0;
  });
  if (!st.quran || typeof st.quran !== 'object') {
    st.quran = { surah: 1, surahName: 'Fâtiha', page: 1, ayah: 1, routines: {} };
  }
  return st;
}

/* ── DEPOLAMA (GÜVENLİ BROWSER STORAGE SARMALAYICISI) ── */
const safeStorage = {
  _mem: {},
  getItem(key) {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) {
        this._mem[key] = v;
        return v;
      }
      return this._mem[key] || null;
    } catch (e) {
      return this._mem[key] || null;
    }
  },
  setItem(key, val) {
    const sVal = String(val);
    this._mem[key] = sVal;
    try {
      localStorage.setItem(key, sVal);
    } catch (e) { }
  },
  removeItem(key) {
    delete this._mem[key];
    try {
      localStorage.removeItem(key);
    } catch (e) { }
  }
};

const OLD_SEED_NAMES = new Set([
  'Sabah namazını kıl', 'Öğle namazını kıl', 'İkindi namazını kıl', 'Akşam namazını kıl', 'Yatsı namazını kıl',
  'Cuma namazına git', 'Sabah sünnetini kıl', 'Kuran tilâveti (min 1 sayfa)', 'Sabah zikirleri', 'Akşam zikirleri',
  'Ayetel Kürsi', 'İhlas-Felak-Nas (3 kez)', '100 İstiğfar', 'Günlük Kodlama Pratiği', 'Yeni Proje Fikri',
  'Sosyal medya paylaşımı', 'YouTube ders videosu', 'Günlük plan hazırla', 'Kitap okuma (20 sayfa)',
  'Öğrenci notları E-okul\'a işle', 'Eşinle baş başa konuşma', 'Çocuklarla oyun / sohbet', 'Çocukların ödevlerine bak',
  'Anne-babayı ara', 'Kitap oku (min 20 dk)', 'Podcast / sesli kitap', 'Haftalık öğrendiklerini yaz'
]);

function load() {
  try {
    const raw = safeStorage.getItem('mikat');
    if (raw) Object.assign(S, sanitizeState(JSON.parse(raw)));
    else {
      // v5/v6 → mikat geçiş
      const old = safeStorage.getItem('mikat-v5');
      if (old) Object.assign(S, sanitizeState(JSON.parse(old)));
    }
    
    // Eski tarayıcı önbelleğinde saklanan sahte görev ve eski sayaç/istatistik verilerini temizle
    if (!localStorage.getItem('mikat_clean_v9')) {
      if (Array.isArray(S.tasks)) {
        S.tasks = S.tasks.filter(t => !t.name || !OLD_SEED_NAMES.has(t.name.trim()));
      }
      S.zikirCardCounts = {};
      S.prayers = {};
      S.habits = {};
      S.books = [];
      S.quotes = [];
      S.teacherTasks = [];
      S.snippets = [];
      S.webTools = [];
      S.subdomains = [];
      S.catTime = {};
      S.timerSess = {};
      S.customMenus = { komutrotasi: false, teacher: false, books: false };
      localStorage.setItem('mikat_clean_v9', '1');
      safeStorage.setItem('mikat', JSON.stringify(S));
    }

    CATS = normalizeCats(S.cats || CATS);
    HABITS = normalizeHabits(S.habitDefs || HABITS);
    S.cats = CATS; S.habitDefs = HABITS;
  } catch (e) {
    console.warn('Kayıt okunamadı:', e);
  }
}

function reloadFromStorage() {
  try {
    const raw = localStorage.getItem('mikat');
    if (raw) {
      safeStorage._mem['mikat'] = raw;
      const fresh = sanitizeState(JSON.parse(raw));
      for (const k in S) { delete S[k]; }
      Object.assign(S, fresh);
      CATS = normalizeCats(S.cats || CATS);
      HABITS = normalizeHabits(S.habitDefs || HABITS);
      if (typeof render === 'function') render();
    }
  } catch (e) {
    console.warn('Yeniden yükleme hatası:', e);
  }
}
window.mikatReloadFromStorage = reloadFromStorage;
window.addEventListener('storage', (e) => {
  if (e.key === 'mikat' || e.key === 'mikat_sync_trigger' || !e.key) {
    reloadFromStorage();
  }
});
function save() {
  try {
    S.cats = normalizeCats(CATS);
    S.habitDefs = normalizeHabits(HABITS);
    // H-02: S nesnesini yeni bir referansla değil, mevcut nesneyi güncelleyerek sakla
    Object.assign(S, sanitizeState({ ...S }));
    safeStorage.setItem('mikat', JSON.stringify(S));
    maybeAutoBackup();
    return true;
  } catch (e) {
    console.error('Kayıt hatası:', e);
    return false;
  }
}

/* save() için debounce — hızlı ardışık değişikliklerde yazım azaltılır */
let _saveTimer = null;
function debouncedSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(save, 300);
}

/* ── TEMA ── */
function applyTheme(t) {
  document.body.className = t;
  document.documentElement.setAttribute('data-theme', t);
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  const drawerThemeBtn = document.getElementById('drawerThemeBtn');
  if (drawerThemeBtn) drawerThemeBtn.innerHTML = t === 'dark' ? '<span style="font-size:1.05rem;">☀️</span> Tema' : '<span style="font-size:1.05rem;">🌙</span> Tema';
  const ring = document.getElementById('timerRing');
  if (ring) {
    ring.setAttribute('stroke', t === 'dark' ? '#3ecfb0' : '#0a7860');
    ring.previousElementSibling?.setAttribute('stroke', t === 'dark' ? '#2c3550' : '#d8ddf0');
  }
}
function toggleTheme() { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(S.theme); save(); }

/* ── KRİPTO (AES-256-GCM + PBKDF2) ── */
async function deriveKey(pw, salt, iterations = 600000) {
  const enc = new TextEncoder();
  const km = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}
// H-10: Büyük veri setlerinde stack overflow önlemek için chunk-based base64
function uint8ToBase64(bytes) {
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
async function encData(data, pw) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pw, salt, 600000);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)));
  const out = new Uint8Array(44 + ct.byteLength);
  out.set(salt); out.set(iv, 32); out.set(new Uint8Array(ct), 44);
  return 'MK1:' + uint8ToBase64(out);
}
async function decData(str, pw) {
  const prefix = str.slice(0, 4);
  if (prefix !== 'MK1:' && prefix !== 'HT6:' && prefix !== 'HT5:' && prefix !== 'HT4:')
    throw new Error('Geçersiz format');

  if (prefix === 'HT4:' || prefix === 'HT5:' || prefix === 'HT6:') {
    toast('Uyarı: Eski yedekleme formatı (HT4/HT5/HT6). Lütfen yeni Mikat yedeği alın.', 'w');
  }

  const buf = new Uint8Array(atob(str.slice(4)).split('').map(c => c.charCodeAt(0)));
  const salt = buf.slice(0, 32);
  const iv = buf.slice(32, 44);
  const ct = buf.slice(44);

  try {
    const key = await deriveKey(pw, salt, 600000);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(dec));
  } catch (e) {
    try {
      const key = await deriveKey(pw, salt, 310000);
      const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
      return JSON.parse(new TextDecoder().decode(dec));
    } catch (e2) {
      throw new Error('Şifre yanlış veya veri bozuk');
    }
  }
}
async function doExport() {
  const epwEl = document.getElementById('epw');
  const epw2El = document.getElementById('epw2');
  const pw = epwEl ? epwEl.value.trim() : '';
  const pw2 = epw2El ? epw2El.value.trim() : '';
  if (!pw) { toast('Şifre girin', 'e'); return; }
  if (pw.length < 6) { toast('En az 6 karakter', 'e'); return; }
  if (pw !== pw2) { toast('Şifreler eşleşmiyor!', 'e'); return; }
  try {
    const enc = await encData(S, pw);
    const expOut = document.getElementById('expOut');
    if (expOut) expOut.value = enc;
    const expR = document.getElementById('expR');
    if (expR) expR.style.display = 'block';
    const copybtn = document.getElementById('copybtn');
    if (copybtn) copybtn.style.display = 'block';
    const dlbtn = document.getElementById('dlbtn');
    if (dlbtn) dlbtn.style.display = 'block';
    toast('Veri şifrelendi! Güvenli bir yere kaydedin.', 's');
  } catch (e) { toast('Hata: ' + e.message, 'e'); }
}
async function doImport() {
  const ipwEl = document.getElementById('ipw');
  const idataEl = document.getElementById('idata');
  const pw = ipwEl ? ipwEl.value.trim() : '';
  const raw = idataEl ? idataEl.value.trim() : '';
  if (!pw) { toast('Şifre girin', 'e'); return; }
  if (!raw) { toast('Veri yapıştırın', 'e'); return; }
  try {
    const dec = await decData(raw, pw);
    Object.assign(S, sanitizeState(dec));
    CATS = normalizeCats(S.cats); HABITS = normalizeHabits(S.habitDefs);
    save(); render(); renderSelects();
    toast('Veriler başarıyla yüklendi!', 's');
    if (idataEl) idataEl.value = '';
    if (ipwEl) ipwEl.value = '';
  } catch (e) { toast('Şifre yanlış veya veri bozuk!', 'e'); }
}
function copyExp() {
  const v = document.getElementById('expOut').value;
  if (!v) return;
  navigator.clipboard.writeText(v).then(() => toast('Kopyalandı!', 's'));
}
function dlExp() {
  const v = document.getElementById('expOut').value;
  if (!v) return;
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(v);
  a.download = 'mikat-' + today() + '.htbak';
  a.click();
  toast('İndiriliyor...', 'i');
}
function detectLocation() {
  if (!navigator.geolocation) { toast('Tarayıcı konumu desteklemiyor', 'e'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    S.lat = pos.coords.latitude;
    S.lng = pos.coords.longitude;
    save();
    renderSettings();
    toast(`Konum bulundu: ${S.lat.toFixed(4)}, ${S.lng.toFixed(4)}`, 's');
  }, err => {
    toast('Konum alınamadı: ' + err.message, 'e');
  }, { timeout: 15000, enableHighAccuracy: true });
}
function saveNamazCity() {
  const city = document.getElementById('namazCityInput').value.trim();
  if (!city) { toast('Şehir girin', 'e'); return; }
  S.namazCity = city;
  save();
  fetchPrayerTimes();
  renderSettings();
  toast('Namaz şehri kaydedildi: ' + city, 's');
}
function toggleAutoBackup(enabled) {
  S.autoBackup = !!enabled;
  save();
  renderSettings();
  toast(S.autoBackup ? 'Otomatik yedekleme etkin' : 'Otomatik yedekleme kapatıldı', S.autoBackup ? 's' : 'i');
}
function maybeAutoBackup() {
  // H-01: Sadece backup key'ine yaz; mikat'a tekrar yazmak save() döngüsüne neden olur
  if (!S.autoBackup) return;
  const ts = new Date().toISOString();
  const backup = { ts, data: JSON.parse(JSON.stringify(S)) };
  localStorage.setItem('mikat-auto-backup', JSON.stringify(backup));
  S.lastBackup = ts;
  // Not: mikat anahtarına tekrar yazmıyoruz — save() zaten yazdı
}
function doExportJson() {
  const exportData = JSON.parse(JSON.stringify(S));
  delete exportData.lat;
  delete exportData.lng;
  exportData.namazCity = 'Konya';
  const data = JSON.stringify(exportData, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mikat-${today()}.json`;
  a.click();
  toast('JSON indiriliyor...', 's');
}
function doExportCsv() {
  const rows = [['id', 'ad', 'kategori', 'öncelik', 'tarih', 'hatırlatıcı', 'hatırlama', 'tekrar', 'etiket', 'not', 'durum']];
  S.tasks.forEach(t => {
    rows.push([
      t.id,
      t.name,
      t.cat,
      t.pri,
      t.due || '',
      t.reminderTime || '',
      t.reminderRepeat || '',
      t.rep || '',
      t.tag || '',
      t.note || '',
      t.done ? 'tamamlandı' : 'beklemede'
    ]);
  });
  const csv = rows.map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mikat-${today()}.csv`;
  a.click();
  toast('CSV indiriliyor...', 's');
}
function restoreBackup() {
  const raw = localStorage.getItem('mikat-auto-backup');
  if (!raw) { toast('Otomatik yedek bulunamadı', 'e'); return; }
  let backup;
  try { backup = JSON.parse(raw); } catch (e) { toast('Yedek okunamadı: ' + e.message, 'e'); return; }
  if (!backup || !backup.data) { toast('Geçersiz yedek dosyası', 'e'); return; }
  const ts = backup.ts ? new Date(backup.ts).toLocaleString('tr-TR') : '—';
  showConfirm(
    '💾 Yedekten Geri Yükle',
    'Otomatik yedekten geri yükleyelim mi?',
    'Yedek tarihi: ' + ts,
    '✅ Geri Yükle',
    () => {
      try {
        Object.assign(S, sanitizeState(backup.data));
        CATS = normalizeCats(S.cats); HABITS = normalizeHabits(S.habitDefs);
        S.cats = CATS; S.habitDefs = HABITS;
        save(); render(); renderSelects(); renderSettings();
        toast('Yedek geri yüklendi', 's');
      } catch (e) { toast('Yedek yüklenemedi: ' + e.message, 'e'); }
    }
  );
}
function cTab(t, el) {
  document.querySelectorAll('.ctab').forEach(x => x.classList.remove('on'));
  el.classList.add('on');
  ['cexp', 'cimp'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById('c' + t).style.display = 'block';
}

/* ── SES ── */
let audioCtx = null;
function unlockAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    g.gain.value = 0.0001; o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.02);
  } catch (e) { }
}
function playSound(kind = 'bell') {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const freqs = kind === 'prayer' ? [660, 880, 660] : kind === 'done' ? [523, 659, 784] : [880, 660];
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f, now + i * .16);
      g.gain.setValueAtTime(0.0001, now + i * .16);
      g.gain.exponentialRampToValueAtTime(0.16, now + i * .16 + .02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * .16 + .14);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(now + i * .16); o.stop(now + i * .16 + .15);
    });
  } catch (e) { }
}

/* ── BİLDİRİMLER ── */
let notifTimers = [];
function toggleNotifications() {
  if (!('Notification' in window)) { toast('Tarayıcınız bildirimleri desteklemiyor', 'e'); return; }
  if (S.notifEnabled) {
    S.notifEnabled = false;
    notifTimers.forEach(clearTimeout); notifTimers = [];
    document.getElementById('notifBtn')?.classList.remove('on');
    save(); toast('Bildirimler kapatıldı', 'i');
  } else {
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        S.notifEnabled = true;
        unlockAudio(); playSound('done');
        document.getElementById('notifBtn')?.classList.add('on');
        scheduleNotifs(); save(); toast('Bildirimler açıldı! 🔔', 's');
      } else { toast('Bildirim izni verilmedi', 'w'); }
    });
  }
}
function scheduleNotifs() {
  notifTimers.forEach(clearTimeout); notifTimers = [];
  if (!S.notifEnabled) return;
  const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
  PRAYERS.forEach(p => {
    const [h, m] = p.t.split(':').map(Number);
    const diff = (h * 60 + m - nowMin) * 60000;
    if (diff > 0 && diff < 86400000) {
      notifTimers.push(setTimeout(() => {
        if (S.notifEnabled && Notification.permission === 'granted') {
          playSound('prayer');
          new Notification('🕌 ' + p.n + ' Vakti', { body: p.t + ' — Namaz vakti geldi', tag: 'namaz-' + p.n });
        }
      }, diff));
    }
  });
  S.tasks.filter(t => !t.done).forEach(task => {
    if (task.reminderTime && task.reminderRepeat && task.reminderRepeat !== 'none') {
      const [h, m] = task.reminderTime.split(':').map(Number);
      const remindAt = new Date();
      remindAt.setHours(h, m, 0, 0);
      const diff = remindAt - now;
      if (diff > 0 && diff < 86400000) {
        // H-07: Operatör önceliği netleştirildi — her koşul ayrı paranteze alındı
        const valid = (task.reminderRepeat === 'daily')
          || (task.reminderRepeat === 'weekly' && (new Date(task.due + 'T00:00:00').getDay() === now.getDay() || !task.due))
          || (task.reminderRepeat === 'once' && task.due === today());
        if (valid) {
          notifTimers.push(setTimeout(() => {
            if (S.notifEnabled && Notification.permission === 'granted' && !task.done) {
              playSound('bell');
              new Notification('⏰ Görev Hatırlatıcı', { body: task.name, tag: 'task-' + task.id });
            }
          }, diff));
        }
      }
    }
  });
}
function updateNotifBtn() { document.getElementById('notifBtn')?.classList.toggle('on', !!S.notifEnabled); }

/* ── Türkiye Şehir Koordinat Rehberi (Hassas Diyanet Vakitleri) ── */
const TURKEY_CITY_COORDS = {
  'konya': { lat: 37.8746, lng: 32.4932 },
  'istanbul': { lat: 41.0082, lng: 28.9784 },
  'ankara': { lat: 39.9334, lng: 32.8597 },
  'izmir': { lat: 38.4237, lng: 27.1428 },
  'bursa': { lat: 40.1885, lng: 29.0610 },
  'antalya': { lat: 36.8969, lng: 30.7133 },
  'adana': { lat: 37.0000, lng: 35.3213 },
  'gaziantep': { lat: 37.0662, lng: 37.3833 },
  'kayseri': { lat: 38.7312, lng: 35.4787 },
  'trabzon': { lat: 41.0027, lng: 39.7168 },
  'samsun': { lat: 41.2928, lng: 36.3313 },
  'diyarbakir': { lat: 37.9144, lng: 40.2306 },
  'erzurum': { lat: 39.9043, lng: 41.2679 },
  'eskisehir': { lat: 39.7767, lng: 30.5206 },
  'sanliurfa': { lat: 37.1674, lng: 38.7954 },
  'malatya': { lat: 38.3552, lng: 38.3095 },
  'denizli': { lat: 37.7765, lng: 29.0864 },
  'kocaeli': { lat: 40.8533, lng: 29.8815 },
  'sakarya': { lat: 40.7569, lng: 30.3783 },
  'mersin': { lat: 36.8121, lng: 34.6415 }
};

/* ── NAMAZ VAKİTLERİ ── */
async function fetchPrayerTimes() {
  try {
    const cityName = (S.namazCity || 'Konya').trim();
    const cityKey = cityName.toLowerCase()
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
      .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
    
    // Önce cache kontrol et — aynı gün + aynı şehir ise API'ye gitme
    try {
      const cached = JSON.parse(localStorage.getItem('mikat-prayer-cache') || 'null');
      if (cached && cached.date === today() && cached.city?.toLowerCase() === cityName.toLowerCase() && Array.isArray(cached.prayers)) {
        PRAYERS = cached.prayers;
        SUNRISE_TIME = cached.sunrise || null;
        IMSAK_TIME = cached.imsak || null;
        const srcEl = document.getElementById('namazSource');
        if (srcEl) srcEl.textContent = '📦 Önbellekten — ' + cityName;
        renderNamaz();
        renderHeaderPrayerVakit();
        initHeaderAssistant();
        if (S.notifEnabled) scheduleNotifs();
        return;
      }
    } catch (e) { }

    const nowD = new Date();
    const dateStr = `${String(nowD.getDate()).padStart(2,'0')}-${String(nowD.getMonth()+1).padStart(2,'0')}-${nowD.getFullYear()}`;
    let apiUrl = '';
    const knownCoords = TURKEY_CITY_COORDS[cityKey];
    if (knownCoords) {
      apiUrl = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${knownCoords.lat}&longitude=${knownCoords.lng}&method=13`;
    } else {
      apiUrl = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(cityName)}&country=Turkey&method=13`;
    }

    const r = await fetch(apiUrl);
    if (!r.ok) throw new Error('API hatası');
    const j = await r.json();
    const t = j?.data?.timings;
    if (!t?.Fajr || !t?.Dhuhr) throw new Error('Geçersiz vakit verisi');

    if (j?.data?.date?.hijri) {
      try {
        const hObj = j.data.date.hijri;
        const HIJRI_MONTHS_TR = ['Muharrem', 'Sefer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'];
        const mNum = parseInt(hObj.month?.number || 1, 10);
        const mName = HIJRI_MONTHS_TR[mNum - 1] || 'Muharrem';
        const officialStr = `${parseInt(hObj.day, 10)} ${mName} ${hObj.year}`;
        localStorage.setItem('mikat-hijri-official', JSON.stringify({ date: today(), str: officialStr }));
      } catch (e) { }
    }

    SUNRISE_TIME = t.Sunrise ? t.Sunrise.slice(0, 5) : null;
    IMSAK_TIME = t.Imsak ? t.Imsak.slice(0, 5) : null;
    PRAYERS = [
      { n: 'Sabah', t: t.Fajr.slice(0, 5), h: parseInt(t.Fajr) },
      { n: 'Öğle', t: t.Dhuhr.slice(0, 5), h: parseInt(t.Dhuhr) },
      { n: 'İkindi', t: t.Asr.slice(0, 5), h: parseInt(t.Asr) },
      { n: 'Akşam', t: t.Maghrib.slice(0, 5), h: parseInt(t.Maghrib) },
      { n: 'Yatsı', t: t.Isha.slice(0, 5), h: parseInt(t.Isha) },
    ];

    try {
      localStorage.setItem('mikat-prayer-cache', JSON.stringify({
        date: today(), city: cityName, prayers: PRAYERS, sunrise: SUNRISE_TIME, imsak: IMSAK_TIME
      }));
    } catch (e) { }

    const srcEl = document.getElementById('namazSource');
    if (srcEl) srcEl.textContent = '🌐 Canlı Diyanet Verisi — ' + cityName;
    renderNamaz();
    renderHeaderPrayerVakit();
    initHeaderAssistant();
    if (S.notifEnabled) scheduleNotifs();
  } catch (e) {
    const srcEl = document.getElementById('namazSource');
    if (srcEl) srcEl.textContent = '📡 Çevrimdışı — varsayılan saatler';
    renderHeaderPrayerVakit();
    initHeaderAssistant();
  }
}

/* ── OTOMATİK SIFIRLAMA ── */
function autoReset() {
  const td = today();
  if (S.lastReset === td) return;
  S.tasks.forEach(t => {
    if (isRepeatDueOn(t, td)) {
      t.done = false;
      t.completedAt = null;
    }
  });
  S.lastReset = td; save();
}

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function isTaskDueToday(t) {
  if (!t) return false;
  const td = today();
  if (t.due === td) return true;
  if (t.due && t.due < td && !t.done) return true;
  if (!t.due) return isRepeatDueOn(t, td);
  return false;
}

function isTaskDueTomorrow(t) {
  if (!t) return false;
  const tm = tomorrow();
  if (t.due === tm) return true;
  if (!t.due) return isRepeatDueOn(t, tm);
  return false;
}

function isTaskForToday(t) {
  if (!t || typeof t !== 'object') return false;
  const td = today();
  const cAt = typeof t.completedAt === 'string' ? t.completedAt : '';
  if (t.done) {
    if (cAt && cAt.substring(0, 10) === td) return true;
    if (t.due === td) return true;
    if (!t.due && isRepeatDueOn(t, td)) return true;
    return false;
  }
  if (t.due === td) return true;
  if (t.due && t.due < td) return true;
  if (!t.due) return isRepeatDueOn(t, td);
  return false;
}

/* ── TEKRAR GÜN SEÇİCİ ── */
const WEEK_DAYS = [
  { v: 1, l: 'Pt' }, { v: 2, l: 'Sa' }, { v: 3, l: 'Ça' }, { v: 4, l: 'Pe' },
  { v: 5, l: 'Cu' }, { v: 6, l: 'Ct' }, { v: 0, l: 'Pz' }
];
function toggleRepDays(preselect) {
  const rep = document.getElementById('fRep').value;
  const row = document.getElementById('repDaysRow');
  const interval = document.getElementById('repIntervalRow');
  const end = document.getElementById('repEndRow');
  const picker = document.getElementById('repDaysPicker');
  const lbl = document.getElementById('repDaysLbl');
  row.style.display = 'none'; interval.style.display = 'none'; end.style.display = 'none';
  picker.innerHTML = '';
  if (rep === 'haftalik') {
    row.style.display = ''; lbl.textContent = 'Hangi Günler?';
    const sel = Array.isArray(preselect) ? preselect : [];
    picker.innerHTML = WEEK_DAYS.map(d =>
      `<button type="button" class="rep-day-btn${sel.includes(d.v) ? ' on' : ''}" data-val="${d.v}" onclick="this.classList.toggle('on')">${d.l}</button>`
    ).join('');
  } else if (rep === 'aylik') {
    row.style.display = ''; lbl.textContent = 'Ayın Kaçında?';
    const sel = Array.isArray(preselect) && preselect.length ? preselect : [1];
    picker.innerHTML = Array.from({ length: 31 }, (_, i) => i + 1).map(d =>
      `<button type="button" class="rep-month-btn${sel.includes(d) ? ' on' : ''}" data-val="${d}" onclick="selectMonthDay(this)">${d}</button>`
    ).join('');
  } else if (rep === 'ay_son') {
    end.style.display = '';
  } else if (rep === 'her_2_gunde') {
    interval.style.display = '';
    const repInt = document.getElementById('fRepInterval'); if (repInt) repInt.value = 2;
    end.style.display = '';
  } else if (rep === 'ozel') {
    interval.style.display = '';
    end.style.display = '';
  }
}
function selectMonthDay(btn) {
  btn.closest('#repDaysPicker').querySelectorAll('.rep-month-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}
function getRepDays(rep) {
  if (rep === 'haftalik')
    return Array.from(document.querySelectorAll('#repDaysPicker .rep-day-btn.on')).map(b => parseInt(b.dataset.val));
  if (rep === 'aylik') {
    const on = document.querySelector('#repDaysPicker .rep-month-btn.on');
    return on ? [parseInt(on.dataset.val)] : [1];
  }
  return [];
}

/* ── GÖREV CRUD ── */
function openAdd(catKey) {
  editId = null; tmpSubs = [];
  const mTitle = document.getElementById('mTitle'); if (mTitle) mTitle.textContent = '✏️ Yeni Görev';
  ['fName', 'fNote', 'fDue', 'fTag', 'fReminder', 'fRepInterval', 'fRepEnd'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const fPri = document.getElementById('fPri'); if (fPri) fPri.value = 'orta';
  const fRep = document.getElementById('fRep'); if (fRep) fRep.value = 'yok';
  const fRemRep = document.getElementById('fRemRep'); if (fRemRep) fRemRep.value = 'none';
  const fEst = document.getElementById('fEst'); if (fEst) fEst.value = '';
  const fCat = document.getElementById('fCat'); if (fCat) fCat.value = catKey || activeCat || Object.keys(CATS)[0] || 'diger';
  const subPrev = document.getElementById('subPrev'); if (subPrev) subPrev.innerHTML = '';
  toggleRepDays();
  document.getElementById('taskModal')?.classList.add('on');
  setTimeout(() => document.getElementById('fName')?.focus(), 80);
}
function openAddForSelectedDay() { openAdd(); const fDue = document.getElementById('fDue'); if (fDue) fDue.value = selectedDate || today(); }
function openEdit(id) {
  const t = S.tasks.find(x => x.id === id); if (!t) return;
  editId = id; tmpSubs = [...(t.subs || [])];
  const mTitle = document.getElementById('mTitle'); if (mTitle) mTitle.textContent = '✏️ Görevi Düzenle';
  const fName = document.getElementById('fName'); if (fName) fName.value = t.name;
  const fCat = document.getElementById('fCat'); if (fCat) fCat.value = t.cat;
  const fPri = document.getElementById('fPri'); if (fPri) fPri.value = t.pri;
  const fDue = document.getElementById('fDue'); if (fDue) fDue.value = t.due || '';
  const fRem = document.getElementById('fReminder'); if (fRem) fRem.value = t.reminderTime || '';
  const fRemRep = document.getElementById('fRemRep'); if (fRemRep) fRemRep.value = t.reminderRepeat || 'none';
  const fRep = document.getElementById('fRep'); if (fRep) fRep.value = t.rep || 'yok';
  const fRepInt = document.getElementById('fRepInterval'); if (fRepInt) fRepInt.value = t.repInterval || '';
  const fRepEnd = document.getElementById('fRepEnd'); if (fRepEnd) fRepEnd.value = t.repEnd || '';
  const fEst = document.getElementById('fEst'); if (fEst) fEst.value = t.est || '';
  const fTag = document.getElementById('fTag'); if (fTag) fTag.value = t.tag || '';
  const fNote = document.getElementById('fNote'); if (fNote) fNote.value = t.note || '';
  toggleRepDays(t.repDays || []);
  renderSubPrev();
  document.getElementById('taskModal')?.classList.add('on');
  setTimeout(() => document.getElementById('fName')?.focus(), 80);
}
function closeModal(id) { document.getElementById(id)?.classList.remove('on'); }

/**
 * H-13: Generic confirm modal — native confirm() yerine PWA uyumlu dialog
 * @param {string} title   - Modal başlığı
 * @param {string} msg     - Ana mesaj (kalın)
 * @param {string} detail  - İsteğe bağlı detay metni (bosse gizlenir)
 * @param {string} okLabel - Onayla butonunun metni
 * @param {Function} onOk  - Onaylanma callback'i
 * @param {boolean} danger - true ise kırmızı .mdel, false ise yeşil .msave stili
 */
function showConfirm(title, msg, detail, okLabel, onOk, danger = false) {
  const tEl = document.getElementById('confModalTitle'); if (tEl) tEl.textContent = title;
  const txtEl = document.getElementById('confTxt'); if (txtEl) txtEl.textContent = msg;
  const det = document.getElementById('confDetail');
  if (det) {
    if (detail) { det.textContent = detail; det.style.display = ''; }
    else { det.textContent = ''; det.style.display = 'none'; }
  }
  const btn = document.getElementById('confOk');
  if (btn) {
    btn.textContent = okLabel;
    btn.className = danger ? 'mdel' : 'msave';
    btn.onclick = () => { closeModal('confModal'); onOk(); };
  }
  document.getElementById('confModal')?.classList.add('on');
}
function saveTask() {
  const name = document.getElementById('fName').value.trim();
  if (!name) { toast('Görev adı boş olamaz!', 'e'); return; }
  const rep = document.getElementById('fRep').value;
  const task = {
    id: editId || gid(), name,
    cat: document.getElementById('fCat').value,
    pri: document.getElementById('fPri').value,
    due: document.getElementById('fDue').value,
    reminderTime: document.getElementById('fReminder').value,
    reminderRepeat: document.getElementById('fRemRep').value,
    rep, repDays: getRepDays(rep),
    repInterval: parseInt(document.getElementById('fRepInterval').value, 10) || null,
    repEnd: document.getElementById('fRepEnd').value,
    est: document.getElementById('fEst').value,
    tag: (document.getElementById('fTag')?.value || '').trim(),
    note: (document.getElementById('fNote')?.value || '').trim(),
    subs: tmpSubs.map(s => ({ ...s })),
    done: false, created: new Date().toISOString(), completedAt: null,
  };
  if (editId) {
    const i = S.tasks.findIndex(x => x.id === editId);
    if (i > -1) {
      task.done = S.tasks[i].done;
      task.completedAt = S.tasks[i].completedAt;
      task.created = S.tasks[i].created;
      S.tasks[i] = task;
    }
  } else { S.tasks.unshift(task); }
  save(); render(); closeModal('taskModal');
  toast(editId ? 'Güncellendi!' : 'Görev eklendi!', 's');
}
function toggleTask(id) {
  const t = S.tasks.find(x => x.id === id); if (!t) return;
  t.done = !t.done; t.completedAt = t.done ? new Date().toISOString() : null;
  if (t.done) {
    triggerConfetti();
    try { mascotCelebrate(t.name); } catch(e) {}
  }
  save();
  // Sadece ilgili bölümleri render et — tüm sayfayı yeniden çizme (ticker animasyonunu bozar)
  renderTasks();
  renderCatCards();
  renderDayProg();
  if (document.getElementById('v-habits')?.classList.contains('on') || document.getElementById('v-analytics')?.classList.contains('on')) renderAnalytics();
}
function toggleSub(tid, si) {
  const t = S.tasks.find(x => x.id === tid); if (!t?.subs) return;
  t.subs[si].done = !t.subs[si].done;
  save();
  renderTasks();
  renderDayProg();
}
function confirmDel(id) {
  const t = S.tasks.find(x => x.id === id); if (!t) return;
  showConfirm(
    '🗑️ Görevi Sil',
    `“${t.name}” silinsin mi?`,
    '',
    '🗑️ Sil',
    () => { S.tasks = S.tasks.filter(x => x.id !== id); save(); render(); toast('Silindi.', 'i'); },
    true
  );
}
// H-05: İsim düzeltildi — fonksiyon siler değil, tamamlanmışları sıfırlar
function resetDoneTasks() {
  const n = S.tasks.filter(t => t.done).length;
  S.tasks.filter(t => t.done).forEach(t => {
    t.done = false; t.completedAt = null;
    t.subs?.forEach(s => s.done = false);
  });
  save(); render(); toast(`${n} tamamlanmış görev sıfırlandı.`, 'i');
}
// Geriye dönük uyumluluk için eski isim de çalışsın
function clearDone() { return resetDoneTasks(); }
window.clearDone = clearDone;

/* ── ALT GÖREVLER ── */
function addSub() {
  const inp = document.getElementById('subInp');
  const v = inp.value.trim(); if (!v) return;
  tmpSubs.push({ id: gid(), text: v, done: false }); inp.value = ''; renderSubPrev();
}
function removeSub(i) { tmpSubs.splice(i, 1); renderSubPrev(); }
function renderSubPrev() {
  const el = document.getElementById('subPrev');
  if (el) {
    el.innerHTML = tmpSubs.map((s, i) =>
      `<div class="sp-item"><span>☐ ${esc(s.text)}</span><button onclick="removeSub(${i})">✕</button></div>`
    ).join('');
  }
}
document.getElementById('subInp')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addSub(); } });

/* ════════════════════════════════════════════════════════════
   CANLI EVCİL HAYVAN / MASKOT MOTORU (LIVING PET ENGINE)
   ════════════════════════════════════════════════════════════ */
let mascotState = 'idle'; // 'idle', 'walking', 'hopping', 'sleeping'
let mascotTimer = null;
let mascotRoamTimer = null;
let mascotAutoDismissTimer = null;
let mascotIdleCounter = 0;
let mascotAudioCtx = null;

// Sevimli Web Audio API Sentezör Ses Efektleri (Köpek Cik/Hav Sesleri)
function playMascotSound(type = 'happy') {
  try {
    if (!mascotAudioCtx) mascotAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (mascotAudioCtx.state === 'suspended') mascotAudioCtx.resume();
    
    const now = mascotAudioCtx.currentTime;
    const osc = mascotAudioCtx.createOscillator();
    const gain = mascotAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(mascotAudioCtx.destination);

    if (type === 'happy' || type === 'hop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.1); // D6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'remind') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.24);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const o = mascotAudioCtx.createOscillator();
        const g = mascotAudioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(mascotAudioCtx.destination);
        const startTime = now + (idx * 0.07);
        g.gain.setValueAtTime(0.15, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
        o.start(startTime);
        o.stop(startTime + 0.22);
      });
    }
  } catch (e) {}
}

// Maskotu Uyandır
function wakeMascotUp() {
  const btn = document.getElementById('mascotBtn');
  const zzz = document.getElementById('mascotZzz');
  if (zzz) zzz.remove();
  if (btn) btn.classList.remove('sleeping');
  mascotIdleCounter = 0;
  if (mascotState === 'sleeping') mascotState = 'idle';
}

// Maskot Tıklama & Etkileşim
function onMascotClick() {
  if (mascotState === 'sleeping') {
    wakeMascotUp();
    mascotHop(false);
    playMascotSound('happy');
    toast('🎷 Anadolu Parsı (Pars) uyandı!', 's');
    return;
  }
  mascotHop(false);
  playMascotSound('happy');
  toggleMascotBubble();
}

function toggleMascotBubble() {
  const bubble = document.getElementById('mascotBubble');
  const badge = document.getElementById('mascotBadge');
  if (!bubble) return;

  wakeMascotUp();
  const isHidden = bubble.style.display === 'none' || !bubble.style.display;
  
  if (isHidden) {
    checkHabitReminders(true);
    bubble.style.display = 'block';
    if (badge) badge.style.display = 'none';
    setTimeout(() => document.getElementById('qaInp')?.focus(), 100);
  } else {
    bubble.style.display = 'none';
  }
}

function closeMascotBubble() {
  const bubble = document.getElementById('mascotBubble');
  if (bubble) bubble.style.display = 'none';
}

function toggleFabQuickAdd() {
  toggleMascotBubble();
}

// Maskot Yürütme Motoru
function mascotWalkTo(targetX) {
  if (window.innerWidth <= 768) return;
  const wrapper = document.getElementById('fabWrapper');
  const btn = document.getElementById('mascotBtn');
  const svgCont = document.getElementById('mascotSvgContainer');
  if (!wrapper || !btn) return;

  wakeMascotUp();
  mascotState = 'walking';

  const currentX = wrapper.offsetLeft;
  const isWalkingLeft = targetX < currentX;

  if (svgCont) svgCont.style.transform = isWalkingLeft ? 'scaleX(-1)' : 'scaleX(1)';
  btn.classList.add('walking');

  wrapper.style.left = `${targetX}px`;

  setTimeout(() => {
    btn.classList.remove('walking');
    mascotState = 'idle';
    if (svgCont) svgCont.style.transform = 'scaleX(1)';
  }, 2200);
}

function triggerRandomMascotWalk(isInteractive = false) {
  if (window.innerWidth <= 768) return;
  const minX = 30;
  const maxX = Math.max(80, window.innerWidth - 130);
  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  mascotWalkTo(randomX);
  if (isInteractive) playMascotSound('happy');
}

// Maskot Zıplama & Takla
function mascotHop(isBackflip = false) {
  if (window.innerWidth <= 768) return;
  const btn = document.getElementById('mascotBtn');
  if (!btn) return;

  wakeMascotUp();
  playMascotSound(isBackflip ? 'victory' : 'hop');

  const animClass = isBackflip ? 'backflip' : 'hopping';
  btn.classList.add(animClass);

  setTimeout(() => {
    btn.classList.remove(animClass);
  }, isBackflip ? 750 : 600);
}

// Alışkanlık & Görev Kutlaması (Canlı Sevinç Reaksiyonu)
function mascotCelebrate(title = '') {
  mascotHop(true);
  playMascotSound('victory');
  const bodyEl = document.getElementById('mascotBubbleBody');
  const bubble = document.getElementById('mascotBubble');
  if (bodyEl && bubble) {
    const uName = S.userName || 'Dostum';
    bodyEl.innerHTML = `🎷 <b>Harikasın ${esc(uName)}!</b> <b>"${esc(title)}"</b> görevini başardın, Pars seninle gurur duyuyor! ⭐👑`;
    bubble.style.display = 'block';
    setTimeout(() => { bubble.style.display = 'none'; }, 8000);
  }
}

// 10 Dakikalık Eksik Alışkanlık Kontrolü & Detaylı İnceleme
function checkHabitReminders(forced = false) {
  if (!forced && window.innerWidth <= 768) return;
  const bodyEl = document.getElementById('mascotBubbleBody');
  const badge = document.getElementById('mascotBadge');
  const bubble = document.getElementById('mascotBubble');
  if (!bodyEl) return;

  wakeMascotUp();

  if (!S.userName) {
    bodyEl.innerHTML = `💬 Merhaba! Ben Pars. 🎷<br><br>Sana nasıl hitap etmeliyim?<br>
      <div style="margin-top:10px; display:flex; gap:6px;">
        <input type="text" id="mascotNameInput" placeholder="Adınız..." style="flex:1; padding:6px 10px; border-radius:6px; border:1px solid var(--bd); background:var(--bg2); color:var(--tx); font-size:0.85rem; outline:none;" onkeydown="if(event.key==='Enter') saveMascotName()">
        <button onclick="saveMascotName()" style="padding:6px 12px; background:var(--gold); border:none; border-radius:6px; color:#0d1117; font-weight:800; cursor:pointer;">Kaydet</button>
      </div>
    `;
    if (!forced) {
      playMascotSound('remind');
      if (bubble) bubble.style.display = 'block';
      if (badge) badge.style.display = 'flex';
      mascotHop(false);
    }
    return;
  }

  const uName = S.userName;
  const todayStr = today();
  const allHabits = S.habitDefs || HABITS || [];
  const todayHabitsDone = (S.habits && S.habits[todayStr]) || {};

  // Eksik alışkanlıkları doğru hesapla (tamamlanan tekrar < hedef tekrar)
  const missingHabits = allHabits.filter(h => {
    const count = todayHabitsDone[h.id] || 0;
    const target = h.target || 1;
    return count < target;
  });

  let msg = '';
  if (missingHabits.length > 0) {
    const habitListHtml = missingHabits.map(h => {
      const cur = (typeof todayHabitsDone[h.id] === 'number') ? todayHabitsDone[h.id] : (todayHabitsDone[h.id] ? 1 : 0);
      const tar = h.target || h.t || 1;
      const hName = h.l || h.title || h.name || h.label || 'Alışkanlık';
      const hIcon = h.icon || h.i || '⚡';
      return `<li style="margin:4px 0;">${hIcon} <b>${esc(hName)}</b> (${cur}/${tar})</li>`;
    }).join('');

    msg = `🎷 <b>${esc(uName)}! Bugün henüz tamamlamadığın ${missingHabits.length} alışkanlığın var:</b>
           <ul style="margin: 8px 0 0 16px; padding: 0; text-align: left; font-size: 0.88rem; list-style-type: disc;">${habitListHtml}</ul>
           <div style="margin-top:8px; font-size:0.82rem; color:var(--text-muted);">🔥 Haydi hamleni yap ve alışkanlığını tamamla!</div>`;
  } else {
    const pendingTasks = (S.tasks || []).filter(t => t.date === todayStr && !t.done);
    if (pendingTasks.length > 0) {
      const taskListHtml = pendingTasks.slice(0, 3).map(t => `<li style="margin:3px 0;">📋 <b>${esc(t.title || t.name || t.text || t.content || 'Görev')}</b></li>`).join('');
      msg = `🎷 <b>Tebrikler ${esc(uName)}! Alışkanlıkların tamam.</b> Bugün yapılacak bekleyen görevlerin var:
             <ul style="margin: 6px 0 0 16px; padding: 0; text-align: left; font-size: 0.85rem;">${taskListHtml}</ul>`;
    } else {
      msg = `🎷 <b>Harikasın ${esc(uName)}! 🎉</b> Bugün tüm alışkanlıklarını ve görevlerini başarıyla tamamladın. Pars seninle gurur duyuyor! 🌟👑`;
    }
  }

  bodyEl.innerHTML = `💬 ${msg}`;

  if (!forced) {
    playMascotSound('remind');
    if (bubble) bubble.style.display = 'block';
    if (badge) badge.style.display = 'flex';
    mascotHop(false);

    if (mascotAutoDismissTimer) clearTimeout(mascotAutoDismissTimer);
    mascotAutoDismissTimer = setTimeout(() => {
      if (bubble) bubble.style.display = 'none';
    }, 12000);
  }
}

window.saveMascotName = function() {
  const inp = document.getElementById('mascotNameInput');
  if (inp && inp.value.trim().length > 0) {
    S.userName = inp.value.trim();
    save();
    checkHabitReminders(true);
    toast(`Memnun oldum, ${esc(S.userName)}!`, 's');
  }
}

// Canlı Özgür Gezinme & Yaşam Döngüsü Motoru (Shimeji Stili)
function initMascotReminder() {
  if (mascotTimer) { clearInterval(mascotTimer); mascotTimer = null; }
  if (mascotRoamTimer) { clearInterval(mascotRoamTimer); mascotRoamTimer = null; }

  // Mobilde maskot motorunu çalıştırma
  if (window.innerWidth <= 768) return;

  const intervalMin = (typeof S.mascotReminderInterval === 'number') ? S.mascotReminderInterval : 10;

  // 10 dakikada bir (veya yapılandırılan sürede) otomatik eksik alışkanlık hatırlatıcısı
  if (intervalMin > 0) {
    mascotTimer = setInterval(() => {
      if (window.innerWidth <= 768) return;
      checkHabitReminders(false);
    }, intervalMin * 60 * 1000);
  }

  // 45 saniyede bir sakin özgür gezinme ve canlı hayat döngüsü (sessiz, rahatsız etmeyen)
  mascotRoamTimer = setInterval(() => {
    if (window.innerWidth <= 768) return;
    const bubble = document.getElementById('mascotBubble');
    if (bubble && bubble.style.display !== 'none') return;

    mascotIdleCounter++;

    // Inactive kalırsa tatlı bir uykuya dalar
    if (mascotIdleCounter >= 5 && mascotState === 'idle') {
      mascotState = 'sleeping';
      const btn = document.getElementById('mascotBtn');
      if (btn && !document.getElementById('mascotZzz')) {
        btn.classList.add('sleeping');
        const zzzEl = document.createElement('div');
        zzzEl.id = 'mascotZzz';
        zzzEl.className = 'mascot-sleep-zzz';
        zzzEl.innerHTML = 'zZZ...';
        btn.appendChild(zzzEl);
      }
      return;
    }

    if (mascotState === 'sleeping') return;

    // Sakin hareket: %30 ihtimalle yürü (otomatik modda ses çalmaz)
    const actionRnd = Math.random();
    if (actionRnd < 0.30) {
      triggerRandomMascotWalk(false);
    }
  }, 45000);

  // NOT: 5 saniyelik ilk açılış pop-up'ı kullanıcıyı rahatsız etmemesi için kaldırıldı.
  // Maskot tüm sürümlerde 10 dakikada bir hatırlatma yapar.
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    if (mascotTimer) { clearInterval(mascotTimer); mascotTimer = null; }
    if (mascotRoamTimer) { clearInterval(mascotRoamTimer); mascotRoamTimer = null; }
    closeMascotBubble();
  } else {
    if (!mascotTimer && !mascotRoamTimer) {
      initMascotReminder();
    }
  }
});

function saveMascotIntervalFromSettings() {
  const sel = document.getElementById('settingsMascotInterval');
  if (sel) {
    S.mascotReminderInterval = parseInt(sel.value, 10);
    save();
    initMascotReminder();
    toast(`Maskot hatırlatıcı ${S.mascotReminderInterval > 0 ? S.mascotReminderInterval + ' dakikada bir çalışacak.' : 'kapatıldı.'}`, 's');
  }
}
window.saveMascotIntervalFromSettings = saveMascotIntervalFromSettings;

function appendFabTag(tag) {
  const inp = document.getElementById('qaInp');
  if (!inp) return;
  if (!inp.value.includes(tag)) {
    inp.value = (inp.value + ' ' + tag).trim() + ' ';
  }
  inp.focus();
}

/* ── HIZLI EKLE ── */
function quickAdd() {
  const inp = document.getElementById('qaInp') || document.getElementById('unifiedInput');
  if (!inp) return;
  let v = inp.value.trim(); if (!v) return;
  let cat = activeCat || Object.keys(CATS)[0] || 'diger';
  const m = v.match(/#(\w+)/);
  if (m && CATS[m[1]]) { cat = m[1]; v = v.replace(m[0], '').trim(); }
  if (!v) { toast('Görev adı boş olamaz!', 'e'); return; }
  S.tasks.unshift({
    id: gid(), name: v, cat, pri: 'orta',
    due: '', rep: 'yok', repDays: [], est: '', tag: '', note: '',
    subs: [], done: false, created: new Date().toISOString(), completedAt: null,
  });
  save(); render(); inp.value = ''; toast('Hızlı görev eklendi!', 's');
  closeMascotBubble();
}
(document.getElementById('qaInp') || document.getElementById('unifiedInput'))?.addEventListener('keydown', e => { if (e.key === 'Enter') quickAdd(); });

/* ── FİLTRELER ── */
function filterCat(cat) {
  activeCat = cat;
  const allCard = document.getElementById('allcard');
  if (allCard) allCard.classList.toggle('on', !cat);
  renderCatCards();
  renderTasks();
  updatePgHdr();
}
function setFilter(f, el) {
  statusF = f;
  document.querySelectorAll('.fchip').forEach(c => c.classList.remove('on'));
  el.classList.add('on'); renderTasks();
}

function toggleNamaz(n) {
  const d = today();
  if (!S.prayers[d]) S.prayers[d] = {};
  S.prayers[d][n] = !S.prayers[d][n];
  save(); renderNamaz(); renderNamazProg(); renderDayProg();
  try { updateMobileStats(); } catch(e) {}
}

let _activePrayerForType = null;
function openPrayerTypeModal(pName) {
  _activePrayerForType = pName;
  const title = document.getElementById('ptModalName');
  if (title) title.textContent = (pName ? pName + ' Namazı' : 'Namaz');
  openModal('prayerTypeModal');
}
window.openPrayerTypeModal = openPrayerTypeModal;

function setPrayerType(type) {
  const d = today();
  if (!S.prayers[d]) S.prayers[d] = {};
  if (_activePrayerForType) {
    if (type) {
      S.prayers[d][_activePrayerForType] = type;
    } else {
      delete S.prayers[d][_activePrayerForType];
    }
    save();
    renderNamaz();
    renderNamazProg();
    renderDayProg();
    try { updateMobileStats(); } catch(e) {}
  }
  closeModal('prayerTypeModal');
}
window.setPrayerType = setPrayerType;

/* ── ALIŞKANLIKLAR ── */
function toggleHabit(id, ds) {
  if (!S.habits) S.habits = {};
  if (!S.habits[ds]) S.habits[ds] = {};
  S.habits[ds][id] = !S.habits[ds][id];
  save();
  renderHabits();
  try { updateMobileStats(); } catch(e) {}
  try { renderNamazProg(); } catch(e) {};
  try { renderDayProg(); } catch(e) {}
  if (document.getElementById('v-habits')?.classList.contains('on') || document.getElementById('v-analytics')?.classList.contains('on')) renderAnalytics();
}
function streak(id) {
  let s = 0;
  for (let i = 0; i < 365; i++) {
    if (S.habits[dOff(i)]?.[id]) s++; else break;
  }
  return s;
}

/* ── SAYAÇ ── */
// H-03: Timer Date.now() bazlı — arka plan tab'ında negatife düşmez
const T = { running: false, remain: 1500, total: 1500, iv: null, startedAt: null, pausedRemain: null };
function clearBreakMode() {
  document.querySelectorAll('.focus-mode-btn, .focus-preset-chip, .tpre').forEach(b => b.classList.remove('on'));
  const workBtn = document.getElementById('btnModeWork') || document.querySelector('.focus-mode-btn');
  if (workBtn) workBtn.classList.add('on');
  const chip25 = document.querySelectorAll('.focus-preset-chip')[1];
  if (chip25) chip25.classList.add('on');
  const cancelBtn = document.getElementById('btnCancelBreak');
  if (cancelBtn) cancelBtn.style.display = 'none';

  T.total = 1500;
  T.remain = 1500;
  T.pausedRemain = null;
  clearInterval(T.iv);
  T.running = false;
  T.startedAt = null;

  const statusLbl = document.getElementById('tph');
  if (statusLbl) statusLbl.textContent = '💻 Çalışma Zamanı';
  const btn = document.getElementById('tbstart');
  if (btn) btn.textContent = '▶️ Başlat';
  drawTimer();
  toast('Mola seçimi kaldırıldı, 25d Çalışma moduna dönüldü.', 'i');
}

function setPreset(m, el) {
  const wasAlreadyOn = el && el.classList.contains('on');
  document.querySelectorAll('.focus-mode-btn, .focus-preset-chip, .tpre').forEach(b => b.classList.remove('on'));
  
  if (wasAlreadyOn) {
    clearBreakMode();
    return;
  }
  
  if (el) el.classList.add('on');
  T.total = m * 60;
  T.remain = m * 60;
  const statusLbl = document.getElementById('tph');
  if (statusLbl) statusLbl.textContent = `${m}dk Süre`;
  
  T.pausedRemain = null;
  clearInterval(T.iv);
  T.running = false;
  T.startedAt = null;
  const btn = document.getElementById('tbstart');
  if (btn) btn.textContent = '▶️ Başlat';
  drawTimer();
}

function drawTimer() {
  const m = String(Math.floor(T.remain / 60)).padStart(2, '0');
  const s = String(T.remain % 60).padStart(2, '0');
  const tnum = document.getElementById('tnum');
  if (tnum) tnum.textContent = `${m}:${s}`;
  const ring = document.getElementById('timerRing');
  if (ring) {
    const circ = 2 * Math.PI * 45;
    ring.style.strokeDasharray = circ.toFixed(2);
    ring.style.strokeDashoffset = (circ * (1 - T.remain / T.total)).toFixed(1);
  }
  const cat = document.getElementById('timerCat')?.value;
  const lbl = document.getElementById('timerCatLbl');
  if (lbl) lbl.textContent = cat && CATS[cat] ? `${CATS[cat].i} ${CATS[cat].l}` : '';
}

function setPomodoroMode(mode, mins, el) {
  const wasAlreadyOn = el && el.classList.contains('on');
  if (wasAlreadyOn) {
    clearBreakMode();
    return;
  }

  document.querySelectorAll('.focus-mode-btn, .focus-preset-chip, .tpre').forEach(b => b.classList.remove('on'));
  if (el) el.classList.add('on');
  
  const cancelBtn = document.getElementById('btnCancelBreak');
  if (cancelBtn) {
    cancelBtn.style.display = (mode === 'shortBreak' || mode === 'longBreak') ? 'inline-block' : 'none';
  }

  T.total = mins * 60;
  T.remain = mins * 60;
  const statusLbl = document.getElementById('tph');
  if (statusLbl) {
    if (mode === 'work') statusLbl.textContent = '💻 Çalışma Zamanı';
    else if (mode === 'shortBreak') statusLbl.textContent = '☕ Kısa Mola';
    else if (mode === 'longBreak') statusLbl.textContent = '🌴 Uzun Mola';
  }

  T.pausedRemain = null;
  clearInterval(T.iv);
  T.running = false;
  T.startedAt = null;
  const btn = document.getElementById('tbstart');
  if (btn) btn.textContent = '▶️ Başlat';
  drawTimer();
}
function timerToggle() {
  if (T.running) {
    clearInterval(T.iv); T.running = false;
    T.pausedRemain = T.remain;
    const tb1 = document.getElementById('tbstart'); if (tb1) tb1.textContent = '▶ Devam';
    const tph1 = document.getElementById('tph'); if (tph1) tph1.textContent = 'Duraklatıldı';
  } else {
    T.running = true;
    // Duraklatmadan devam ediyorsak kalan süreyi kullan
    const startRemain = (T.pausedRemain !== null) ? T.pausedRemain : T.remain;
    T.pausedRemain = null;
    T.startedAt = Date.now();
    const snapRemain = startRemain;
    const tb2 = document.getElementById('tbstart'); if (tb2) tb2.textContent = '⏸ Duraklat';
    const tph2 = document.getElementById('tph'); if (tph2) tph2.textContent = 'Odaklanıyor...';
    T.iv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - T.startedAt) / 1000);
      T.remain = Math.max(0, snapRemain - elapsed);
      drawTimer();
      if (T.remain <= 0) {
        clearInterval(T.iv); T.running = false; T.startedAt = null;
        const d = today();
        if (!S.timerSess[d]) S.timerSess[d] = 0; S.timerSess[d]++;
        
        const selectedVal = document.getElementById('timerCat')?.value || '';
        let completedItemName = '';

        if (selectedVal.startsWith('task_')) {
          // 1. Doğrudan seçilen bir görev
          const taskId = selectedVal.replace('task_', '');
          if (taskId.startsWith('quran_')) {
            const surahId = taskId.replace('quran_', '');
            if (!S.quran) S.quran = { routines: {} };
            if (!S.quran.routines) S.quran.routines = {};
            if (!S.quran.routines[d]) S.quran.routines[d] = {};
            S.quran.routines[d][surahId] = true;
            const def = (QURAN_ROUTINES_DEF || []).find(x => x.id === surahId);
            completedItemName = def ? `“${def.title}” okuması` : 'Kuran rutini';
          } else {
            const targetTask = (S.tasks || []).find(t => String(t.id) === taskId || `task_${t.id}` === selectedVal);
            if (targetTask) {
              targetTask.done = true;
              completedItemName = `“${targetTask.title}” görevi`;
              
              // Eğer görev başlığı Kitap veya Kuran içeriyorsa ilgili alışkanlığı da işaretle
              const lowTitle = targetTask.title.toLowerCase();
              if (!S.habits[d]) S.habits[d] = {};
              if (lowTitle.includes('kitap') || targetTask.cat === 'kitap') S.habits[d]['kitap'] = true;
              if (lowTitle.includes('kuran') || targetTask.cat === 'kuran') {
                S.habits[d]['kuran'] = true;
              }
            }
          }
        } else if (selectedVal) {
          // 2. Kategori seçilmiş: İlgili kategorideki ilk tamamlanmamış görevi ve alışkanlığı tamamla
          const catKey = selectedVal;
          const catName = CATS[catKey]?.l || catKey;
          if (!S.catTime[d]) S.catTime[d] = {};
          S.catTime[d][catKey] = (S.catTime[d][catKey] || 0) + T.total;

          // İlgili kategorideki ilk tamamlanmamış görevi tamamla
          const matchingTasks = (S.tasks || []).filter(t => !t.done && (t.cat === catKey || t.title.toLowerCase().includes(catName.toLowerCase())));
          if (matchingTasks.length > 0) {
            matchingTasks[0].done = true;
            completedItemName = `“${matchingTasks[0].title}” görevi`;
          } else {
            completedItemName = `“${catName}” odağı`;
          }

          // Alışkanlıklar (Kitap / Kuran vb.)
          if (!S.habits[d]) S.habits[d] = {};
          if (catKey === 'kitap' || catName.toLowerCase().includes('kitap')) {
            S.habits[d]['kitap'] = true;
          }
          if (catKey === 'kuran' || catName.toLowerCase().includes('kuran')) {
            S.habits[d]['kuran'] = true;
          }
        } else {
          // 3. Kategori seçilmemiş: Başlığında "kitap" veya "kuran" geçen tamamlanmamış görev varsa otomatik tamamla
          const readTasks = (S.tasks || []).filter(t => !t.done && (t.title.toLowerCase().includes('kitap') || t.title.toLowerCase().includes('kuran') || t.title.toLowerCase().includes('okuma')));
          if (readTasks.length > 0) {
            readTasks[0].done = true;
            completedItemName = `“${readTasks[0].title}” görevi`;
            const lowTitle = readTasks[0].title.toLowerCase();
            if (!S.habits[d]) S.habits[d] = {};
            if (lowTitle.includes('kitap')) S.habits[d]['kitap'] = true;
            if (lowTitle.includes('kuran')) S.habits[d]['kuran'] = true;
          }
        }

        save();
        renderTasks();
        renderHabits();
        renderSessions();
        renderCatTimes();
        renderHeaderAssistant();
        renderQuranView();
        renderWeeklyQuranAnalysis();
        renderSelects();

        const tbEnd = document.getElementById('tbstart'); if (tbEnd) tbEnd.textContent = '▶ Başlat';
        const tphEnd = document.getElementById('tph'); if (tphEnd) tphEnd.textContent = 'Tamamlandı 🎉';
        const finalMsg = completedItemName 
          ? `🎉 Odaklanma Seansı Tamamlandı! ${completedItemName} otomatik olarak tamamlandı.`
          : '🎉 Odaklanma Seansı Tamamlandı!';
        toast(finalMsg, 's');
        playSound('done');
        if (S.notifEnabled && Notification.permission === 'granted')
          new Notification('⏱ Pomodoro Tamamlandı', { body: finalMsg, tag: 'pomodoro' });
      }
    }, 250);
  }
}
function timerReset() {
  clearInterval(T.iv); T.running = false; T.remain = T.total;
  T.startedAt = null; T.pausedRemain = null;
  const btn = document.getElementById('tbstart');
  if (btn) btn.textContent = '▶️ Başlat';
  const lbl = document.getElementById('tph');
  if (lbl) lbl.textContent = 'Hazır'; drawTimer();
}

window.toggleTaskFocusPanel = function() {
  const panel = document.getElementById('tasksFocusPanel');
  const btn = document.getElementById('btnFocusPanelToggle');
  if (!panel) return;
  
  const isCurrentlyOpen = panel.classList.contains('show') || (panel.style.display !== 'none' && panel.style.display !== '');
  
  if (isCurrentlyOpen) {
    panel.classList.remove('show');
    panel.style.display = 'none';
    if (btn) btn.classList.remove('on');
  } else {
    panel.classList.add('show');
    panel.style.display = 'grid';
    if (btn) btn.classList.add('on');
    renderCatTimes();
    renderSessions();
    drawTimer();
  }
};

function renderCatTimes() {
  const container = document.getElementById('catTimes');
  if (!container) return;

  const d = today();
  const times = S.catTime[d] || {};
  
  let maxSecs = 1;
  Object.values(times).forEach(sec => {
    if (sec > maxSecs) maxSecs = sec;
  });

  const catEntries = Object.entries(CATS);
  if (catEntries.length === 0) {
    container.innerHTML = `<div style="font-size:0.75rem; color:var(--tx3); text-align:center; padding:10px;">Henüz odaklanma kaydı yok</div>`;
    return;
  }

  container.innerHTML = catEntries.map(([key, cat]) => {
    const sec = times[key] || 0;
    const mins = Math.floor(sec / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    
    let timeStr = '0 dk';
    if (hrs > 0) {
      timeStr = `${hrs}sa ${remMins}dk`;
    } else if (mins > 0) {
      timeStr = `${mins}dk`;
    }

    const pct = sec > 0 ? Math.min(100, Math.max(10, Math.round((sec / maxSecs) * 100))) : 0;
    const isSpent = sec > 0;
    const catColor = safeColor(cat.c);

    return `
      <div style="background:var(--sf2); border:1px solid ${isSpent ? catColor : 'var(--bd)'}; border-radius:10px; padding:8px 12px; margin-bottom:8px; display:flex; flex-direction:column; gap:6px; transition:all 0.2s ease;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.1rem; background:${cat.bg || 'var(--sf)'}; width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center;">${esc(cat.i)}</span>
            <span style="font-size:0.84rem; font-weight:800; color:${catColor};">${esc(cat.l)}</span>
          </div>
          <span style="font-size:0.76rem; font-weight:900; font-family:'JetBrains Mono', monospace; padding:3px 10px; border-radius:8px; background:${isSpent ? catColor + '22' : 'var(--sf)'}; color:${isSpent ? catColor : 'var(--tx3)'}; border:1px solid ${isSpent ? catColor : 'var(--bd)'};">
            ⚡ ${timeStr}
          </span>
        </div>
        <div style="height:6px; background:var(--bd); border-radius:4px; overflow:hidden; margin-top:2px;">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, ${catColor}, var(--gold)); border-radius:4px; transition:width 0.4s ease;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderSessions() {
  const n = S.timerSess[today()] || 0;
  const sdots = document.getElementById('sdots');
  if (sdots) {
    sdots.innerHTML =
      Array.from({ length: 4 }, (_, i) => `<div class="sdot${i < n ? ' done' : ''}"></div>`).join('');
  }
}

function startFocusForTask(taskId, defaultMins = 30) {
  showView('tasks');
  const panel = document.getElementById('tasksFocusPanel');
  if (panel && panel.style.display === 'none') {
    if (typeof toggleTaskFocusPanel === 'function') toggleTaskFocusPanel();
    else panel.style.display = 'grid';
  }
  
  renderSelects();
  const sel = document.getElementById('timerCat');
  if (sel) {
    sel.value = `task_${taskId}`;
  }
  
  const btn30 = Array.from(document.querySelectorAll('.tpre')).find(b => b.textContent.includes('30'));
  if (btn30) {
    setPreset(defaultMins, btn30);
  } else {
    timerReset();
    T.pausedRemain = null;
    T.remain = defaultMins * 60;
    T.total = defaultMins * 60;
    drawTimer();
  }

  if (!T.running) {
    timerToggle();
  }
  
  toast(`⏱ Odaklanma sayacı başlatıldı (${defaultMins} dk)`, 'i');
}
window.startFocusForTask = startFocusForTask;

/* ── GÖRÜNÜM GEÇER ── */
window.showView = function (v, el) {
  document.querySelectorAll('.view').forEach(x => x.classList.remove('on'));
  document.getElementById('v-' + v)?.classList.add('on');

  // Sync menu items in vertical sidebar menu, mobile nav, and header (menu-item-vertical, menu-item, mb-nav-item)
  document.querySelectorAll('.menu-item-vertical, .menu-item, .mb-nav-item').forEach(t => {
    const oc = t.getAttribute('onclick') || '';
    const isTarget = oc.includes(`'${v}'`);
    t.classList.toggle('on', isTarget);
    if (typeof t.blur === 'function') {
      try { t.blur(); } catch (e) {}
    }
  });

  if (v === 'analytics' || v === 'habits') { renderHabits(); renderAnalytics(); renderWeeklyIbadet(); renderWeeklyZikirAnalysis(); renderWeeklyQuranAnalysis(); }
  if (v === 'calendar') { renderCalendar(); }
  if (v === 'prayers') { renderNamaz(); }
  if (v === 'zikir') { renderEsma(); renderDailyZikir(); renderZikirView(); startZikirSlideAutoPlay(); }
  if (v === 'tasks') { renderCatCards(); renderTasks(); renderSessions(); renderCatTimes(); drawTimer(); }
  if (v === 'quran') { renderQuranView(); }
  if (v === 'dua') { renderDuaView(); }
  if (v === 'hadis') { renderHadisView(); }
  if (v === 'books') { renderBooksView(); }
  if (v === 'komutrotasi') { renderKomutRotasiView(); }
  if (v === 'teacher') { renderTeacherView(); }
  if (v === 'finance') { renderFinanceView(); }

  renderHeaderAssistant();
};
function showView(v, el) { window.showView(v, el); }

function toggleSidebarExtraMenu(btn) {
  const group = btn.closest('.sidebar-collapsible-group');
  if (!group) return;
  const content = group.querySelector('.sidebar-extra-menu-content');
  const arr = btn.querySelector('.sb-arr');
  if (!content) return;

  const isClosed = content.style.display === 'none' || !content.style.display;
  content.style.display = isClosed ? 'flex' : 'none';
  if (arr) arr.style.transform = isClosed ? 'rotate(90deg)' : 'rotate(0deg)';
}

/* ── AKILLI TAHTA MODU VE TAM EKRAN ── */
function toggleSmartboardMode() {
  document.body.classList.toggle('smartboard-mode');
  const isSb = document.body.classList.contains('smartboard-mode');
  safeStorage.setItem('mikat_smartboard', isSb ? '1' : '0');
  toast(isSb ? '🖥️ Akıllı Tahta Modu Açıldı (Büyük Yazı/Buton)' : '💻 Normal Ekran Moduna Geçildi', 'i');
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      toast('⛶ Tam Ekran Modu', 's');
    }).catch(err => {
      toast('Tam ekran modu açılamadı', 'e');
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function toggleMenuDropdown() {
  const dp = document.getElementById('hamburgerDropdown');
  if (dp) dp.classList.toggle('on');
}

function selectMenu(view, btn) {
  showView(view);
  document.querySelectorAll('.menu-item').forEach(x => x.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('hamburgerDropdown')?.classList.remove('on');
}

// Close dropdown on outside click
window.addEventListener('click', function (e) {
  if (!e.target.closest('.hamburger-btn') && !e.target.closest('.hamburger-dropdown')) {
    document.getElementById('hamburgerDropdown')?.classList.remove('on');
  }
});

/* ── KATEGORİ YÖNETİMİ ── */
function openSettings() {
  renderSettings();
  const generalBtn = document.getElementById('stab-general');
  if (generalBtn) switchSettingsTab('general', generalBtn);
  document.getElementById('settingsModal')?.classList.add('on');
}

function switchSettingsTab(tabKey, btn) {
  document.querySelectorAll('.settings-tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById(`setTab-${tabKey}`);
  if (target) target.style.display = 'flex';

  const tabContainer = document.querySelector('#settingsModal .fbar-segmented');
  if (tabContainer) {
    tabContainer.querySelectorAll('.fchip').forEach(b => b.classList.remove('on'));
  }
  if (btn) btn.classList.add('on');
}

function saveNamazCityFromSettings() {
  const inp = document.getElementById('namazCityInput');
  if (inp && inp.value.trim()) {
    S.namazCity = inp.value.trim();
    save();
    try { localStorage.removeItem('mikat-prayer-cache'); } catch (e) {}
    fetchPrayerTimes();
    toast('Namaz şehri kaydedildi & vakitler güncellendi: ' + S.namazCity, 's');
  }
}

function saveUserNameFromSettings() {
  const inp = document.getElementById('userNameInput');
  if (inp && inp.value.trim()) {
    S.userName = inp.value.trim();
    save();
    toast('Kullanıcı adı kaydedildi: ' + S.userName, 's');
  }
}

function updateSettingsThemeNotifUI() {
  const isDark = document.body.classList.contains('dark');
  const themeLbl = document.getElementById('currentThemeLabel');
  if (themeLbl) {
    themeLbl.textContent = isDark ? 'Mevcut: Koyu Tema 🌙' : 'Mevcut: Açık Tema ☀️';
  }

  const notifToggle = document.getElementById('settingsNotifToggle');
  const notifLbl = document.getElementById('currentNotifLabel');
  if (notifToggle) {
    notifToggle.checked = !!S.notifEnabled;
  }
  if (notifLbl) {
    notifLbl.textContent = S.notifEnabled ? 'Bildirimler Açık ✅' : 'Bildirimler Kapalı ⚪';
  }
}

function renderSettings() {
  updateSettingsThemeNotifUI();
  const cityInp = document.getElementById('namazCityInput');
  if (cityInp) cityInp.value = S.namazCity || 'Konya';

  const userInp = document.getElementById('userNameInput');
  if (userInp) userInp.value = S.userName || '';

  const mascotSel = document.getElementById('settingsMascotInterval');
  if (mascotSel) {
    mascotSel.value = S.mascotReminderInterval !== undefined ? S.mascotReminderInterval : 10;
  }

  const autoB = document.getElementById('autoBackupToggle');
  if (autoB) autoB.checked = !!S.autoBackup;

  const status = document.getElementById('backupStatus');
  if (status) {
    status.textContent = S.lastBackup
      ? 'Son yedek: ' + new Date(S.lastBackup).toLocaleString('tr-TR')
      : 'Henüz bir yedekleme yapılmadı.';
  }
  const coord = document.getElementById('locationStatus');
  if (coord) {
    coord.textContent = S.lat && S.lng
      ? `Konum: ${S.lat.toFixed(4)}, ${S.lng.toFixed(4)}`
      : 'Konum kaydedilmedi.';
  }

  // Seçmeli Modüller
  if (!S.customMenus) S.customMenus = { komutrotasi: false, teacher: false, books: false };
  if (!S.customMenuNames) S.customMenuNames = { komutrotasi: '🌐 Komut Rotası', teacher: '🏫 Bilişimci Hocam', books: '📚 Kitaplık' };

  // Hatalı veya çakışan modül isimlerini düzelt
  const bLowerR = (S.customMenuNames.books || '').toLowerCase();
  if (!bLowerR || !bLowerR.includes('kitap') || bLowerR.includes('bilisim') || bLowerR.includes('bilişim') || bLowerR.includes('hocam') || bLowerR.includes('test')) {
    S.customMenuNames.books = '📚 Kitaplık';
    save();
  }
  if (S.customMenuNames.komutrotasi && S.customMenuNames.komutrotasi.toLowerCase().includes('test')) S.customMenuNames.komutrotasi = '🌐 Komut Rotası';
  if (S.customMenuNames.teacher && S.customMenuNames.teacher.toLowerCase().includes('test')) S.customMenuNames.teacher = '🏫 Bilişimci Hocam';

  const toggleKomut = document.getElementById('menuToggleKomut');
  if (toggleKomut) toggleKomut.checked = S.customMenus.komutrotasi === true;
  const toggleTeacher = document.getElementById('menuToggleTeacher');
  if (toggleTeacher) toggleTeacher.checked = S.customMenus.teacher === true;
  const toggleBooks = document.getElementById('menuToggleBooks');
  if (toggleBooks) toggleBooks.checked = S.customMenus.books === true;

  const nameKomut = document.getElementById('menuNameKomut');
  if (nameKomut) nameKomut.value = S.customMenuNames.komutrotasi || '🌐 Komut Rotası';
  const nameTeacher = document.getElementById('menuNameTeacher');
  if (nameTeacher) nameTeacher.value = S.customMenuNames.teacher || '🏫 Bilişimci Hocam';
  const nameBooks = document.getElementById('menuNameBooks');
  if (nameBooks) nameBooks.value = S.customMenuNames.books || '📚 Kitaplık';
}

function applyCustomMenusUI() {
  if (!S.customMenus) S.customMenus = { komutrotasi: false, teacher: false, books: false };
  if (!S.customMenuNames) S.customMenuNames = { komutrotasi: '🌐 Komut Rotası', teacher: '🏫 Bilişimci Hocam', books: '📚 Kitaplık' };
  
  // Hatalı veya çakışan modül isimlerini düzelt
  const bLowerA = (S.customMenuNames.books || '').toLowerCase();
  if (!bLowerA || !bLowerA.includes('kitap') || bLowerA.includes('bilisim') || bLowerA.includes('bilişim') || bLowerA.includes('hocam') || bLowerA.includes('test')) {
    S.customMenuNames.books = '📚 Kitaplık';
  }
  if (S.customMenuNames.komutrotasi && S.customMenuNames.komutrotasi.toLowerCase().includes('test')) S.customMenuNames.komutrotasi = '🌐 Komut Rotası';
  if (S.customMenuNames.teacher && S.customMenuNames.teacher.toLowerCase().includes('test')) S.customMenuNames.teacher = '🏫 Bilişimci Hocam';

  const defNames = {
    komutrotasi: '🌐 Komut Rotası',
    teacher: '🏫 Bilişimci Hocam',
    books: '📚 Kitaplık'
  };

  ['komutrotasi', 'teacher', 'books'].forEach(key => {
    const isShow = S.customMenus[key] === true;
    const customName = S.customMenuNames[key] || defNames[key];

    // Sol panel, Mobil drawer ve Alt gezinti menüsü görünürlük kontrolü
    const btns = document.querySelectorAll(`[data-view="${key}"]`);
    btns.forEach(btn => {
      btn.style.display = isShow ? 'flex' : 'none';
      if (btn.classList.contains('menu-item-vertical')) {
        btn.textContent = customName;
      }
    });

    // Sayfa başlığını güncelle
    const pageTitleEl = document.querySelector(`#v-${key} .page-title`);
    if (pageTitleEl) {
      pageTitleEl.textContent = customName;
    }
    
    // Eğer şu an aktif olan görünüm gizleniyorsa Takvim'e yönlendir
    const activeViewEl = document.querySelector('.view.on');
    if (!isShow && activeViewEl && activeViewEl.id === `v-${key}`) {
      const calBtn = document.querySelector('.menu-item-vertical');
      showView('calendar', calBtn);
    }
  });
}

function toggleCustomMenu(key, enabled) {
  if (!S.customMenus) S.customMenus = { komutrotasi: false, teacher: false, books: false };
  S.customMenus[key] = !!enabled;
  save();
  applyCustomMenusUI();
  renderSettings();
  toast(enabled ? 'Modül menüye eklendi 👁️' : 'Modül menüden kaldırıldı 🙈', 's');
}

function updateCustomMenuName(key, newName) {
  if (!S.customMenuNames) S.customMenuNames = { komutrotasi: '🌐 Komut Rotası', teacher: '🏫 Bilişimci Hocam', finance: '💰 Finans & Bütçe', books: '📚 Kitaplık' };
  const trimmed = (newName || '').trim();
  if (trimmed) {
    S.customMenuNames[key] = trimmed;
    save();
    applyCustomMenusUI();
    toast('Menü ismi güncellendi: ' + trimmed, 's');
  }
}
function openCatManager() {
  editCatKey = null; renderColorPresets(); renderCatList(); resetCatForm();
  document.getElementById('catModal')?.classList.add('on');
}
function renderColorPresets() {
  const el = document.getElementById('colorPresets');
  if (el) {
    el.innerHTML = COLOR_PALETTE.map((c, i) =>
      `<div class="color-preset${selectedColor.hex === c.hex ? ' sel' : ''}" style="background:${c.hex}" onclick="selectColor(${i})" title="${c.hex}"></div>`
    ).join('');
  }
}
function selectColor(i) { selectedColor = COLOR_PALETTE[i]; renderColorPresets(); }
function renderCatList() {
  const el = document.getElementById('catList');
  if (el) {
    el.innerHTML = Object.entries(CATS).map(([k, c]) => `
    <div class="cat-item">
      <div class="cat-item-ico">${esc(c.i)}</div>
      <div style="width:11px;height:11px;border-radius:3px;background:${safeColor(c.c)};flex-shrink:0;border:2px solid var(--bd)"></div>
      <div class="cat-item-info">
        <div class="cat-item-name">${esc(c.l)}</div>
        <div class="cat-item-key">#${esc(k)}</div>
      </div>
      <div class="cat-item-acts">
        <button class="cat-act-btn" onclick="editCat('${k}')" title="Düzenle">✏️</button>
        ${Object.keys(CATS).length > 1 ? `<button class="cat-act-btn del" onclick="deleteCat('${k}')" title="Sil">🗑️</button>` : ''}
      </div>
    </div>`
    ).join('');
  }
}
function editCat(key) {
  editCatKey = key;
  const c = CATS[key];
  if (!c) return;
  const ico = document.getElementById('catIco'); if (ico) ico.value = c.i;
  const name = document.getElementById('catName'); if (name) name.value = c.l;
  const keyEl = document.getElementById('catKey');
  if (keyEl) { keyEl.value = key; keyEl.disabled = true; }
  const title = document.getElementById('catFormTitle'); if (title) title.textContent = 'Kategori Düzenle: ' + c.l;
  const idx = COLOR_PALETTE.findIndex(p => p.hex === c.c);
  selectedColor = idx >= 0 ? COLOR_PALETTE[idx] : { hex: c.c, bg: c.bg };
  renderColorPresets();
}
function resetCatForm() {
  editCatKey = null;
  ['catIco', 'catName', 'catKey'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const keyEl = document.getElementById('catKey'); if (keyEl) keyEl.disabled = false;
  const title = document.getElementById('catFormTitle'); if (title) title.textContent = 'Yeni Kategori Ekle';
  selectedColor = COLOR_PALETTE[0]; renderColorPresets();
}
function saveCat() {
  const ico = document.getElementById('catIco').value.trim() || '📌';
  const name = document.getElementById('catName').value.trim();
  let key = document.getElementById('catKey').value.trim()
    .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (!name) { toast('Kategori adı boş olamaz', 'e'); return; }
  if (!key && !editCatKey) {
    key = name.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9_]/g, '').slice(0, 20);
  }
  if (!key) { toast('Geçerli bir anahtar girin', 'e'); return; }
  if (!editCatKey && CATS[key]) { toast('Bu anahtar zaten kullanılıyor: #' + key, 'e'); return; }
  const hex = selectedColor.hex, bg = selectedColor.bg || hex + '20';
  if (editCatKey) {
    CATS[editCatKey] = { l: name, i: ico, c: hex, bg };
    toast('Kategori güncellendi', 's');
  } else {
    CATS[key] = { l: name, i: ico, c: hex, bg };
    toast('Kategori eklendi: #' + key, 's');
  }
  save(); render(); renderSelects(); renderCatList(); resetCatForm();
}
function deleteCat(key) {
  if (Object.keys(CATS).length <= 1) { toast('En az 1 kategori olmalı', 'e'); return; }
  const fallback = Object.keys(CATS).find(k => k !== key) || 'diger';
  showConfirm(
    '🗑️ Kategoriyi Sil',
    `“${CATS[key].l}” silinsin mi?`,
    `Bu kategorideki görevler “${CATS[fallback]?.l}” kategorisine taşınır.`,
    '🗑️ Sil',
    () => {
      S.tasks.forEach(t => { if (t.cat === key) t.cat = fallback; });
      delete CATS[key];
      save(); render(); renderSelects(); renderCatList();
      toast('Kategori silindi', 'i');
    },
    true
  );
}

/* ── RENDER: SELECT'LER ── */
function renderSelects() {
  const opts = Object.entries(CATS).map(([k, c]) =>
    `<option value="${esc(k)}">${esc(c.i)} ${esc(c.l)}</option>`
  ).join('');

  const fCatEl = document.getElementById('fCat');
  if (fCatEl) fCatEl.innerHTML = opts;

  const timerCatEl = document.getElementById('timerCat');
  if (timerCatEl) {
    let tOpts = '<option value="">— Otomatik Kategori veya Görev Seç —</option>';
    
    // 1. Kategoriler
    tOpts += '<optgroup label="📂 Kategori Odakları">' + opts + '</optgroup>';
    
    // 2. Bugünün Tamamlanmamış Görevleri (Otomatik Bağlama İçin)
    const uncompletedTasks = (S.tasks || []).filter(t => !t.done && isTaskForToday(t));
    if (uncompletedTasks.length > 0) {
      tOpts += '<optgroup label="📋 Görevlerim (Tamamlanınca Otomatik İşaretlenir)">';
      uncompletedTasks.forEach((t, idx) => {
        const catObj = CATS[t.cat] || {};
        const tId = t.id !== undefined ? t.id : idx;
        tOpts += `<option value="task_${tId}">🎯 ${esc(t.title)} (${esc(catObj.l || 'Genel')})</option>`;
      });
      tOpts += '</optgroup>';
    }
    
    timerCatEl.innerHTML = tOpts;
  }

  const batchCatEl = document.getElementById('batchDefaultCat');
  if (batchCatEl) batchCatEl.innerHTML = opts;

  const bulkCatEl = document.getElementById('bulkCatSel');
  if (bulkCatEl) bulkCatEl.innerHTML = '<option value="" disabled selected>📂 Kategori Değiştir...</option>' + opts;

  const filterSelEl = document.getElementById('catFilterSel');
  if (filterSelEl) {
    let fOpts = `<option value="" ${!activeCat ? 'selected' : ''}>📂 Tüm Kategoriler (${S.tasks.length})</option>`;
    Object.entries(CATS).forEach(([k, c]) => {
      const pend = S.tasks.filter(t => t.cat === k && !t.done).length;
      fOpts += `<option value="${esc(k)}" ${activeCat === k ? 'selected' : ''}>${esc(c.i)} ${esc(c.l)} (${pend})</option>`;
    });
    filterSelEl.innerHTML = fOpts;
  }
}

/* ── RENDER: KATEGORİ KARTLARI / DÜŞEN MENÜ ── */
function renderCatCards() {
  const allNumEl = document.getElementById('allnum');
  if (allNumEl) allNumEl.textContent = S.tasks.length;

  const selEl = document.getElementById('catFilterSel');
  if (selEl) {
    let opts = `<option value="" ${!activeCat ? 'selected' : ''}>📂 Tüm Kategoriler (${S.tasks.length})</option>`;
    Object.entries(CATS).forEach(([k, c]) => {
      const tasks = S.tasks.filter(t => t.cat === k);
      const pend = tasks.filter(t => !t.done).length;
      opts += `<option value="${k}" ${activeCat === k ? 'selected' : ''}>${c.i} ${c.l} (${pend})</option>`;
    });
    selEl.innerHTML = opts;
  }

  const cardsEl = document.getElementById('ccards');
  if (cardsEl) {
    cardsEl.innerHTML = Object.entries(CATS).map(([k, c]) => {
      const tasks = S.tasks.filter(t => t.cat === k);
      const pend = tasks.filter(t => !t.done).length;
      const isSel = activeCat === k;
      return `<div class="cat-pill${isSel ? ' on' : ''}" data-cat="${k}" onclick="filterCat('${k}')" style="${isSel ? `border-color:${safeColor(c.c)};background:${safeColor(c.bg)};color:${safeColor(c.c)};` : ''}">
        <span class="cat-pill-ico">${esc(c.i)}</span>
        <span class="cat-pill-nm" style="${isSel ? `color:${safeColor(c.c)};` : ''}">${esc(c.l)}</span>
        <span class="cat-pill-n" style="${isSel ? `background:${safeColor(c.c)};color:${safeColor(c.bg)};` : `background:${safeColor(c.bg)};color:${safeColor(c.c)};`}">${pend}</span>
        <button class="ccard-act" onclick="event.stopPropagation();openCatManagerTo('${k}')" style="background:none;border:none;margin-left:4px;font-size:0.6rem;cursor:pointer;padding:0;" title="Düzenle">✏️</button>
      </div>`;
    }).join('');
  }
}
function openCatManagerTo(key) { openCatManager(); setTimeout(() => editCat(key), 50); }

/* ── RENDER: GÜNLÜK PANEL ── */
function renderDayProg() {
  const tdTasks = S.tasks.filter(isTaskForToday);
  const total = tdTasks.length, done = tdTasks.filter(t => t.done).length;
  const pct = total ? Math.round(done / total * 100) : 0;

  // Mood ve oran güncelleme (Ticker Sağ Köşe)
  const mood = ['😴', '😐', '🙂', '😊', '🌟', '🔥'][Math.min(5, Math.floor(pct / 20))];
  const tickerMoodEl = document.getElementById('tickerMood');
  if (tickerMoodEl) {
    tickerMoodEl.innerHTML = `<span>${mood}</span> <strong style="color:var(--teal);">${pct}%</strong>`;
  }

  const itemsHtml = Object.entries(CATS).map(([k, c]) => {
    const tasks = tdTasks.filter(t => t.cat === k);
    const d = tasks.filter(t => t.done).length;
    return `<div class="ticker-item">
      <span>${esc(c.i)}</span>
      <span style="font-weight:700; color:var(--tx);">${esc(c.l)}:</span>
      <span style="color:var(--gold); font-weight:700;">${d}/${tasks.length}</span>
    </div>`;
  }).join('');

  // Ticker içeriğini sadece değişmişse güncelle — animasyonun sıfırlanmasını önler
  const tickerContainer = document.getElementById('dpbarsTicker');
  if (tickerContainer) {
    const newHtml = `<div class="ticker-items-container">${itemsHtml}${itemsHtml}${itemsHtml}</div>`;
    // Önceki içerikle karşılaştır; değişmişse güncelle
    if (tickerContainer.getAttribute('data-last') !== itemsHtml) {
      tickerContainer.setAttribute('data-last', itemsHtml);
      tickerContainer.innerHTML = newHtml;
    }
  }

  renderGeneralStatus(tdTasks);
}
function renderGeneralStatus(tdTasks) {
  const box = document.getElementById('genelDurum'); if (!box) return;
  const td = today();
  const total = S.tasks.length;
  const done = S.tasks.filter(t => t.done).length;
  const overdue = S.tasks.filter(t => t.due && t.due < td && !t.done).length;
  const rep = S.tasks.filter(t => t.rep && t.rep !== 'yok').length;
  box.innerHTML = `
    <div class="gd-row"><span>📅 Bugünlük</span><b style="color:var(--gold)">${tdTasks.filter(t => t.done).length}/${tdTasks.length}</b></div>
    <div class="gd-row"><span>📌 Toplam</span><b>${done}/${total}</b></div>
    <div class="gd-row"><span>⚠️ Geciken</span><b style="color:var(--rose)">${overdue}</b></div>
    <div class="gd-row"><span>🔁 Tekrarlanan</span><b>${rep}</b></div>`;
}

/* ── RENDER: NAMAZ ── */
function renderNamaz() {
  const d = today();
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let curIdx = PRAYERS.length - 1;
  PRAYERS.forEach((p, i) => {
    const [h, m] = p.t.split(':').map(Number);
    if (nowMin >= h * 60 + m) curIdx = i;
  });
  const done = PRAYERS.filter(p => S.prayers[d]?.[p.n]).length;
  const countEl = document.getElementById('namazCnt');
  if (countEl) countEl.textContent = `${done}/5`;

  const hoverTitleEl = document.getElementById('dialHoverTitle');
  if (hoverTitleEl && (!hoverTitleEl.style.opacity || hoverTitleEl.style.opacity === '1')) {
    hoverTitleEl.innerHTML = getDefaultDialTitle();
  }

  // ── Vakit Kadranı Güncelleme (Geliştirilmiş) ──
  const dialSectors = document.getElementById('dialSectors');
  const dialSeparators = document.getElementById('dialSeparators');
  const dialHours = document.getElementById('dialHours');
  const dialMarkers = document.getElementById('dialMarkers');
  const dialGlow = document.getElementById('dialGlow');

  if (dialSectors && PRAYERS && PRAYERS.length === 5) {
    const timeToMin = t => t.split(':').map(Number).reduce((a, b) => a * 60 + b);

    // Vakitleri dakikaya çevir
    const imsakMin = IMSAK_TIME ? timeToMin(IMSAK_TIME) : null;
    const fMin = timeToMin(PRAYERS[0].t);
    const oMin = timeToMin(PRAYERS[1].t);
    const iMin = timeToMin(PRAYERS[2].t);
    const aMin = timeToMin(PRAYERS[3].t);
    const yMin = timeToMin(PRAYERS[4].t);
    const sunMin = SUNRISE_TIME ? timeToMin(SUNRISE_TIME) : fMin + 50;

    const minToTime = m => {
      const h = Math.floor(((m % 1440) + 1440) % 1440 / 60);
      const min = Math.floor(((m % 1440) + 1440) % 1440 % 60);
      return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
    };

    // Sabah namazı merkezli göreli dakika (kadranın 0 noktası sol kenar = Sabah vakti)
    const getRel = m => ((m - fMin) % 1440 + 1440) % 1440;

    // Mevcut aktif sektörü bul
    const nowTotal = now.getHours() * 60 + now.getMinutes();
    let activeSectorName = '';
    if (imsakMin !== null && nowTotal >= imsakMin && nowTotal < fMin) activeSectorName = 'İmsak';
    else if (nowTotal >= fMin && nowTotal < sunMin) activeSectorName = 'Sabah';
    else if (nowTotal >= sunMin && nowTotal < sunMin + 45) activeSectorName = 'Kerahet';
    else if (nowTotal >= sunMin + 45 && nowTotal < sunMin + 90) activeSectorName = 'İşrak';
    else if (nowTotal >= sunMin + 90 && nowTotal < oMin - 20) activeSectorName = 'Kuşluk';
    else if (nowTotal >= oMin - 20 && nowTotal < oMin) activeSectorName = 'Kerahet';
    else if (nowTotal >= oMin && nowTotal < iMin) activeSectorName = 'Öğle';
    else if (nowTotal >= iMin && nowTotal < aMin - 45) activeSectorName = 'İkindi';
    else if (nowTotal >= aMin - 45 && nowTotal < aMin) activeSectorName = 'Kerahet';
    else if (nowTotal >= aMin && nowTotal < aMin + 25) activeSectorName = 'Akşam';
    else if (nowTotal >= aMin + 25 && nowTotal < yMin) activeSectorName = 'Evvabîn';
    else if (nowTotal >= yMin && nowTotal < yMin + 120) activeSectorName = 'Yatsı';
    else activeSectorName = 'Teheccüd';

    // Sektör tanımları — zengin renkler, aktif sektör öne çıkar
    const sectors = [
      { name: 'İmsak', s: imsakMin !== null ? imsakMin : fMin - 60, e: fMin, c: '#1e0a3c', stroke: '#7c3aed', glow: '#7c3aed' },
      { name: 'Sabah', s: fMin, e: sunMin, c: '#3d2600', stroke: '#f59e0b', glow: '#f59e0b' },
      { name: 'Kerahet', s: sunMin, e: sunMin + 45, c: '#3d0f0f', stroke: '#ef4444', glow: '#ef4444' },
      { name: 'İşrak', s: sunMin + 45, e: sunMin + 90, c: '#3a2900', stroke: '#fde047', glow: '#fde047' },
      { name: 'Kuşluk', s: sunMin + 90, e: oMin - 20, c: '#2e1a00', stroke: '#fb923c', glow: '#fb923c' },
      { name: 'Kerahet', s: oMin - 20, e: oMin, c: '#3d0f0f', stroke: '#ef4444', glow: '#ef4444' },
      { name: 'Öğle', s: oMin, e: iMin, c: '#002920', stroke: '#10b981', glow: '#10b981' },
      { name: 'İkindi', s: iMin, e: aMin - 45, c: '#2e1200', stroke: '#f97316', glow: '#f97316' },
      { name: 'Kerahet', s: aMin - 45, e: aMin, c: '#3d0f0f', stroke: '#ef4444', glow: '#ef4444' },
      { name: 'Akşam', s: aMin, e: aMin + 25, c: '#2d0520', stroke: '#ec4899', glow: '#ec4899' },
      { name: 'Evvabîn', s: aMin + 25, e: yMin, c: '#1a073d', stroke: '#a78bfa', glow: '#a78bfa' },
      { name: 'Yatsı', s: yMin, e: yMin + 120, c: '#060f28', stroke: '#60a5fa', glow: '#60a5fa' },
      { name: 'Teheccüd', s: yMin + 120, e: imsakMin !== null ? imsakMin : fMin, c: '#0f0620', stroke: '#818cf8', glow: '#818cf8' },
    ];

    // Sektör yolu çiz (dolgu + kenar çizgisi ile)
    // glowColor: aktif sektörde parlama rengi (döngüden iletilir)
    const drawAnnularSector = (cx, cy, r_in, r_out, startMin, endMin, fillColor, strokeColor, glowColor, name, isActive) => {
      let rs = getRel(startMin);
      let re = getRel(endMin);
      if (re <= rs) re += 1440;
      if ((re - rs) <= 0) return '';

      const startAngle = 180 + (rs / 1440) * 180;
      const endAngle = 180 + (re / 1440) * 180;
      const startRad = startAngle * Math.PI / 180;
      const endRad = endAngle * Math.PI / 180;
      const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

      const x1o = cx + r_out * Math.cos(startRad), y1o = cy + r_out * Math.sin(startRad);
      const x2o = cx + r_out * Math.cos(endRad), y2o = cy + r_out * Math.sin(endRad);
      const x1i = cx + r_in * Math.cos(startRad), y1i = cy + r_in * Math.sin(startRad);
      const x2i = cx + r_in * Math.cos(endRad), y2i = cy + r_in * Math.sin(endRad);

      const durationMins = endMin >= startMin ? endMin - startMin : endMin + 1440 - startMin;
      const dh = Math.floor(durationMins / 60), dm = durationMins % 60;
      const durStr = (dh ? `${dh}sa ` : '') + (dm || !dh ? `${dm}dk` : '');
      const rangeStr = `${minToTime(startMin)}-${minToTime(endMin)} (${durStr.trim()})`;

      // Aktif sektörde güçlü parlama efekti
      const activeStyle = isActive
        ? `opacity:1; filter:brightness(1.7) drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 12px ${glowColor}40);`
        : 'opacity:0.72; filter:brightness(1.0);';

      // rangeStr için HTML attribute güvenliği: tek tırnak sorununu önlemek için da ta-* attr kullan
      const path = `<path
        d="M ${x1o} ${y1o} A ${r_out} ${r_out} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${r_in} ${r_in} 0 ${largeArc} 0 ${x1i} ${y1i} Z"
        fill="${fillColor}"
        stroke="${strokeColor}"
        stroke-width="${isActive ? 1.6 : 0.7}"
        style="cursor:pointer; transition: opacity 0.25s, filter 0.25s; ${activeStyle}"
        data-sector="${name}" data-range="${rangeStr}" data-color="${strokeColor}"
        onmouseenter="window.setDialHoverTitle(this.dataset.sector,this.dataset.range,this.dataset.color)"
        onmouseleave="window.clearDialHoverTitle()"
        ontouchstart="window.setDialHoverTitle(this.dataset.sector,this.dataset.range,this.dataset.color);event.preventDefault()"
        ontouchend="setTimeout(()=>window.clearDialHoverTitle(),2500)"
      />`;
      return path;
    };

    // Sektör etiketi — kadran içinde yazı gösterilmiyor (hover tooltip ile gösteriliyor)
    const drawSectorLabel = () => '';

    // Ayırıcı çizgiler
    const drawSeparatorLine = (min, color = 'rgba(255,255,255,0.18)', w = 1) => {
      const rMin = getRel(min);
      const angle = 180 + (rMin / 1440) * 180;
      const rad = angle * Math.PI / 180;
      return `<line
        x1="${100 + 44 * Math.cos(rad)}" y1="${110 + 44 * Math.sin(rad)}"
        x2="${100 + 82 * Math.cos(rad)}" y2="${110 + 82 * Math.sin(rad)}"
        stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
    };

    // Namaz vakti işaret noktası (bezel üzerinde)
    const drawMarkerDot = (min, color, label) => {
      const rMin = getRel(min);
      const angle = 180 + (rMin / 1440) * 180;
      const rad = angle * Math.PI / 180;
      const r = 87.5;
      const x = 100 + r * Math.cos(rad);
      const y = 110 + r * Math.sin(rad);
      return `<circle cx="${x}" cy="${y}" r="3.2" fill="${color}" stroke="rgba(0,0,0,0.5)" stroke-width="0.6"
        style="filter: drop-shadow(0 0 3px ${color});"
        onmouseenter="window.setDialHoverTitle('${label}','${minToTime(min)}')"
        onmouseleave="window.clearDialHoverTitle()"
        ontouchstart="window.setDialHoverTitle('${label}','${minToTime(min)}');event.preventDefault()"
        ontouchend="setTimeout(()=>window.clearDialHoverTitle(),2000)"
      />`;
    };

    // Güneş doğuş/batış ikonu (küçük metin)
    const drawSunIcon = (min, icon) => {
      const rMin = getRel(min);
      const angle = 180 + (rMin / 1440) * 180;
      const rad = angle * Math.PI / 180;
      const r = 74;
      const x = 100 + r * Math.cos(rad);
      const y = 110 + r * Math.sin(rad);
      let textRot = angle + 90;
      if (textRot > 90 && textRot < 270) textRot += 180;
      return `<text x="${x}" y="${y}" font-size="7" text-anchor="middle" dominant-baseline="central"
        transform="rotate(${textRot} ${x} ${y})" style="pointer-events:none;">${icon}</text>`;
    };

    // Çiz: sektörler (etiket yok — hover tooltip kullanılıyor)
    dialSectors.innerHTML = sectors.map(sec => {
      const isActive = sec.name === activeSectorName;
      return drawAnnularSector(100, 110, 44, 82, sec.s, sec.e, sec.c, sec.stroke, sec.glow, sec.name, isActive);
    }).join('');

    // Çiz: ayırıcı çizgiler
    if (dialSeparators) {
      const sepMins = [fMin, sunMin, oMin, iMin, aMin, yMin];
      if (imsakMin !== null) sepMins.push(imsakMin);
      dialSeparators.innerHTML = sepMins.map(m => drawSeparatorLine(m)).join('');
    }

    // Çiz: saat tikleri (halka üzerinde) + numaralar (dışarıda, koyu renkte)
    if (dialHours) {
      // Sabah vakti saatini referans olarak al
      const fHour = Math.floor(fMin / 60);
      // Her 2 saatte bir label göster, sabah vaktinden başla
      const labelHours = [];
      for (let i = 0; i < 12; i++) {
        labelHours.push((fHour + i * 2) % 24);
      }
      let hoursHtml = '';
      // Tick çizgileri
      for (let h = 0; h < 24; h++) {
        const relMin = getRel(h * 60);
        const angle = 180 + (relMin / 1440) * 180;
        const rad = angle * Math.PI / 180;
        const isMaj = h % 2 === 0;
        const rStart = isMaj ? 79.5 : 81;
        const rEnd = 84;
        hoursHtml += `<line
          x1="${100 + rStart * Math.cos(rad)}" y1="${110 + rStart * Math.sin(rad)}"
          x2="${100 + rEnd * Math.cos(rad)}" y2="${110 + rEnd * Math.sin(rad)}"
          stroke="rgba(164,207,206,0.4)" stroke-width="${isMaj ? 1.3 : 0.65}"/>`;
      }
      // Saat numaraları — daire dışında, koyu renkte
      labelHours.forEach(h => {
        const relMin = getRel(h * 60);
        const angle = 180 + (relMin / 1440) * 180;
        const rad = angle * Math.PI / 180;
        const x = 100 + 95 * Math.cos(rad);
        const y = 110 + 95 * Math.sin(rad);
        hoursHtml += `<text x="${x}" y="${y}" fill="#0c3d3a" font-size="7.5" font-family="'Outfit',sans-serif"
          font-weight="800" text-anchor="middle" dominant-baseline="central">${String(h).padStart(2, '0')}</text>`;
      });
      dialHours.innerHTML = hoursHtml;
    }

    // Çiz: namaz vakti marker noktaları + güneş ikonları
    if (dialMarkers) {
      const markerColors = {
        'Sabah': '#fbbf24',
        'Öğle': '#34d399',
        'İkindi': '#fb923c',
        'Akşam': '#f472b6',
        'Yatsı': '#60a5fa',
        'İmsak': '#a78bfa',
        'Güneş': '#fde047',
        'Akşam☀': '#f97316',
      };
      let markerHtml = '';
      const prayerMins = [
        { min: fMin, label: 'Sabah', color: markerColors['Sabah'] },
        { min: oMin, label: 'Öğle', color: markerColors['Öğle'] },
        { min: iMin, label: 'İkindi', color: markerColors['İkindi'] },
        { min: aMin, label: 'Akşam', color: markerColors['Akşam'] },
        { min: yMin, label: 'Yatsı', color: markerColors['Yatsı'] },
      ];
      if (imsakMin !== null) prayerMins.unshift({ min: imsakMin, label: 'İmsak', color: markerColors['İmsak'] });

      markerHtml += prayerMins.map(pm => drawMarkerDot(pm.min, pm.color, pm.label)).join('');
      markerHtml += drawSunIcon(sunMin, '🌅');
      markerHtml += drawSunIcon(aMin + 5, '🌇');
      dialMarkers.innerHTML = markerHtml;
    }

    // İlk iğne + geri sayım güncellemesi
    updateDialCountdownAndNeedle();
  }

  // İbadet özeti
  const cnt = document.getElementById('ibadetCount');
  const bar = document.getElementById('ibadetBar');
  const msg = document.getElementById('ibadetMsg');
  if (cnt) cnt.textContent = `${done} / 5`;
  if (bar) bar.style.width = Math.max(0, done * 20) + '%';
  if (msg) msg.textContent = ['Başlamak için ilk namazı kıl', 'Güzel başladın 👍', 'Devam et 💪', 'Yarısından fazlası 🔥', 'Son bir adım ✨', 'Bugünkü hedef tamamlandı 🎉'][done] || '';

  // Farz Namaz Tikleme Listesi (Namaz Vakitleri & Tikleme Kartı)
  const checklistEl = document.getElementById('namazChecklist');
  if (checklistEl && PRAYERS && PRAYERS.length === 5) {
    checklistEl.innerHTML = PRAYERS.map((p, i) => {
      const isDone = !!(S.prayers[d]?.[p.n]);
      const isCur = i === curIdx && !isDone;
      const highlightStyle = isCur ? 'border-color: var(--gold); background: rgba(212,175,55,0.06);' : '';
      const textStyle = isCur ? 'color: var(--gold); font-weight: 800;' : 'color: var(--tx2);';
      const labelStyle = isDone ? 'text-decoration: line-through; opacity: 0.5; color: var(--tx3);' : textStyle;

      return `<div class="namaz-check-row" onclick="toggleNamaz('${p.n}')" style="display:flex; align-items:center; justify-content:space-between; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); cursor:pointer; transition: all var(--tr); ${highlightStyle}">
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${isDone ? 'checked' : ''} style="pointer-events:none; accent-color:var(--teal);" />
          <span style="font-size:0.78rem; font-weight:600; ${labelStyle}">${p.n}</span>
        </div>
        <span style="font-size:0.72rem; font-family:'JetBrains Mono',monospace; opacity:0.65; ${textStyle}">${p.t}</span>
      </div>`;
    }).join('');
  }

  // Kadran altı vakit şeridi kaldırıldı — kadran büyütüldü

  // Sonraki vakit (Kaldırıldı)
  renderDailyZikir();
  renderWeeklyIbadet();
  renderKerahet();
  renderVaktinQuote();
  renderEsma();
  renderQada();
  renderHeaderPrayerVakit();
  renderPrayerTimeline();
  renderTesbihatTab();
  renderHeaderAssistant();
  renderWeeklyZikirAnalysis();
}

/* 🔒 [DOKUNULMAZ / KİLİTLİ ALAN] GÜNÜN VAKİT ZAMAN ŞERİDİ (24 SAAT DETAYLI TÜM VAKİTLER) ── */
function renderPrayerTimeline() {
  const container = document.getElementById('prayerTimelineCard');
  if (!container || !PRAYERS || PRAYERS.length !== 5) return;

  const rulerEl = document.getElementById('timelineHourRuler');
  const segEl = document.getElementById('timelineSegments');
  const labelEl = document.getElementById('timelineLabels');
  const needleEl = document.getElementById('timelineNeedle');
  const timeEl = document.getElementById('timelineCurrentTime');

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  if (timeEl) {
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    timeEl.textContent = `${hh}:${mm}:${ss}`;
  }

  const toMin = t => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const minToTime = m => {
    const h = Math.floor(((m % 1440) + 1440) % 1440 / 60);
    const min = Math.floor(((m % 1440) + 1440) % 1440 % 60);
    return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
  };

  const imsakMin = IMSAK_TIME ? toMin(IMSAK_TIME) : null;
  const fMin = toMin(PRAYERS[0].t); // Sabah
  const oMin = toMin(PRAYERS[1].t); // Öğle
  const iMin = toMin(PRAYERS[2].t); // İkindi
  const aMin = toMin(PRAYERS[3].t); // Akşam
  const yMin = toMin(PRAYERS[4].t); // Yatsı
  const sunMin = SUNRISE_TIME ? toMin(SUNRISE_TIME) : fMin + 50; // Güneş

  const timelineStartMin = imsakMin !== null ? imsakMin : fMin - 60;
  const relNow = nowMin >= timelineStartMin ? nowMin - timelineStartMin : (1440 - timelineStartMin) + nowMin;

  // 1. Canlı kırmızı ibre (%0 - %100 24 Saat)
  if (needleEl) {
    const needlePct = Math.max(0, Math.min(100, (relNow / 1440) * 100));
    needleEl.style.left = `${needlePct}%`;
  }

  // Ana Vakitler ve Entegre Nafile Vakit Sektörleri (00:00 - 24:00)
  const sectors = [
    { name: 'İmsak', icon: '🌌', s: imsakMin !== null ? imsakMin : fMin - 60, e: fMin, bg: '#3b0764', border: '#c084fc', txt: '#f3e8ff' },
    { name: 'Sabah', icon: '🌅', s: fMin, e: sunMin, bg: '#854d0e', border: '#fbbf24', txt: '#ffffff' },
    { name: 'Kerahet', icon: '⚠️', s: sunMin, e: sunMin + 45, bg: '#991b1b', border: '#f87171', txt: '#fee2e2' },
    { name: 'İşrak', icon: '✨', s: sunMin + 45, e: sunMin + 90, bg: '#a16207', border: '#fef08a', txt: '#ffffff' },
    { name: 'Kuşluk (Duha)', icon: '☀️', s: sunMin + 90, e: oMin - 45, bg: '#c2410c', border: '#ffedd5', txt: '#ffffff' },
    { name: 'Kerahet', icon: '⚠️', s: oMin - 45, e: oMin, bg: '#991b1b', border: '#f87171', txt: '#fee2e2' },
    { name: 'Öğle', icon: '🕌', s: oMin, e: iMin, bg: '#047857', border: '#34d399', txt: '#ffffff' },
    { name: 'İkindi', icon: '🌆', s: iMin, e: aMin - 45, bg: '#ea580c', border: '#fed7aa', txt: '#ffffff' },
    { name: 'Kerahet', icon: '⚠️', s: aMin - 45, e: aMin, bg: '#991b1b', border: '#f87171', txt: '#fee2e2' },
    { name: 'Akşam (Evvabîn)', icon: '🌇', s: aMin, e: yMin, bg: 'linear-gradient(90deg, #be185d 0%, #be185d 30%, #6b21a8 100%)', border: '#f472b6', txt: '#ffffff' },
    { name: 'Yatsı (Teheccüd)', icon: '🌙', s: yMin, e: imsakMin !== null ? imsakMin + 1440 : fMin + 1440, bg: 'linear-gradient(90deg, #1d4ed8 0%, #1d4ed8 45%, #4338ca 100%)', border: '#60a5fa', txt: '#ffffff' },
  ];

  const descMap = {
    'İmsak': 'Sahur vakti biter, İmsak / Sabah namazı başlar',
    'Sabah': 'Güneş doğana kadar kılınabilen Sabah namazı vakti',
    'Kerahet': 'Mekruh vakit',
    'İşrak': 'Güneş yükseldikten sonra kılınan İşrak namazı vakti',
    'Kuşluk (Duha)': 'Kuşluk (Duha) nafile namazı vakti',
    'Öğle': 'Öğle namazı vakti',
    'İkindi': 'İkindi namazı vakti',
    'Akşam (Evvabîn)': 'Akşam namazı vakti ve Akşamdan sonra kılınan Evvabîn nafile namazı dönemi',
    'Yatsı (Teheccüd)': 'Yatsı, Vitir ve Gece yarısından sonra kılınan Teheccüd nafile namazı dönemi'
  };

  const cacheKey = PRAYERS[0].t;

  // 2. 24 Saatlik 13 Sektörlük Barı Çiz (Tüm Genişlik boyunca)
  if (segEl && (!segEl.children.length || segEl.dataset.updated !== cacheKey)) {
    segEl.dataset.updated = cacheKey;

    segEl.innerHTML = sectors.map(sec => {
      let startRel = sec.s >= timelineStartMin ? sec.s - timelineStartMin : (1440 - timelineStartMin) + sec.s;
      let endRel = sec.e >= timelineStartMin ? sec.e - timelineStartMin : (1440 - timelineStartMin) + sec.e;
      if (endRel <= startRel) endRel += 1440;
      let dur = endRel - startRel;
      const w = (dur / 1440) * 100;
      const startTimeStr = minToTime(sec.s);
      const endTimeStr = minToTime(sec.e);
      const desc = descMap[sec.name] || '';

      const isCurrent = relNow >= startRel && relNow < endRel;
      const activeHighlight = isCurrent ? 'outline: 3px solid #fbbf24; outline-offset: -3px; z-index: 5; box-shadow: inset 0 0 14px rgba(251,191,36,0.7);' : '';

      let labelText = '';
      let fontSize = '0.80rem';

      if (sec.name === 'Kerahet') {
        labelText = sec.icon;
        fontSize = '0.72rem';
      } else if (w < 3.5) {
        labelText = sec.icon;
        fontSize = '0.72rem';
      } else if (w < 6.5) {
        labelText = `${sec.icon} ${sec.name}`;
        fontSize = '0.75rem';
      } else {
        labelText = `${sec.icon} ${sec.name} <span style="opacity:0.95; font-family:'JetBrains Mono',monospace; font-size:0.70rem; font-weight:800; color:#fff;">(${startTimeStr})</span>`;
        fontSize = '0.82rem';
      }

      return `<div onmouseenter="hoverTimelineSector(event, '${sec.icon} ${sec.name}', '${startTimeStr}', '${endTimeStr}', '${desc}', '${sec.border}')" onmousemove="moveTimelineSector(event)" onmouseleave="resetTimelineHover()" style="width: ${w}%; background: ${sec.bg}; height: 100%; position: relative; border-right: 1.5px solid ${sec.border}; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0 2px; cursor: pointer; ${activeHighlight}" title="${sec.name}: ${startTimeStr} - ${endTimeStr}">
        <span style="font-size: ${fontSize}; font-weight: 900; color: ${sec.txt}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 4px #000, 0 0 6px #000, 0 0 2px #000; pointer-events: none; max-width: 100%; text-align: center;">
          ${labelText}
        </span>
      </div>`;
    }).join('');
  }

  // 3. Dynamic Ruler (5 Sektörlük Pencerenin Zaman Tıkları)
  if (rulerEl && (!rulerEl.children.length || rulerEl.dataset.updated !== currentKey)) {
    rulerEl.dataset.updated = currentKey;
    let accumulatedMins = 0;
    const rulerTicks = [];

    visibleSectors.forEach((sec) => {
      const sMin = ((sec.s % 1440) + 1440) % 1440;
      const pct = (accumulatedMins / windowDuration) * 100;
      rulerTicks.push({ pct, time: minToTime(sMin) });
      accumulatedMins += sec.duration;
    });
    const endMin = ((visibleSectors[visibleSectors.length - 1].e % 1440) + 1440) % 1440;
    rulerTicks.push({ pct: 100, time: minToTime(endMin) });

    rulerEl.innerHTML = rulerTicks.map(t =>
      `<div style="position: absolute; left: ${t.pct}%; transform: translateX(-50%); opacity: 0.9; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 0.64rem; color: #e2e8f0;">${t.time}</div>`
    ).join('');
  }

  // 4. Dynamic Vakit Noktaları & Etiketleri (Pencere İçi Vakitler)
  if (labelEl && (!labelEl.children.length || labelEl.dataset.updated !== currentKey)) {
    labelEl.dataset.updated = currentKey;
    const allMarkers = [
      { icon: '🌅', name: 'İmsak', time: IMSAK_TIME || PRAYERS[0].t, min: imsakMin !== null ? imsakMin : fMin - 60 },
      { icon: '☀️', name: 'Güneş', time: SUNRISE_TIME || '--:--', min: sunMin },
      { icon: '🕌', name: 'Öğle', time: PRAYERS[1].t, min: oMin },
      { icon: '🌆', name: 'İkindi', time: PRAYERS[2].t, min: iMin },
      { icon: '🌇', name: 'Akşam', time: PRAYERS[3].t, min: aMin },
      { icon: '🌙', name: 'Yatsı', time: PRAYERS[4].t, min: yMin },
    ];

    const visibleMarkers = allMarkers.filter(m => {
      const mMin = ((m.min % 1440) + 1440) % 1440;
      const rel = mMin >= winStartMin ? mMin - winStartMin : (1440 - winStartMin) + mMin;
      return rel >= 0 && rel <= windowDuration;
    });

    labelEl.innerHTML = visibleMarkers.map(m => {
      const mMin = ((m.min % 1440) + 1440) % 1440;
      const rel = mMin >= winStartMin ? mMin - winStartMin : (1440 - winStartMin) + mMin;
      const pct = (rel / windowDuration) * 100;
      return `<div style="position: absolute; left: ${pct}%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; text-align: center;">
        <div style="width: 2px; height: 6px; background: var(--gold); margin-bottom: 2px;"></div>
        <div style="font-size: 0.62rem; font-weight: 800; color: var(--tx); white-space: nowrap;">${m.icon} ${m.name}</div>
        <div style="font-size: 0.58rem; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: var(--gold);">${m.time}</div>
      </div>`;
    }).join('');
  }
}

window.hoverTimelineSector = function (event, titleStr, startStr, endStr, descStr, colorHex) {
  const accent = colorHex || '#fbbf24';

  // 1. Sabit Hover Başlık Varsa Güncelle
  const el = document.getElementById('timelineHoverTitle');
  if (el) {
    el.style.borderColor = accent;
    el.style.boxShadow = `0 0 12px ${accent}80`;
    el.style.background = '#0f172a';
    el.style.color = '#f8fafc';
    el.innerHTML = `
      <span style="font-weight:900; color:${accent}; text-transform:uppercase; font-size:0.70rem;">${titleStr}</span>
      <span style="font-family:'JetBrains Mono',monospace; color:#ffffff; font-weight:800; font-size:0.66rem;">(${startStr} - ${endStr})</span>
      ${descStr ? `<span style="color:#cbd5e1; font-weight:600; font-size:0.64rem; margin-left:4px;">— ${descStr}</span>` : ''}
    `;
  }

  // 2. Gezici Koyu Pop-up Tooltip (Koyu zemin + Açık renk yazı)
  const pop = document.getElementById('timelineFloatingTooltip');
  if (pop) {
    pop.style.display = 'block';
    pop.style.borderColor = accent;
    pop.style.boxShadow = `0 8px 24px ${accent}60, 0 4px 14px rgba(0,0,0,0.8)`;
    pop.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
        <span style="font-size:0.92rem; font-weight:900; color:${accent}; text-transform:uppercase;">${titleStr}</span>
        <span style="font-family:'JetBrains Mono',monospace; font-size:0.76rem; font-weight:800; color:#ffffff; background:rgba(255,255,255,0.12); padding:2px 8px; border-radius:6px;">${startStr} - ${endStr}</span>
      </div>
      ${descStr ? `<div style="font-size:0.74rem; font-weight:600; color:#cbd5e1; line-height:1.35; max-width:280px;">${descStr}</div>` : ''}
    `;
    if (event) window.moveTimelineSector(event);
  }
};

window.moveTimelineSector = function (event) {
  const pop = document.getElementById('timelineFloatingTooltip');
  if (!pop || pop.style.display === 'none') return;
  const w = pop.offsetWidth || 220;
  const h = pop.offsetHeight || 60;
  let left = event.clientX - w / 2;
  let top = event.clientY - h - 14;
  left = Math.max(10, Math.min(window.innerWidth - w - 10, left));
  if (top < 10) top = event.clientY + 20;
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
};

/* renderCatCards: Tam tanım satır ~2565'te. Duplikat boş gövde kaldırıldı. */

/* renderDayProg: Görev ilerleme rendera - tam tanım satır ~2598'de */
function renderNamazProg() {
  const fill = document.getElementById('ibadetBar');
  const msg = document.getElementById('ibadetMsg');
  const cnt = document.getElementById('namazCnt');
  if (!cnt && !fill) return;
  const d = today();
  const nDone = PRAYERS.filter(p => S.prayers?.[d]?.[p.n]).length;
  if (cnt) cnt.textContent = `${nDone}/5`;
  if (fill) fill.style.width = `${(nDone / 5) * 100}%`;
  if (msg) msg.textContent = nDone === 5 ? 'Tüm namazlar kılındı 🎉' : `${5 - nDone} vakit kaldı`;
}

function renderEsma() {
  const arEl = document.getElementById('esmaArabic');
  const meanEl = document.getElementById('esmaMeaning');
  const trEl = document.getElementById('esmaTranslit');
  if (!arEl) return;

  const list = (Array.isArray(ESMA_LIST) && ESMA_LIST.length) ? ESMA_LIST : [
    { ar: "الرَّحْمَنُ", tr: "Er-Rahmân", m: "Dünyada tüm yaratıklara sonsuz rahmet eden." }
  ];

  // Her gösterimde dönüşümlü ve dinamik gelsin
  const rIdx = Math.floor(Math.random() * list.length);
  const esma = list[rIdx] || list[0];

  arEl.innerHTML = `<div style="font-family:var(--font-arabic); font-size:clamp(1.6rem, 2.2vw, 2.4rem); color:var(--gold); line-height:1.3; font-weight:700; text-align:right; direction:rtl;">${esma.ar || ''}</div>`;
  if (trEl) trEl.textContent = esma.tr || '';
  if (meanEl) meanEl.textContent = esma.m ? `"${esma.m}"` : '';
}

function renderDailyZikir() {
  const textEl = document.getElementById('zikirText');
  const labelEl = document.getElementById('zikirCountLabel');
  if (!textEl) return;

  const list = (Array.isArray(ZIKIR_AYATS) && ZIKIR_AYATS.length) ? ZIKIR_AYATS : [
    { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", tr: "Ahzâb 33/41", m: "Ey iman edenler! Allah'ı çokça zikredin." }
  ];

  // Her gösterimde dönüşümlü ve dinamik gelsin
  const rIdx = Math.floor(Math.random() * list.length);
  const ayet = list[rIdx] || list[0];

  if (labelEl) labelEl.textContent = ayet.tr || 'Ayet-i Kerime';

  textEl.innerHTML = `
    <div style="font-family:var(--font-arabic); font-size:clamp(1.4rem, 1.8vw, 2.1rem); color:var(--teal); line-height:1.4; direction:rtl; text-align:right; font-weight:700; margin-bottom:4px;">${ayet.ar}</div>
    <div style="font-size:0.88rem; color:var(--tx2); font-style:italic; text-align:left; line-height:1.4;">"${ayet.m}"</div>
  `;
}

/* ── RENDER: TESBİHAT & DUALAR REHBERİ ── */
let currentTesbihatTab = 'tesbihat';

function switchTesbihatTab(tab, btn) {
  currentTesbihatTab = tab;
  document.querySelectorAll('#tesbihatTabBtn-tesbihat, #tesbihatTabBtn-ayetelkursi, #tesbihatTabBtn-namazDualari').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderTesbihatTab(tab);
}

function renderTesbihatTab(tab = currentTesbihatTab) {
  const container = document.getElementById('tesbihatTabContent');
  if (!container) return;

  if (tab === 'ayetelkursi') {
    container.innerHTML = `
      <div class="tesbihat-box">
        <div class="tesbihat-item" style="border-left:4px solid var(--gold);">
          <div class="tesbihat-ar">اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ</div>
          <div class="tesbihat-tr">Ayete'l-Kürsî (Bakara 2/255)</div>
          <div class="tesbihat-m">"Allah, O'ndan başka ilah yoktur. O diridir, kayyûmdur. O'nu ne bir uyuklama tutabilir ne de uyku. Göklerde ve yerde ne varsa hepsi O'nundur..."</div>
        </div>
      </div>
    `;
  } else if (tab === 'namazDualari') {
    container.innerHTML = `
      <div class="tesbihat-box" style="display:flex; flex-direction:column; gap:10px; width:100%;">
        <div class="tesbihat-item" style="border-left:4px solid var(--gold);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="tesbihat-tr">Sübhaneke Duası</div>
            <span style="font-size:0.68rem; color:var(--gold); font-weight:700;">Namaz Giriş Duası</span>
          </div>
          <div class="tesbihat-ar">سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ</div>
          <div class="tesbihat-m">"Allah'ım! Sen her türlü noksanlıktan münezzehsin, Seni hamd ile tesbih ederim. İsmin mübarektir, şanın yücedir, Senden başka ilah yoktur."</div>
        </div>

        <div class="tesbihat-item" style="border-left:4px solid var(--teal);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="tesbihat-tr">Ettehiyyâtü Duası</div>
            <span style="font-size:0.68rem; color:var(--teal); font-weight:700;">Oturuş (Teşehhüd) Duası</span>
          </div>
          <div class="tesbihat-ar">التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ 🤲 اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ 🤲 اَلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ 🤲 أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</div>
          <div class="tesbihat-m">"Bütün hürmetler, ibadetler ve güzel sözler Allah'a mahsustur. Ey Peygamber! Selam, Allah'ın rahmeti ve bereketleri senin üzerine olsun. Selam bize ve Allah'ın salih kullarına olsun."</div>
        </div>

        <div class="tesbihat-item" style="border-left:4px solid #60a5fa;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="tesbihat-tr">Salli & Bârik Duaları</div>
            <span style="font-size:0.68rem; color:#60a5fa; font-weight:700;">Salavat Duaları</span>
          </div>
          <div class="tesbihat-ar">اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ 🤲 اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ</div>
          <div class="tesbihat-m">"Allah'ım! Hz. İbrahim'e ve ailesine salât ve bereket ihsan ettiğin gibi Hz. Muhammed'e ve ailesine de salât ve bereket ihsan eyle. Şüphesiz Sen övülmeye layıksın, şanı yücesin."</div>
        </div>

        <div class="tesbihat-item" style="border-left:4px solid #f59e0b;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="tesbihat-tr">Rabbenâ Âtinâ Duası (Bakara 2/201)</div>
            <span style="font-size:0.68rem; color:#f59e0b; font-weight:700;">Son Oturuş Duası</span>
          </div>
          <div class="tesbihat-ar">رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</div>
          <div class="tesbihat-m">"Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru."</div>
        </div>

        <div class="tesbihat-item" style="border-left:4px solid #10b981;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="tesbihat-tr">Rabbenâğfirlî Duası (İbrâhîm 14/41)</div>
            <span style="font-size:0.68rem; color:#10b981; font-weight:700;">Bağışlanma Duası</span>
          </div>
          <div class="tesbihat-ar">رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ</div>
          <div class="tesbihat-m">"Rabbimiz! Hesabın görüleceği gün beni, anne-babamı ve bütün müminleri bağışla."</div>
        </div>

        <div class="tesbihat-item" style="border-left:4px solid #a855f7;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="tesbihat-tr">Rabbenâ C'alnî (Rabbi'c'alnî) Duası (İbrâhîm 14/40)</div>
            <span style="font-size:0.68rem; color:#a855f7; font-weight:700;">Namaz ve Zürriyet Duası</span>
          </div>
          <div class="tesbihat-ar">رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ</div>
          <div class="tesbihat-m">"Rabbim! Beni ve neslimi namazı dosdoğru kılanlardan eyle. Rabbimiz! Duamı kabul buyur."</div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="tesbihat-box" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">
        <div class="tesbihat-item" style="border-left:3px solid var(--teal);">
          <div style="font-size:0.72rem; font-weight:800; color:var(--teal); margin-bottom:4px;">1. 33 DEFA SUBHANALLAH</div>
          <div class="tesbihat-ar">سُبْحَانَ اللَّهِ</div>
          <div class="tesbihat-m">"Allah her türlü noksanlıktan uzaktır."</div>
        </div>
        <div class="tesbihat-item" style="border-left:3px solid var(--gold);">
          <div style="font-size:0.72rem; font-weight:800; color:var(--gold); margin-bottom:4px;">2. 33 DEFA ELHAMDÜLİLLAH</div>
          <div class="tesbihat-ar">الْحَمْدُ لِلَّهِ</div>
          <div class="tesbihat-m">"Hamd yalnız Allah'a mahsustur."</div>
        </div>
        <div class="tesbihat-item" style="border-left:3px solid #60a5fa;">
          <div style="font-size:0.72rem; font-weight:800; color:#60a5fa; margin-bottom:4px;">3. 33 DEFA ALLAHUEKBER</div>
          <div class="tesbihat-ar">اللَّهُ أَكْبَرُ</div>
          <div class="tesbihat-m">"Allah en büyüktür."</div>
        </div>
      </div>
      <div style="margin-top:10px; padding:10px; background:rgba(212,175,55,0.06); border:1px solid rgba(212,175,55,0.2); border-radius:10px; font-size:0.78rem; color:var(--tx2);">
        <span style="color:var(--gold); font-weight:800;">🤲 Bitiriş Duası (Kelime-i Tevhid):</span> <br>
        <span style="font-family:var(--font-arabic); font-size:1.1rem; color:var(--gold);">لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ</span><br>
        <em>"Allah'tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır."</em>
      </div>
    `;
  }
}

/* ── RENDER: GÖREVLER ── */

window.resetTimelineHover = function () {
  const pop = document.getElementById('timelineFloatingTooltip');
  if (pop) {
    pop.style.display = 'none';
  }

  const el = document.getElementById('timelineHoverTitle');
  if (!el) return;
  el.style.borderColor = 'rgba(255,255,255,0.2)';
  el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
  el.style.background = '#0f172a';
  el.style.color = '#f8fafc';

  let curP = { n: 'Namaz', t: '--:--' };
  if (PRAYERS && PRAYERS.length === 5) {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let curIdx = PRAYERS.length - 1;
    PRAYERS.forEach((p, i) => {
      const [h, m] = p.t.split(':').map(Number);
      if (nowMin >= h * 60 + m) curIdx = i;
    });
    curP = PRAYERS[curIdx];
  }
  const pIcons = { 'Sabah': '🌅', 'Öğle': '☀️', 'İkindi': '🌤️', 'Akşam': '🌇', 'Yatsı': '🌙' };
  const icon = pIcons[curP.n] || '🕌';

  el.innerHTML = `<span style="color:#fbbf24; font-weight:900; font-size:0.70rem;">${icon} AKTİF VAKİT: ${curP.n.toUpperCase()}</span> <span style="color:#ffffff; font-weight:800; font-family:'JetBrains Mono',monospace; font-size:0.66rem;">(${curP.t})</span>`;
};

/* ── RENDER: HEADER NAMAZ VAKİTLERİ (Premium Tasarım) ── */
function renderHeaderPrayer() { renderHeaderPrayerVakit(); } // eski ismi yönlendir

/* ── DIAL HOVER TOOLTIP ── */
function getDefaultDialTitle() {
  if (!PRAYERS || PRAYERS.length !== 5) return 'VAKİT KADRANI';
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let curIdx = PRAYERS.length - 1;
  PRAYERS.forEach((p, i) => {
    const [h, m] = p.t.split(':').map(Number);
    if (nowMin >= h * 60 + m) curIdx = i;
  });
  const curP = PRAYERS[curIdx];
  const pIcons = { 'Sabah': '🌅', 'Öğle': '☀️', 'İkindi': '🌤️', 'Akşam': '🌇', 'Yatsı': '🌙' };
  const icon = pIcons[curP.n] || '🕌';
  return `<span style="color:var(--gold);font-weight:900;font-size:0.72rem;letter-spacing:0.06em;text-transform:uppercase;">${icon} AKTİF VAKİT: ${curP.n.toUpperCase()}</span><span style="color:var(--tx2);font-size:0.6rem;margin-left:8px;font-weight:600;">(${curP.t})</span>`;
}

window.setDialHoverTitle = function (name, rangeStr, color) {
  const el = document.getElementById('dialHoverTitle');
  if (!el) return;
  const accentColor = color || 'var(--gold)';
  el.innerHTML = `<span style="color:${accentColor};font-weight:900;font-size:0.72rem;letter-spacing:0.06em;text-transform:uppercase;">${name}</span><span style="color:var(--tx2);font-size:0.6rem;margin-left:8px;font-weight:600;">${rangeStr}</span>`;
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
  el.style.background = 'var(--bg2)';
  el.style.borderColor = 'var(--bd)';
};
window.clearDialHoverTitle = function () {
  const el = document.getElementById('dialHoverTitle');
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(-4px)';
  setTimeout(() => {
    if (el.style.opacity === '0') {
      el.innerHTML = getDefaultDialTitle();
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  }, 250);
};
// İlk render
(function () {
  const el = document.getElementById('dialHoverTitle');
  if (el) {
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    el.innerHTML = getDefaultDialTitle();
  }
})();

/* ── RENDER: ZİKİR ── */

function completeDailyZikir() {
  const ds = today();
  if (!S.zikirDone) S.zikirDone = {};
  S.zikirDone[ds] = !S.zikirDone[ds];
  save(); renderDailyZikir(); renderWeeklyIbadet();
  toast(S.zikirDone[ds] ? 'Günün zikri tamamlandı' : 'Zikir işareti kaldırıldı', S.zikirDone[ds] ? 's' : 'i');
  if (S.zikirDone[ds]) playSound('done');
}

let activeZikirTab = 'all';

function parseZikirTarget(z) {
  if (!z || !z.n) return 33;
  const m = String(z.n).match(/\d+/);
  return m ? parseInt(m[0], 10) : 33;
}

function switchZikirTab(tab, el) {
  activeZikirTab = tab;
  document.querySelectorAll('.zikir-tabs .fchip').forEach(c => c.classList.remove('on'));
  if (el) el.classList.add('on');
  renderZikirView();
}

let activeEsmaSubFilter = 'all';

window.switchEsmaSubFilter = function (filter) {
  activeEsmaSubFilter = filter;
  renderZikirView();
};

window.toggleEsmaMemorized = function (idx) {
  if (!S.esmaMemorized) S.esmaMemorized = {};
  const isNow = !S.esmaMemorized[idx];
  S.esmaMemorized[idx] = isNow;
  save();
  if (isNow) {
    playSound('done');
    triggerConfetti();
    const esmaName = ESMA_LIST && ESMA_LIST[idx] ? ESMA_LIST[idx].tr : '';
    toast(`🧠 "${esmaName}" ismini ezberlediniz olarak işaretlediniz! 🎉`, 's');
  } else {
    toast(`Ezber işareti kaldırıldı.`, 'i');
  }
  renderZikirView();
};

function filterZikirView() {
  renderZikirView();
}

function tapCardZikir(idx) {
  const ds = today();
  if (!S.zikirCardCounts) S.zikirCardCounts = {};
  if (!S.zikirCardCounts[ds]) S.zikirCardCounts[ds] = {};

  const z = DAILY_ZIKIR[idx];
  const targetCnt = parseZikirTarget(z);

  const cur = S.zikirCardCounts[ds][idx] || 0;
  const newCnt = cur + 1;
  S.zikirCardCounts[ds][idx] = newCnt;

  save();
  playSound('bell');

  if (newCnt >= targetCnt && cur < targetCnt) {
    triggerConfetti();
    toast(`🎉 Zikir tamamlandı! Tamamlananlar sekmesine aktarıldı.`, 's');
  }

  renderZikirView();
  renderHeaderAssistant();
  renderWeeklyZikirAnalysis();
}

function resetCardZikir(idx) {
  const ds = today();
  if (S.zikirCardCounts?.[ds]) {
    delete S.zikirCardCounts[ds][idx];
  }
  save();
  renderZikirView();
  renderHeaderAssistant();
  renderWeeklyZikirAnalysis();
  toast('Zikir sıfırlandı, Günlük Zikirler sekmesine geri eklendi.', 'i');
}

function toggleZikirComplete(idx) {
  const z = DAILY_ZIKIR[idx];
  if (!z) return;
  const ds = today();
  if (!S.zikirCardCounts) S.zikirCardCounts = {};
  if (!S.zikirCardCounts[ds]) S.zikirCardCounts[ds] = {};

  const targetCnt = parseZikirTarget(z);
  const cur = S.zikirCardCounts[ds][idx] || 0;

  if (cur >= targetCnt) {
    delete S.zikirCardCounts[ds][idx];
    toast(`"${z.t || z.tr}" zikri sıfırlandı.`, 'i');
  } else {
    S.zikirCardCounts[ds][idx] = targetCnt;
    if (typeof triggerConfetti === 'function') triggerConfetti();
    toast(`🎉 "${z.t || z.tr}" zikri tamamlandı!`, 's');
    playSound('done');
  }

  save();
  renderZikirView();
  renderHeaderAssistant();
  renderWeeklyZikirAnalysis();
}

function normTR(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[-\s']/g, '');
}

function renderZikirView() {
  renderEsma();
  renderDailyZikir();

  const cont = document.getElementById('zikirGridContainer');
  if (!cont) return;

  const qInp = document.getElementById('searchZikirInp');
  const q = (qInp ? qInp.value : '').toLowerCase().trim();
  const nQ = normTR(q);

  const ds = today();
  const cardCounts = S.zikirCardCounts?.[ds] || {};

  const allZikirs = (DAILY_ZIKIR || []).map((z, i) => {
    const target = parseZikirTarget(z);
    const cnt = cardCounts[i] || 0;
    const isDone = cnt >= target;
    return { ...z, origIdx: i, target, cnt, isDone };
  });

  const pendingZikirs = allZikirs.filter(z => !z.isDone);
  const completedZikirs = allZikirs.filter(z => z.isDone);

  // Sayıcıları güncelle
  const zAll = pendingZikirs.length;
  const zDone = completedZikirs.length;
  const zEsma = ESMA_LIST ? ESMA_LIST.length : 99;

  const setZCnt = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setZCnt('zcnt-all', zAll);
  setZCnt('zcnt-done', zDone);
  setZCnt('zcnt-esma', zEsma);

  let html = '';

  if (activeZikirTab === 'esma') {
    cont.className = 'esma-grid-container';

    if (!S.esmaMemorized) S.esmaMemorized = {};
    const totalEsma = (ESMA_LIST || []).length;
    const memorizedCount = (ESMA_LIST || []).filter((_, i) => S.esmaMemorized[i]).length;
    const pct = totalEsma > 0 ? Math.round((memorizedCount / totalEsma) * 100) : 0;

    let list = (ESMA_LIST || []).map((e, i) => ({ ...e, origIdx: i }));

    // Arama filtresi
    if (q) {
      list = list.filter(e =>
        normTR(e.tr).includes(nQ) ||
        (e.tr || '').toLowerCase().includes(q) ||
        (e.m || '').toLowerCase().includes(q) ||
        normTR(e.m).includes(nQ) ||
        (e.ar || '').includes(q)
      );
    }

    // Ezber alt filtresi
    if (activeEsmaSubFilter === 'memorized') {
      list = list.filter(e => S.esmaMemorized[e.origIdx]);
    } else if (activeEsmaSubFilter === 'pending') {
      list = list.filter(e => !S.esmaMemorized[e.origIdx]);
    }

    let progressHeader = `
      <div style="grid-column:1/-1; background:var(--sf2); border:1px solid var(--bd); border-radius:14px; padding:12px 14px; margin-bottom:4px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
          <div style="font-weight:800; font-size:0.90rem; color:var(--gold); display:flex; align-items:center; gap:8px;">
            <span>🧠 Esmâ-ül Hüsna Ezber Takibi</span>
            <span style="font-size:0.78rem; font-weight:700; color:var(--teal); background:rgba(62,207,176,0.12); padding:2px 8px; border-radius:12px; font-family:'JetBrains Mono',monospace;">${memorizedCount} / ${totalEsma} (%${pct})</span>
          </div>
          <div class="esma-filter-row" style="display:flex !important; flex-direction:row !important; flex-wrap:nowrap !important; gap:4px !important; width:100% !important; margin-top:4px !important;">
            <button onclick="switchEsmaSubFilter('all')" class="fchip ${activeEsmaSubFilter === 'all' ? 'on' : ''}" style="flex:1 1 0px !important; width:auto !important; min-width:0 !important; white-space:nowrap !important; font-size:0.72rem !important; padding:6px 4px !important; border-radius:10px !important; text-align:center !important; display:inline-flex !important; justify-content:center !important; align-items:center !important;">📜 Tümü (${totalEsma})</button>
            <button onclick="switchEsmaSubFilter('memorized')" class="fchip ${activeEsmaSubFilter === 'memorized' ? 'on' : ''}" style="flex:1 1 0px !important; width:auto !important; min-width:0 !important; white-space:nowrap !important; font-size:0.72rem !important; padding:6px 4px !important; border-radius:10px !important; text-align:center !important; display:inline-flex !important; justify-content:center !important; align-items:center !important;">🧠 Ezberlenen (${memorizedCount})</button>
            <button onclick="switchEsmaSubFilter('pending')" class="fchip ${activeEsmaSubFilter === 'pending' ? 'on' : ''}" style="flex:1 1 0px !important; width:auto !important; min-width:0 !important; white-space:nowrap !important; font-size:0.72rem !important; padding:6px 4px !important; border-radius:10px !important; text-align:center !important; display:inline-flex !important; justify-content:center !important; align-items:center !important;">⏳ Ezberlenecek (${totalEsma - memorizedCount})</button>
          </div>
        </div>
        <div style="width:100%; height:8px; background:var(--sf3); border-radius:4px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, var(--teal), var(--gold)); transition:width 0.3s ease;"></div>
        </div>
      </div>
    `;

    if (!list.length) {
      cont.innerHTML = progressHeader + `<div class="empty" style="grid-column:1/-1; margin-top:12px;"><div class="empty-ico">🔍</div><div class="empty-txt">Esmâ bulunamadı.</div></div>`;
      return;
    }

    html = progressHeader + list.map(e => {
      const isMem = !!S.esmaMemorized[e.origIdx];
      return `
        <div class="esma-item-card ${isMem ? 'memorized' : ''}" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:16px 12px; border-radius:14px; background:var(--sf2); border:1px solid ${isMem ? 'var(--grn)' : 'var(--bd)'}; position:relative;">
          <span style="position:absolute; top:8px; left:10px; font-size:0.72rem; font-weight:800; color:var(--gold); opacity:0.85;">#${e.origIdx + 1}</span>
          <button onclick="toggleEsmaMemorized(${e.origIdx})" title="${isMem ? 'Ezberlendi (İşareti kaldır)' : 'Ezberle'}" style="position:absolute; top:6px; right:8px; border:none; background:none; cursor:pointer; font-size:1.1rem; padding:2px; line-height:1; user-select:none;">
            ${isMem ? '✅' : '⚪'}
          </button>
          <div style="font-family:var(--font-arabic); font-size:1.8rem; color:${isMem ? 'var(--grn)' : 'var(--gold)'}; font-weight:700; margin-top:8px; margin-bottom:4px; text-align:center; direction:rtl;">${esc(e.ar || '')}</div>
          <div style="font-weight:800; color:var(--teal); font-size:0.95rem; margin-bottom:4px; text-align:center;">${esc(e.tr || '')}</div>
          <div style="font-size:0.78rem; color:var(--tx2); font-style:italic; text-align:center; line-height:1.3; margin-bottom:10px;">${esc(e.m || '')}</div>
          <button onclick="toggleEsmaMemorized(${e.origIdx})" style="margin-top:auto; padding:5px 12px; border-radius:10px; border:1px solid ${isMem ? 'var(--grn)' : 'var(--bd)'}; background:${isMem ? 'var(--grnbg)' : 'var(--sf3)'}; color:${isMem ? 'var(--grn)' : 'var(--tx2)'}; font-size:0.75rem; font-weight:700; cursor:pointer; width:100%; transition:all 0.2s ease;">
            ${isMem ? '🧠 Ezberlendi' : '➕ Ezberle'}
          </button>
        </div>
      `;
    }).join('');
  } else if (activeZikirTab === 'done') {
    cont.className = 'zikir-grid-container';
    let list = completedZikirs;
    if (q) {
      list = list.filter(z =>
        normTR(z.t || z.tr).includes(nQ) ||
        ((z.t || z.tr) || '').toLowerCase().includes(q) ||
        (z.m || '').toLowerCase().includes(q) ||
        normTR(z.m).includes(nQ) ||
        (z.ar || '').includes(q)
      );
    }
    if (!list.length) {
      cont.innerHTML = `<div class="empty" style="grid-column:1/-1;"><div class="empty-ico">✅</div><div class="empty-txt">Henüz tamamlanan zikir yok.</div></div>`;
      return;
    }
    html = list.map(z => `
      <div class="zikir-item-card done" style="width:100%; opacity:0.9; border-color:var(--grn);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
          <div style="flex:1; min-width:200px; text-align:left; display:flex; align-items:center; gap:10px;">
            <div onclick="toggleZikirComplete(${z.origIdx})" style="width:28px; height:28px; border-radius:50%; border:2px solid var(--grn); background:var(--grn); color:#0b1320; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; flex-shrink:0; cursor:pointer;" title="İşareti kaldır / Sıfırla">
              ✓
            </div>
            <div>
              <div class="zikir-card-tr" style="font-weight:800; color:var(--grn); font-size:1.05rem; margin-bottom:2px; text-align:left; text-decoration:line-through; cursor:pointer;" onclick="toggleZikirComplete(${z.origIdx})">${esc(z.t || z.tr || '')}</div>
              ${z.m ? `<div class="zikir-card-meaning" style="font-size:0.85rem; color:var(--tx2); font-style:italic; text-align:left;">${esc(z.m)}</div>` : ''}
            </div>
          </div>
          <div class="zikir-card-ar" style="font-family:var(--font-arabic); font-size:1.4rem; color:var(--gold); font-weight:700; direction:rtl; text-align:right;">${esc(z.ar || '')}</div>
        </div>
        <div class="zikir-card-foot" style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px dashed var(--bd);">
          <span class="zikir-count-pill" style="padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700; background:var(--grnbg); color:var(--grn);">✅ Tamamlandı (${z.cnt}/${z.target})</span>
          <button class="zikir-tap-btn" onclick="resetCardZikir(${z.origIdx})" style="padding:6px 14px; border-radius:8px; border:1px solid var(--bd); color:var(--tx2); background:var(--sf3); cursor:pointer; font-weight:700; font-size:0.8rem;" title="Sıfırla ve listeye geri al">↺ Sıfırla</button>
        </div>
      </div>
    `).join('');
  } else {
    cont.className = 'zikir-grid-container';
    let list = pendingZikirs;
    if (q) {
      list = list.filter(z =>
        normTR(z.t || z.tr).includes(nQ) ||
        ((z.t || z.tr) || '').toLowerCase().includes(q) ||
        (z.m || '').toLowerCase().includes(q) ||
        normTR(z.m).includes(nQ) ||
        (z.ar || '').includes(q)
      );
    }
    if (!list.length) {
      cont.innerHTML = `<div class="empty" style="grid-column:1/-1;"><div class="empty-ico">🏆</div><div class="empty-txt">Tüm zikirler tamamlandı! 🎉</div></div>`;
      return;
    }
    html = list.map(z => `
      <div class="zikir-item-card" style="width:100%; border:1px solid ${z.isDone ? 'var(--teal)' : 'var(--bd)'};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
          <div style="flex:1; min-width:200px; text-align:left; display:flex; align-items:center; gap:10px;">
            <div onclick="toggleZikirComplete(${z.origIdx})" style="width:28px; height:28px; border-radius:50%; border:2px solid ${z.isDone ? 'var(--teal)' : 'var(--tx3)'}; background:${z.isDone ? 'var(--teal)' : 'transparent'}; color:#0b1320; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; flex-shrink:0; cursor:pointer; transition:all 0.2s ease;" title="${z.isDone ? 'Tamamlandı (İşareti kaldır)' : 'Tamamlandı olarak işaretle'}">
              ${z.isDone ? '✓' : ''}
            </div>
            <div>
              <div class="zikir-card-tr" style="font-weight:800; color:${z.isDone ? 'var(--teal)' : 'var(--tx)'}; font-size:1.05rem; margin-bottom:2px; text-align:left; text-decoration:${z.isDone ? 'line-through' : 'none'}; cursor:pointer;" onclick="toggleZikirComplete(${z.origIdx})">${esc(z.t || z.tr || '')}</div>
              ${z.m ? `<div class="zikir-card-meaning" style="font-size:0.85rem; color:var(--tx2); font-style:italic; text-align:left;">${esc(z.m)}</div>` : ''}
            </div>
          </div>
          <div class="zikir-card-ar" style="font-family:var(--font-arabic); font-size:1.4rem; color:var(--gold); font-weight:700; direction:rtl; text-align:right;">${esc(z.ar || '')}</div>
        </div>
        <div class="zikir-card-foot" style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px dashed var(--bd);">
          <span class="zikir-count-pill" style="padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700; background:rgba(62,207,176,0.1); color:var(--teal);">🎯 Hedef: ${z.target}x ${z.cnt > 0 ? `(${z.cnt}/${z.target})` : ''}</span>
          <div style="display:flex; gap:6px;">
            <button class="zikir-tap-btn" onclick="toggleZikirComplete(${z.origIdx})" style="padding:6px 12px; border-radius:8px; border:1px solid var(--teal); color:var(--teal); background:rgba(62,207,176,0.1); cursor:pointer; font-weight:800; font-size:0.8rem;" title="Direkt Tamamla / İşaretle">✓ Tamamla</button>
            <button class="zikir-tap-btn" onclick="tapCardZikir(${z.origIdx})" style="padding:8px 18px; border-radius:8px; border:none; color:#fff; background:var(--teal); cursor:pointer; font-weight:800; font-size:0.85rem; box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.1s ease;">👆 Say (+1)</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  cont.innerHTML = html;
}

/* ── RENDER: HAFTALIK İBADET ── */
function renderWeeklyIbadet() {
  const box = document.getElementById('weeklyIbadetDays');
  const score = document.getElementById('weeklyIbadetScore');
  if (!box || !score) return;
  const dnames = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
  let total = 0;
  const html = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - i));
    const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const cnt = PRAYERS.filter(p => S.prayers[ds]?.[p.n]).length;
    total += cnt;
    const pct = cnt / 5 * 100;
    const idx = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return `<div class="wi-day ${i === 6 ? 'today ' : ''} ${cnt === 5 ? 'full' : ''}" title="${ds} · ${cnt}/5">
      <div class="wi-bar"><div class="wi-fill" style="height:${Math.max(8, pct)}%"></div></div>
      <div class="wi-label">${dnames[idx]}</div>
    </div>`;
  }).join('');
  score.textContent = `${total}/35`;
  box.innerHTML = html;
}

/* ── RENDER: ÜST HEADER CANLI İSTATİSTİK BAR-I ── */
/* isTaskForToday: Tam (detaylı) tanım satır ~1177'de. Basitleştirilmiş duplikat kaldırıldı. */

function getNextPrayerTimeStr() {
  if (!PRAYERS || PRAYERS.length !== 5) return '';
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  let nextP = PRAYERS[0];
  let diffMin = 0;

  for (let i = 0; i < PRAYERS.length; i++) {
    const [h, m] = PRAYERS[i].t.split(':').map(Number);
    const pMin = h * 60 + m;
    if (pMin > nowMin) {
      nextP = PRAYERS[i];
      diffMin = pMin - nowMin;
      break;
    }
  }

  if (diffMin === 0) {
    const [h, m] = PRAYERS[0].t.split(':').map(Number);
    diffMin = (24 * 60 - nowMin) + (h * 60 + m);
    nextP = PRAYERS[0];
  }

  const rh = Math.floor(diffMin / 60);
  const rm = diffMin % 60;
  const timeStr = rh > 0 ? `${rh}s ${rm}d` : `${rm}d`;
  return `${nextP.n} ${timeStr}`;
}

let _hdrAssistantIndex = 0;
let _hdrAssistantTimer = null;
let _hdrAssistantPaused = false;

function getHeaderAssistantItems() {
  const ds = typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);

  // 1. Görevler
  const todayTasks = (S.tasks || []).filter(t => isTaskForToday(t));
  const doneTasks = todayTasks.filter(t => t.done).length;
  const totalTasks = todayTasks.length;

  // 2. Alışkanlıklar
  const totalHabits = (typeof HABITS !== 'undefined' && Array.isArray(HABITS)) ? HABITS.length : 0;
  const doneHabits = (totalHabits > 0 && S.habits && S.habits[ds]) ? HABITS.filter(h => S.habits[ds][h.id]).length : 0;

  // 3. Namaz Vakti & Kalan Süre
  const prayersDone = (PRAYERS && Array.isArray(PRAYERS)) ? PRAYERS.filter(p => S.prayers && S.prayers[ds] && S.prayers[ds][p.n]).length : 0;
  const nextPStr = getNextPrayerTimeStr();

  // 4. Günlük Zikirler
  const cardCounts = (S.zikirCardCounts && S.zikirCardCounts[ds]) ? S.zikirCardCounts[ds] : {};
  const zikirsDone = (DAILY_ZIKIR || []).filter((z, i) => (cardCounts[i] || 0) >= parseZikirTarget(z)).length;
  const totalZikirCount = (DAILY_ZIKIR || []).reduce((acc, _, i) => acc + (cardCounts[i] || 0), 0);

  // 5. Kuran Okumaları
  const qRoutines = (S.quran && S.quran.routines && S.quran.routines[ds]) ? S.quran.routines[ds] : {};
  const quranDone = Object.values(qRoutines).filter(Boolean).length;

  return [
    {
      view: 'tasks',
      title: 'Görevler Menüsüne Git',
      color: 'var(--teal)',
      bg: 'rgba(62,207,176,0.14)',
      bd: 'rgba(62,207,176,0.35)',
      html: `📋 Günlük Görev İlerlemesi : ${doneTasks} / ${totalTasks}`
    },
    {
      view: 'habits',
      title: 'Analiz & Alışkanlıklar Menüsüne Git',
      color: 'var(--pur)',
      bg: 'rgba(167,139,250,0.14)',
      bd: 'rgba(167,139,250,0.35)',
      html: `⚡ Alışkanlık & Rutin Takibi : ${doneHabits} / ${totalHabits}`
    },
    {
      view: 'prayers',
      title: 'Namaz Vakitleri Menüsüne Git',
      color: 'var(--gold)',
      bg: 'rgba(232,184,75,0.14)',
      bd: 'rgba(232,184,75,0.35)',
      html: `🕌 Günlük Vakit Namazları : ${prayersDone} / 5 ${nextPStr ? `<small style="font-size:0.72rem; opacity:0.85; font-weight:700;">(${nextPStr})</small>` : ''}`
    },
    {
      view: 'zikir',
      title: 'Zikir & Esmâ Menüsüne Git',
      color: '#60a5fa',
      bg: 'rgba(96,165,250,0.14)',
      bd: 'rgba(96,165,250,0.35)',
      html: `📿 Günlük Zikir & Tesbihat Takibi : ${zikirsDone} / 5 (${totalZikirCount} / 500 defa)`
    },
    {
      view: 'quran',
      title: 'Kuran-ı Kerîm Takip Menüsüne Git',
      color: '#34d399',
      bg: 'rgba(52,211,153,0.14)',
      bd: 'rgba(52,211,153,0.35)',
      html: `📖 Kuran'ı Kerim Okumalarım : ${quranDone} / 6`
    }
  ];
}

function renderHeaderAssistant() {
  const el = document.getElementById('headerAssistantMsg');
  if (!el) return;

  try {
    const items = getHeaderAssistantItems();
    if (!items.length) return;

    _hdrAssistantIndex = _hdrAssistantIndex % items.length;
    const cur = items[_hdrAssistantIndex];

    el.innerHTML = `
      <button type="button" onclick="window.showView('${cur.view}')" class="hdr-chip-btn" style="background:${cur.bg}; border:1px solid ${cur.bd}; color:${cur.color}; padding:4px 14px; border-radius:12px; font-size:0.80rem; font-weight:800; display:inline-flex; align-items:center; gap:6px; cursor:pointer; transition:all 0.25s ease;" title="${cur.title}">
        ${cur.html}
      </button>
    `;

    startHeaderAssistantRotation();
  } catch (err) {
    console.error('Header assistant error:', err);
  }
}

function startHeaderAssistantRotation() {
  if (_hdrAssistantTimer) return;

  const wrap = document.getElementById('headerAssistant');
  if (wrap && !wrap._hdrHoverBound) {
    wrap._hdrHoverBound = true;
    wrap.addEventListener('mouseenter', () => { _hdrAssistantPaused = true; });
    wrap.addEventListener('mouseleave', () => { _hdrAssistantPaused = false; });
  }

  _hdrAssistantTimer = setInterval(() => {
    if (_hdrAssistantPaused) return;

    const items = getHeaderAssistantItems();
    if (!items.length) return;

    _hdrAssistantIndex = (_hdrAssistantIndex + 1) % items.length;
    const cur = items[_hdrAssistantIndex];
    const el = document.getElementById('headerAssistantMsg');
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(-4px)';
    setTimeout(() => {
      el.innerHTML = `
        <button type="button" onclick="window.showView('${cur.view}')" class="hdr-chip-btn" style="background:${cur.bg}; border:1px solid ${cur.bd}; color:${cur.color}; padding:4px 14px; border-radius:12px; font-size:0.80rem; font-weight:800; display:inline-flex; align-items:center; gap:6px; cursor:pointer; transition:all 0.25s ease;" title="${cur.title}">
          ${cur.html}
        </button>
      `;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150);
  }, 2800);
}

/* ── RENDER: HAFTALIK ZİKİR İSTATİSTİK ANALİZİ ── */
function renderWeeklyZikirAnalysis() {
  const box = document.getElementById('weeklyZikirDays');
  const score = document.getElementById('weeklyZikirScore');
  const breakdown = document.getElementById('dailyZikirBreakdown');
  if (!box || !score) return;

  const dnames = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
  let totalZikirsDone = 0;
  let totalCountSum = 0;

  const html = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - i));
    const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const cardCounts = S.zikirCardCounts?.[ds] || {};

    let dayZikirsDone = 0;
    let dayTotalCount = 0;
    (DAILY_ZIKIR || []).forEach((z, idx) => {
      const cnt = cardCounts[idx] || 0;
      dayTotalCount += cnt;
      if (cnt >= parseZikirTarget(z)) dayZikirsDone++;
    });

    totalZikirsDone += dayZikirsDone;
    totalCountSum += dayTotalCount;

    const pct = (dayZikirsDone / 5) * 100;
    const dayNameIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return `<div class="wi-day ${i === 6 ? 'today ' : ''} ${dayZikirsDone === 5 ? 'full' : ''}" title="${ds} · ${dayZikirsDone}/5 zikir (${dayTotalCount}/500 defa)">
      <div class="wi-bar"><div class="wi-fill" style="height:${Math.max(8, pct)}%; background:linear-gradient(180deg, #60a5fa, #3b82f6);"></div></div>
      <div class="wi-label">${dnames[dayNameIdx]}</div>
    </div>`;
  }).join('');

  score.textContent = `${totalZikirsDone}/35 zikir (${totalCountSum}/3500 defa)`;
  box.innerHTML = html;

  if (breakdown) {
    const ds = today();
    const cardCounts = S.zikirCardCounts?.[ds] || {};
    breakdown.innerHTML = `
      <div style="font-size:0.78rem; font-weight:800; color:var(--gold); margin-bottom:4px;">📊 Bugünün 5 Günlük Zikir Durumu:</div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
        ${(DAILY_ZIKIR || []).map((z, idx) => {
      const cnt = cardCounts[idx] || 0;
      const target = parseZikirTarget(z);
      const isDone = cnt >= target;
      const pct = Math.min(100, Math.round((cnt / target) * 100));
      return `
            <div style="padding:8px 10px; background:var(--sf2); border:1px solid ${isDone ? 'var(--grn)' : 'var(--bd)'}; border-radius:10px; font-size:0.78rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; font-weight:700; color:var(--tx); margin-bottom:4px;">
                <span style="color:${isDone ? 'var(--grn)' : 'var(--teal)'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;">${z.t || z.tr}</span>
                <span style="font-size:0.72rem; color:var(--tx2); font-family:'JetBrains Mono',monospace;">${cnt}/${target}</span>
              </div>
              <div style="width:100%; height:5px; background:var(--sf3); border-radius:3px; overflow:hidden;">
                <div style="width:${pct}%; height:100%; background:${isDone ? 'var(--grn)' : '#60a5fa'}; transition:width 0.3s ease;"></div>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    `;
  }
}

/* ── RENDER: HAFTALIK KURAN TİLÂVETİ & HATİM ANALİZİ ── */
function renderWeeklyQuranAnalysis() {
  const box = document.getElementById('weeklyQuranDays');
  const score = document.getElementById('weeklyQuranScore');
  const breakdown = document.getElementById('dailyQuranBreakdown');
  if (!box || !score) return;

  const dnames = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
  let totalDone = 0;

  const html = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - i));
    const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const routines = S.quran?.routines?.[ds] || {};
    const cnt = Object.values(routines).filter(Boolean).length;
    totalDone += cnt;

    const pct = (cnt / 6) * 100;
    const dayNameIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return `<div class="wi-day ${i === 6 ? 'today ' : ''} ${cnt >= 6 ? 'full' : ''}" title="${ds} · ${cnt}/6 sure okuması">
      <div class="wi-bar"><div class="wi-fill" style="height:${Math.max(8, pct)}%; background:linear-gradient(180deg, #34d399, #10b981);"></div></div>
      <div class="wi-label">${dnames[dayNameIdx]}</div>
    </div>`;
  }).join('');

  const ds = today();
  const todayRoutines = S.quran?.routines?.[ds] || {};
  const todayDoneCount = Object.values(todayRoutines).filter(Boolean).length;

  score.textContent = `${todayDoneCount}/6 bugün (${totalDone}/36 bu hafta)`;
  box.innerHTML = html;

  if (breakdown) {
    breakdown.innerHTML = `
      <div style="font-size:0.78rem; font-weight:800; color:var(--teal); margin-bottom:4px;">📖 Kuran'ı Kerim Okumalarım (${todayDoneCount}/6):</div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
        ${(QURAN_ROUTINES_DEF || []).map(item => {
          const isDone = !!todayRoutines[item.id];
          return `
            <div style="padding:8px 10px; background:var(--sf2); border:1px solid ${isDone ? 'var(--teal)' : 'var(--bd)'}; border-radius:10px; font-size:0.78rem; display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:6px; overflow:hidden;">
                <span style="color:${isDone ? 'var(--teal)' : 'var(--tx3)'}; font-weight:800;">${isDone ? '✓' : '○'}</span>
                <span style="font-weight:700; color:${isDone ? 'var(--tx)' : 'var(--tx2)'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</span>
              </div>
              <span style="font-size:0.70rem; color:var(--gold); font-weight:700;">${item.sub}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

/* ── RENDER: ALIŞKANLIKLAR (PAZARTESİDEN BAŞLAYAN HAFTALIK GÖRÜNÜM) ── */
function renderHabits() {
  const dnames = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
  const containers = document.querySelectorAll('.habits-view-list');
  if (!containers.length) return;

  // Mevcut haftanın Pazartesi gününü hesapla
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0: Pazar, 1: Pazartesi, ... 6: Cumartesi
  const distToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distToMonday);

  const todayStr = today();

  const html = HABITS.map((h, idx) => {
    const str = streak(h.id);
    const dots = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const isDone = !!(S.habits[ds]?.[h.id]);
      const isT = ds === todayStr;
      const dn = dnames[i];
      return `<div class="habit-day-wrap">
        <div class="hdot${isDone ? ' done' : ''}${isT ? ' today' : ''}" onclick="toggleHabit('${h.id}','${ds}')" title="${dn} ${ds}">${isDone ? '✓' : ''}</div>
        <div class="habit-day-name">${dn}</div>
      </div>`;
    }).join('');
    return `<div class="hrow">
      <div class="htop">
        <div class="hnm">${esc(h.l || h.title || h.name || h.label)}</div>
        <div style="display:flex;align-items:center;gap:5px">
          <div class="hstr">🔥${str}</div>
          <div class="habit-actions">
            <button class="habit-btn" onclick="editHabitPrompt(${idx})" title="Düzenle">✏️</button>
            <button class="habit-btn habit-btn-del" onclick="deleteHabit(${idx})" title="Sil">🗑️</button>
          </div>
        </div>
      </div>
      <div class="hdots2">${dots}</div>
    </div>`;
  }).join('');
  containers.forEach(el => { el.innerHTML = html; });
}

/* ── ALIÞKANLIK MODAL ── */
function addHabitPrompt() {
  _habitEditIdx = -1;
  const title = document.getElementById('habitModalTitle'); if (title) title.textContent = '✨ Yeni Alışkanlık';
  const sub = document.getElementById('habitModalSub'); if (sub) sub.textContent = 'Başına emoji ekleyebilirsiniz';
  const inp = document.getElementById('habitModalInp'); if (inp) inp.value = '';
  document.getElementById('habitModal')?.classList.add('on');
  setTimeout(() => document.getElementById('habitModalInp')?.focus(), 80);
}
function editHabitPrompt(idx) {
  const h = HABITS[idx]; if (!h) return;
  _habitEditIdx = idx;
  const title = document.getElementById('habitModalTitle'); if (title) title.textContent = '✏️ Alışkanlık Düzenle';
  const sub = document.getElementById('habitModalSub'); if (sub) sub.textContent = 'Adı güncelleyip kaydedin';
  const inp = document.getElementById('habitModalInp'); if (inp) inp.value = h.l;
  document.getElementById('habitModal')?.classList.add('on');
  setTimeout(() => { const inp = document.getElementById('habitModalInp'); if (inp) { inp.focus(); inp.select(); } }, 80);
}
function saveHabitModal() {
  const inp = document.getElementById('habitModalInp');
  const label = (inp?.value || '').trim();
  if (!label) { if (inp) inp.style.borderColor = 'var(--rose)'; return; }
  if (inp) inp.style.borderColor = '';
  if (_habitEditIdx === -1) {
    HABITS.push({ id: 'h_' + gid(), l: label });
    toast('Alışkanlık eklendi', 's');
  } else {
    if (!HABITS[_habitEditIdx]) return;
    HABITS[_habitEditIdx].l = label;
    toast('Alışkanlık güncellendi', 's');
  }
  save(); renderHabits(); closeHabitModal();
}
function closeHabitModal() {
  document.getElementById('habitModal')?.classList.remove('on');
  const inp = document.getElementById('habitModalInp'); if (inp) inp.style.borderColor = '';
  _habitEditIdx = null;
}
function deleteHabit(idx) {
  const h = HABITS[idx]; if (!h) return;
  const txt = document.getElementById('habitDelTxt'); if (txt) txt.textContent = `"${h.l}" alışkanlığı silinsin mi?`;
  const okBtn = document.getElementById('habitDelOk');
  if (okBtn) {
    okBtn.onclick = () => {
      HABITS.splice(idx, 1); save(); renderHabits();
      closeModal('habitDelModal'); toast('Alışkanlık silindi', 'i');
    };
  }
  document.getElementById('habitDelModal')?.classList.add('on');
}

/* renderCatTimes: Gelişmiş UI tanımı satır ~2072'de. Basit duplikat kaldırıldı. */

/* ── RENDER: GÖREVLER ── */

/* updatePgHdr, subStats, toggleTaskExpand: Gelişmiş tanımlar satır ~4470-4497'de. Basit duplikatlar kaldırıldı. */
let selectedTaskIds = new Set();
let isSelectMode = false;
let currentVisibleTasks = [];

/* ── TOPLU İŞLEMLER VE ÇOKLU SEÇİM ── */
function toggleSelectMode() {
  isSelectMode = !isSelectMode;
  const btn = document.getElementById('btnToggleSelect');
  if (btn) btn.classList.toggle('btn-select-mode-active', isSelectMode);
  if (!isSelectMode) {
    selectedTaskIds.clear();
  }
  updateBulkDock();
  renderTasks();
}

function toggleTaskSelection(id, e) {
  if (e) e.stopPropagation();
  if (selectedTaskIds.has(id)) {
    selectedTaskIds.delete(id);
  } else {
    selectedTaskIds.add(id);
  }
  updateBulkDock();
  renderTasks();
}

function clearTaskSelection() {
  selectedTaskIds.clear();
  isSelectMode = false;
  const btn = document.getElementById('btnToggleSelect');
  if (btn) btn.classList.remove('btn-select-mode-active');
  updateBulkDock();
  renderTasks();
}

function toggleSelectAllVisible() {
  if (!currentVisibleTasks.length) return;
  const allSelected = currentVisibleTasks.every(t => selectedTaskIds.has(t.id));
  if (allSelected) {
    currentVisibleTasks.forEach(t => selectedTaskIds.delete(t.id));
  } else {
    currentVisibleTasks.forEach(t => selectedTaskIds.add(t.id));
  }
  updateBulkDock();
  renderTasks();
}

function updateBulkDock() {
  const dock = document.getElementById('bulkActionDock');
  const countEl = document.getElementById('bulkSelectedCount');
  const fchipSel = document.getElementById('fchipSelected');
  const btnSelAll = document.getElementById('btnSelectAllVis');

  if (countEl) countEl.textContent = selectedTaskIds.size;
  if (fchipSel) fchipSel.style.display = selectedTaskIds.size > 0 ? 'inline-block' : 'none';

  if (selectedTaskIds.size > 0 || isSelectMode) {
    if (dock) dock.style.display = 'flex';
  } else if (dock) {
    dock.style.display = 'none';
  }

  const catSel = document.getElementById('bulkCatSel');
  if (catSel) {
    let opts = '<option value="" disabled selected>📂 Kategori Değiştir...</option>';
    Object.entries(CATS).forEach(([k, c]) => {
      opts += `<option value="${k}">${c.i} ${c.l}</option>`;
    });
    catSel.innerHTML = opts;
  }

  if (btnSelAll && currentVisibleTasks.length) {
    const allSel = currentVisibleTasks.every(t => selectedTaskIds.has(t.id));
    btnSelAll.textContent = allSel ? '☒ Seçimi Kaldır' : '☑️ Tümünü Seç';
  }
}

/* ── TOPLU EYLEMLER (BULK ACTIONS) ── */
function bulkMarkDone(doneState) {
  if (!selectedTaskIds.size) { toast('Lütfen önce görev seçin.', 'i'); return; }
  let count = 0;
  S.tasks.forEach(t => {
    if (selectedTaskIds.has(t.id)) {
      t.done = doneState;
      t.completedAt = doneState ? new Date().toISOString() : null;
      count++;
    }
  });
  if (doneState) triggerConfetti();
  save(); render();
  toast(`${count} görev ${doneState ? 'tamamlandı' : 'sıfırlandı'}.`, 's');
}

function bulkChangeCategory(catKey) {
  if (!catKey || !CATS[catKey]) return;
  if (!selectedTaskIds.size) { toast('Lütfen önce görev seçin.', 'i'); return; }
  let count = 0;
  S.tasks.forEach(t => {
    if (selectedTaskIds.has(t.id)) {
      t.cat = catKey;
      count++;
    }
  });
  save(); render();
  toast(`${count} görevin kategorisi güncellendi.`, 's');
  const catSel = document.getElementById('bulkCatSel');
  if (catSel) catSel.selectedIndex = 0;
}

function bulkChangePriority(priKey) {
  if (!priKey) return;
  if (!selectedTaskIds.size) { toast('Lütfen önce görev seçin.', 'i'); return; }
  let count = 0;
  S.tasks.forEach(t => {
    if (selectedTaskIds.has(t.id)) {
      t.pri = priKey;
      count++;
    }
  });
  save(); render();
  toast(`${count} görevin önceliği güncellendi.`, 's');
  const priSel = document.getElementById('bulkPriSel');
  if (priSel) priSel.selectedIndex = 0;
}

function bulkSetDueDatePrompt() {
  if (!selectedTaskIds.size) { toast('Lütfen önce görev seçin.', 'i'); return; }
  const defaultVal = today();
  const dateStr = prompt('Seçili görevler için bitiş tarihi girin (YYYY-AA-GG veya boş bırakın):', defaultVal);
  if (dateStr === null) return;
  let count = 0;
  S.tasks.forEach(t => {
    if (selectedTaskIds.has(t.id)) {
      t.due = dateStr.trim();
      count++;
    }
  });
  save(); render();
  toast(`${count} görevin tarihi güncellendi.`, 's');
}

function bulkDeleteSelected() {
  if (!selectedTaskIds.size) { toast('Lütfen önce görev seçin.', 'i'); return; }
  const count = selectedTaskIds.size;
  showConfirm(
    '🗑️ Toplu Görev Silme',
    `Seçili ${count} görevi silmek istediğinize emin misiniz?`,
    'Bu işlem geri alınamaz.',
    '🗑️ Evet, Sil',
    () => {
      S.tasks = S.tasks.filter(t => !selectedTaskIds.has(t.id));
      selectedTaskIds.clear();
      save(); render();
      toast(`${count} görev silindi.`, 'i');
    },
    true
  );
}

/* ── TOPLU GÖREV EKLEME MODAL VE AYRIŞTIRICI ── */
function openBatchAddModal() {
  const sel = document.getElementById('batchDefaultCat');
  if (sel) {
    sel.innerHTML = Object.entries(CATS).map(([k, c]) =>
      `<option value="${k}">${c.i} ${c.l}</option>`
    ).join('');
    if (activeCat && CATS[activeCat]) sel.value = activeCat;
  }
  const inp = document.getElementById('batchTasksInput');
  if (inp) {
    inp.value = '';
    inp.oninput = () => {
      const lines = inp.value.split('\n').map(l => l.trim()).filter(Boolean);
      const cntEl = document.getElementById('batchLinesCount');
      if (cntEl) cntEl.textContent = `${lines.length} görev algılandı`;
    };
  }
  document.getElementById('batchTaskModal')?.classList.add('on');
  setTimeout(() => document.getElementById('batchTasksInput')?.focus(), 100);
}

function submitBatchAdd() {
  const inp = document.getElementById('batchTasksInput');
  const text = (inp ? inp.value : '').trim();
  if (!text) { toast('Lütfen en az bir görev yazın.', 'e'); return; }

  const defaultCat = document.getElementById('batchDefaultCat')?.value || 'diger';
  const defaultPri = document.getElementById('batchDefaultPri')?.value || 'orta';

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let addedCount = 0;

  lines.forEach(line => {
    let name = line;
    let cat = defaultCat;
    let pri = defaultPri;
    let due = '';

    const catMatch = name.match(/#([\wığüşöçİĞÜŞÖÇ]+)/i);
    if (catMatch) {
      const tag = catMatch[1].toLowerCase();
      const matchedKey = Object.keys(CATS).find(k => k.toLowerCase() === tag || CATS[k].l.toLowerCase().includes(tag));
      if (matchedKey) cat = matchedKey;
      name = name.replace(catMatch[0], '').trim();
    }

    const priMatch = name.match(/!([\wığüşöçİĞÜŞÖÇ]+)/i);
    if (priMatch) {
      const pTag = priMatch[1].toLowerCase();
      if (pTag.includes('yük') || pTag.includes('yuk')) pri = 'yuksek';
      else if (pTag.includes('or')) pri = 'orta';
      else if (pTag.includes('düş') || pTag.includes('dus')) pri = 'dusuk';
      name = name.replace(priMatch[0], '').trim();
    }

    const dueMatch = name.match(/@([\w\d\-]+)/i);
    if (dueMatch) {
      const dTag = dueMatch[1].toLowerCase();
      if (dTag.includes('bug') || dTag.includes('bugun')) due = today();
      else if (dTag.includes('yar') || dTag.includes('yarin')) due = dOff(-1);
      else if (/^\d{4}-\d{2}-\d{2}$/.test(dTag)) due = dTag;
      name = name.replace(dueMatch[0], '').trim();
    }

    if (name) {
      S.tasks.unshift({
        id: gid(), name, cat, pri, due,
        rep: 'yok', repDays: [], est: '', tag: '', note: '',
        subs: [], done: false, created: new Date().toISOString(), completedAt: null,
      });
      addedCount++;
    }
  });

  save(); render(); closeModal('batchTaskModal');
  toast(`${addedCount} toplu görev eklendi! 🎉`, 's');
}

/* ── RENDER: GÖREVLER ── */
function toggleTaskActionsMenu(e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  const menu = document.getElementById('tasksActionsMenu');
  if (menu) {
    menu.classList.toggle('on');
  }
}

function toggleTaskFocusPanel() {
  const panel = document.getElementById('tasksFocusPanel');
  const btn = document.getElementById('btnFocusPanelToggle');
  const habitsPanel = document.getElementById('tasksHabitsPanel');
  const habitsBtn = document.getElementById('btnHabitsPanelToggle');

  if (!panel) return;
  const isOpening = panel.style.display === 'none' || !panel.style.display;

  if (isOpening && habitsPanel) {
    habitsPanel.style.display = 'none';
    if (habitsBtn) habitsBtn.classList.remove('on');
  }

  panel.style.display = isOpening ? 'grid' : 'none';
  if (btn) {
    btn.classList.toggle('on', isOpening);
    try { btn.blur(); } catch (e) {}
  }
  if (isOpening) {
    renderSessions();
    renderCatTimes();
    drawTimer();
  }
}

function toggleTaskHabitsPanel() {
  const panel = document.getElementById('tasksHabitsPanel');
  const btn = document.getElementById('btnHabitsPanelToggle');
  const focusPanel = document.getElementById('tasksFocusPanel');
  const focusBtn = document.getElementById('btnFocusPanelToggle');

  if (!panel) return;
  const isOpening = panel.style.display === 'none' || !panel.style.display;

  if (isOpening && focusPanel) {
    focusPanel.style.display = 'none';
    if (focusBtn) focusBtn.classList.remove('on');
  }

  panel.style.display = isOpening ? 'block' : 'none';
  if (btn) {
    btn.classList.toggle('on', isOpening);
    try { btn.blur(); } catch (e) {}
  }
  if (isOpening) {
    renderHabits();
  }
}

// Close actions menu when clicking outside
window.addEventListener('click', function (e) {
  if (!e.target.closest('.tasks-action-dropdown-wrap')) {
    document.getElementById('tasksActionsMenu')?.classList.remove('on');
  }
});

function updatePgHdr() {
  const c = activeCat ? CATS[activeCat] : null;
  const pgTitle = document.getElementById('pgTitle');
  if (pgTitle) pgTitle.textContent = c ? `${c.i} ${c.l}` : '🗂️ Tüm Görevler';
  const pend = S.tasks.filter(t => (activeCat ? t.cat === activeCat : true) && !t.done).length;
  const pgSub = document.getElementById('pgSub');
  if (pgSub) pgSub.textContent = c ? `${pend} bekleyen görev` : 'Bekleyen ve tamamlanan görevlerinizi yönetin';

  // Günlük Görev İlerleme Barı Hesaplama (Sadece Bugüne Ait Görevler)
  const todayTasks = S.tasks.filter(t => (activeCat ? t.cat === activeCat : true) && isTaskForToday(t));
  const totalCnt = todayTasks.length;
  const doneCnt = todayTasks.filter(t => t.done).length;
  const pct = totalCnt > 0 ? Math.round((doneCnt / totalCnt) * 100) : 0;

  const valEl = document.getElementById('taskProgVal');
  const fillEl = document.getElementById('taskProgFill');
  if (valEl) valEl.textContent = totalCnt > 0 ? `%${pct} (${doneCnt}/${totalCnt})` : 'Bugün görev yok';
  if (fillEl) fillEl.style.width = `${totalCnt > 0 ? pct : 0}%`;
}

function subStats(t) {
  const arr = Array.isArray(t.subs) ? t.subs : [];
  const done = arr.filter(s => s?.done).length;
  return { done, total: arr.length, full: arr.length > 0 && done === arr.length };
}

function toggleTaskExpand(id) {
  expandedTasks.has(id) ? expandedTasks.delete(id) : expandedTasks.add(id);
  renderTasks();
}

function handleUnifiedInput(el) {
  renderTasks();
}

function quickAddUnified() {
  const inp = document.getElementById('unifiedInput') || document.getElementById('qaInp');
  if (!inp) return;
  let raw = inp.value.trim();
  if (!raw) { toast('Görev adı boş olamaz!', 'e'); return; }

  let name = raw;
  let cat = activeCat || Object.keys(CATS)[0] || 'diger';
  let pri = 'orta';
  let due = '';

  const catMatch = name.match(/#([\wığüşöçİĞÜŞÖÇ]+)/i);
  if (catMatch) {
    const tag = catMatch[1].toLowerCase();
    const matchedKey = Object.keys(CATS).find(k => k.toLowerCase() === tag || CATS[k].l.toLowerCase().includes(tag));
    if (matchedKey) cat = matchedKey;
    name = name.replace(catMatch[0], '').trim();
  }

  const priMatch = name.match(/!([\wığüşöçİĞÜŞÖÇ]+)/i);
  if (priMatch) {
    const pTag = priMatch[1].toLowerCase();
    if (pTag.includes('yük') || pTag.includes('yuk')) pri = 'yuksek';
    else if (pTag.includes('or')) pri = 'orta';
    else if (pTag.includes('düş') || pTag.includes('dus')) pri = 'dusuk';
    name = name.replace(priMatch[0], '').trim();
  }

  const dueMatch = name.match(/@([\w\d\-]+)/i);
  if (dueMatch) {
    const dTag = dueMatch[1].toLowerCase();
    if (dTag.includes('bug') || dTag.includes('bugun')) due = today();
    else if (dTag.includes('yar') || dTag.includes('yarin')) due = dOff(-1);
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dTag)) due = dTag;
    name = name.replace(dueMatch[0], '').trim();
  }

  if (!name) { toast('Görev adı boş olamaz!', 'e'); return; }

  S.tasks.unshift({
    id: gid(), name, cat, pri, due,
    rep: 'yok', repDays: [], est: '', tag: '', note: '',
    subs: [], done: false, created: new Date().toISOString(), completedAt: null,
  });

  save(); render(); inp.value = '';
  toast('Hızlı görev eklendi! 🎉', 's');
}

function renderTasks() {
  updatePgHdr();
  let baseTasks = S.tasks.slice();
  if (activeCat) baseTasks = baseTasks.filter(t => t.cat === activeCat);

  const td = today();
  // Canlı Filtre Sayılarını Güncelle
  const cAll = baseTasks.length;
  const cPend = baseTasks.filter(t => !t.done).length;
  const cToday = baseTasks.filter(isTaskDueToday).length;
  const cTomorrow = baseTasks.filter(isTaskDueTomorrow).length;
  const cDone = baseTasks.filter(t => t.done).length;
  const cOverdue = baseTasks.filter(t => t.due && !t.done && t.due < td).length;
  const cSel = selectedTaskIds.size;

  const setCnt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setCnt('cnt-all', cAll);
  setCnt('cnt-pending', cPend);
  setCnt('cnt-today', cToday);
  setCnt('cnt-tomorrow', cTomorrow);
  setCnt('cnt-done', cDone);
  setCnt('cnt-overdue', cOverdue);
  setCnt('cnt-selected', cSel);

  const overdueBtn = document.getElementById('fchip-overdue');
  if (overdueBtn) overdueBtn.style.display = 'none';

  let tasks = baseTasks.slice();
  const uInp = document.getElementById('unifiedInput') || document.getElementById('searchInp');
  const q = (uInp ? uInp.value : '').toLowerCase().trim();
  if (q) tasks = tasks.filter(t =>
    t.name.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q) || (t.tag || '').toLowerCase().includes(q)
  );

  if (statusF === 'pending') tasks = tasks.filter(t => !t.done);
  else if (statusF === 'done') tasks = tasks.filter(t => t.done);
  else if (statusF === 'today') tasks = tasks.filter(isTaskDueToday);
  else if (statusF === 'tomorrow') tasks = tasks.filter(isTaskDueTomorrow);
  else if (statusF === 'overdue') tasks = tasks.filter(t => t.due && !t.done && t.due < td);
  else if (statusF === 'selected') tasks = tasks.filter(t => selectedTaskIds.has(t.id));

  currentVisibleTasks = tasks.slice();
  updateBulkDock();

  const sortEl = document.getElementById('sortSel');
  const sortV = sortEl ? sortEl.value : 'priority';
  const po = { yuksek: 0, orta: 1, dusuk: 2 };
  tasks.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (sortV === 'priority') return (po[a.pri] || 1) - (po[b.pri] || 1);
    if (sortV === 'due') { if (!a.due && !b.due) return 0; if (!a.due) return 1; if (!b.due) return -1; return a.due.localeCompare(b.due); }
    if (sortV === 'name') return a.name.localeCompare(b.name, 'tr');
    if (sortV === 'cat') return (CATS[a.cat]?.l || '').localeCompare(CATS[b.cat]?.l || '', 'tr');
    return new Date(b.created) - new Date(a.created);
  });
  const cont = document.getElementById('taskList');
  if (!tasks.length) {
    cont.innerHTML = `<div class="empty"><div class="empty-ico">📭</div><div class="empty-txt">Bu filtrede görev bulunamadı.</div><button class="empty-btn" onclick="openAdd()">+ Yeni Görev Ekle</button></div>`;
    return;
  }
  let html = '';
  if (sortV === 'cat') {
    const groups = {};
    tasks.forEach(t => {
      const ck = t.cat || 'diger';
      if (!groups[ck]) groups[ck] = [];
      groups[ck].push(t);
    });
    Object.entries(groups).forEach(([ck, gTasks]) => {
      const c = CATS[ck] || { l: 'Diğer', i: '📌' };
      html += `<div class="task-group-cat-hdr">
        <span class="task-group-cat-ico">${c.i}</span>
        <span>${esc(c.l)}</span>
        <span class="task-group-cat-count">${gTasks.length}</span>
      </div>
      <div class="tcards">${gTasks.map(tHtml).join('')}</div>`;
    });
  } else {
    const pend = tasks.filter(t => !t.done), done = tasks.filter(t => t.done);
    if (pend.length) html += `<div class="tg"><div class="tg-hdr"><div class="tg-lbl">Bekliyor</div><div class="tg-cnt">${pend.length}</div><div class="tg-ln"></div></div><div class="tcards">${pend.map(tHtml).join('')}</div></div>`;
    if (done.length) html += `<div class="tg"><div class="tg-hdr"><div class="tg-lbl">Tamamlandı</div><div class="tg-cnt">${done.length}</div><div class="tg-ln"></div></div><div class="tcards">${done.map(tHtml).join('')}</div></div>`;
  }
  cont.innerHTML = html;
}

function tHtml(t) {
  const c = CATS[t.cat] || Object.values(CATS)[0] || { l: '?', i: '📌', c: '#9aa0b8', bg: 'rgba(154,160,184,.12)' };
  const pc = { yuksek: '#f06878', orta: '#e8b84b', dusuk: '#4ade80' };
  const pb = { yuksek: 'rgba(240,104,120,.12)', orta: 'rgba(232,184,75,.12)', dusuk: 'rgba(74,222,128,.12)' };
  const pl = { yuksek: '🔴 Yüksek', orta: 'Orta', dusuk: '🟢 Düşük' };
  const st = subStats(t);
  const isExpanded = expandedTasks.has(t.id);
  const hasLong = st.total > 5;
  const isSelected = selectedTaskIds.has(t.id);

  let dueH = '';
  if (t.due) {
    const diff = (new Date(t.due + 'T12:00:00') - new Date()) / 86400000;
    const dc = diff < 0 ? 'color:#f06878' : diff < 1 ? 'color:#fb923c' : diff < 3 ? 'color:#e8b84b' : 'color:var(--tx3)';
    dueH = `<span class="chip" style="background:transparent;${dc}">📅 ${new Date(t.due + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>`;
  }
  const tagH = t.tag ? `<span class="chip" style="background:rgba(154,160,184,.12);color:var(--tx3)">#${esc(t.tag)}</span>` : '';
  const repLabels = { gunluk: '🔄 Her Gün', haftalik: '🔄 Haftalık', aylik: '🔄 Aylık', ay_son: '🔄 Ay Sonu', her_2_gunde: '🔄 Her 2 Günde Bir', ozel: '🔄 Özel' };
  let repH = '';
  if (t.rep && t.rep !== 'yok') {
    let repTxt = repLabels[t.rep] || '🔄';
    if (t.rep === 'haftalik' && Array.isArray(t.repDays) && t.repDays.length) {
      const dn = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
      repTxt = '🔄 ' + t.repDays.map(d => dn[d]).join(', ');
    } else if (t.rep === 'aylik' && Array.isArray(t.repDays) && t.repDays.length) {
      repTxt = '🔄 Her ayın ' + t.repDays[0] + '.';
    }
    repH = `<span class="chip" style="background:rgba(154,160,184,.08);color:var(--tx3)">${repTxt}</span>`;
  }
  const remH = t.reminderTime && t.reminderRepeat && t.reminderRepeat !== 'none'
    ? `<span class="chip" style="background:rgba(62,207,176,.12);color:#059669">⏰ ${esc(t.reminderTime)}</span>`
    : '';
  const estH = t.est ? `<span class="chip" style="background:rgba(154,160,184,.08);color:var(--tx3)">⏱${esc(String(t.est))}dk</span>` : '';
  const progH = st.total ? `<span class="chip task-progress${st.full ? ' full' : ''}">✓ ${st.done}/${st.total}</span>` : '';

  // Sadeleştirme: Standart ("Orta") öncelik rozetini gizle, sadece Yüksek ve Düşük olanları göster
  const priChipH = (t.pri === 'yuksek' || t.pri === 'dusuk')
    ? `<span class="chip" style="background:${pb[t.pri]};color:${pc[t.pri]}">${pl[t.pri]}</span>`
    : '';

  const subsH = st.total ? `<div class="tc-subs">
    <div style="height:3px; background:var(--sf3); border-radius:2px; margin-bottom:6px; overflow:hidden;">
      <div style="height:100%; width:${st.total ? (st.done / st.total) * 100 : 0}%; background:var(--teal); transition:width 0.3s ease;"></div>
    </div>
    ${t.subs.map((s, i) =>
    `<div class="sub-row" onclick="toggleSub('${t.id}',${i})"><div class="sub-chk${s.done ? ' done' : ''}"></div><span class="sub-txt${s.done ? ' done' : ''}">${esc(s.text)}</span></div>`
  ).join('')}${hasLong ? `<button class="sub-more" onclick="event.stopPropagation();toggleTaskExpand('${t.id}')">${isExpanded ? 'Kapat' : 'Devamını göster (' + st.total + ')'}</button>` : ''}
  </div>` : '';

  const selectChkHtml = (isSelectMode || selectedTaskIds.size > 0)
    ? `<div class="tcard-select-chk${isSelected ? ' on' : ''}" onclick="toggleTaskSelection('${t.id}', event)">${isSelected ? '✓' : ''}</div>`
    : '';

  return `<div class="tcard${t.done ? ' done' : ''}${isSelected ? ' selected' : ''}${hasLong ? ' has-long-subs' : ''}${isExpanded ? ' expanded' : ''}">
    ${selectChkHtml}
    <div class="tcard-st" style="background:${safeColor(c.c)}"></div>
    <div class="pri-dot" style="background:${pc[t.pri] || '#9aa0b8'}"></div>
    <div class="chk${t.done ? ' done' : ''}" onclick="toggleTask('${t.id}')"></div>
    <div class="tc-body">
      <div class="tc-title">${esc(t.name)}</div>
      <div class="tc-meta">
        <span class="chip" style="background:${safeColor(c.bg)};color:${safeColor(c.c)}">${esc(c.i)} ${esc(c.l)}</span>
        ${priChipH}${progH}${dueH}${tagH}${repH}${remH}${estH}
      </div>
      ${t.note ? `<div class="tc-note">${esc(t.note)}</div>` : ''}
      ${subsH}
    </div>
    <div class="tc-side"><div class="tc-acts">
      <button class="tact edit" onclick="openEdit('${t.id}')" title="Düzenle">✏️</button>
      <button class="tact"      onclick="confirmDel('${t.id}')" title="Sil">🗑️</button>
    </div></div>
  </div>`;
}

const ISLAMIC_HOLY_DAYS = {
  '2026-01-16': { title: 'Berat Kandili', icon: '🌙', color: '#fbbf24' },
  '2026-02-18': { title: 'Ramazan Başlangıcı', icon: '☪️', color: '#3ecfb0' },
  '2026-03-15': { title: 'Kadir Gecesi', icon: '✨', color: '#fbbf24' },
  '2026-03-20': { title: 'Ramazan Bayramı 1. Gün', icon: '🎉', color: '#3ecfb0' },
  '2026-03-21': { title: 'Ramazan Bayramı 2. Gün', icon: '🎉', color: '#3ecfb0' },
  '2026-03-22': { title: 'Ramazan Bayramı 3. Gün', icon: '🎉', color: '#3ecfb0' },
  '2026-05-27': { title: 'Kurban Bayramı 1. Gün', icon: '🐑', color: '#fbbf24' },
  '2026-05-28': { title: 'Kurban Bayramı 2. Gün', icon: '🐑', color: '#fbbf24' },
  '2026-05-29': { title: 'Kurban Bayramı 3. Gün', icon: '🐑', color: '#fbbf24' },
  '2026-05-30': { title: 'Kurban Bayramı 4. Gün', icon: '🐑', color: '#fbbf24' },
  '2026-06-16': { title: 'Hicri Yılbaşı 1448', icon: '🌙', color: '#a78bfa' },
  '2026-06-25': { title: 'Aşure Günü', icon: '🥣', color: '#fbbf24' },
  '2026-08-25': { title: 'Mevlid Kandili', icon: '✨', color: '#fbbf24' },
  '2026-12-17': { title: 'Regaip Kandili', icon: '🌙', color: '#fbbf24' }
};

function getHijriStr(dateObj) {
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
  const dStr = typeof today === 'function' ? today() : '';
  const dtFormatted = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

  if (dtFormatted === dStr) {
    try {
      const cached = JSON.parse(localStorage.getItem('mikat-hijri-official') || 'null');
      if (cached && cached.date === dStr && cached.str) return cached.str;
    } catch (e) { }
  }

  const GREGORIAN_MONTHS = ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'];

  try {
    const parts = new Intl.DateTimeFormat('tr-TR-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).formatToParts(dateObj);

    let day = '', month = '', year = '';
    for (const p of parts) {
      if (p.type === 'day') day = p.value;
      if (p.type === 'month') month = p.value;
      if (p.type === 'year') year = p.value;
    }

    const yNum = parseInt(year, 10);
    const mLower = (month || '').trim().toLowerCase();

    // Safari/WebKit mobil hatası: Yıl 1448 gelse bile ay adı Miladi (Ocak, Temmuz) gelebiliyor.
    // Eğer gelen ay adı Miladi aylar listesindeyse, Intl çıktısını reddet ve güvenli yedek algoritmayı çalıştır!
    if (!yNum || yNum > 1800 || yNum < 1300 || !month || !isNaN(month) || GREGORIAN_MONTHS.includes(mLower)) {
      return getHijriFallback(dateObj);
    }
    return `${day} ${month} ${year}`;
  } catch (e) { }

  return getHijriFallback(dateObj);
}

function getHijriFallback(date) {
  const HIJRI_MONTHS = [
    'Muharrem', 'Sefer', 'Rebiülevvel', 'Rebiülahir',
    'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban',
    'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'
  ];

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  if (month < 2) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524;

  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;

  let mH = Math.floor((24 * l) / 709);
  let dH = Math.floor(l - Math.floor((709 * mH) / 24));
  let yH = 30 * n + j - 30;

  if (mH < 1 || mH > 12) mH = 1;
  const monthName = HIJRI_MONTHS[mH - 1] || 'Muharrem';

  return `${dH} ${monthName} ${yH}`;
}

function selectCalendarDay(ds) {
  selectedDate = ds;
  const tooltip = document.getElementById('calTooltip');
  if (tooltip) tooltip.style.display = 'none';
  if (window.calTooltipTimeout) clearTimeout(window.calTooltipTimeout);
  if (window.calLongPressTimer) clearTimeout(window.calLongPressTimer);
  renderCalendar();
}

function handleCalendarDayClick(ds, event) {
  selectCalendarDay(ds);
}

window.calLongPressTimer = null;

function handleWdayPointerDown(e, ds) {
  if (window.calLongPressTimer) clearTimeout(window.calLongPressTimer);
  const target = e.currentTarget;
  window.calLongPressTimer = setTimeout(() => {
    showCalTooltip({ currentTarget: target }, ds);
  }, 350); // 350ms basılı tutunca görevi göster
}

function handleWdayPointerUp(e) {
  if (window.calLongPressTimer) {
    clearTimeout(window.calLongPressTimer);
    window.calLongPressTimer = null;
  }
}

function openDayDetailModal(ds) {
  selectedDate = ds || selectedDate || today();
  renderCalendar();

  const modal = document.getElementById('dayDetailModal');
  if (!modal) return;

  const dateObj = new Date(selectedDate + 'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  const hijriStr = getHijriStr(dateObj);

  const dTitle = document.getElementById('dayDetailTitle');
  if (dTitle) dTitle.textContent = `🗓️ ${dateStr}`;
  const dSub = document.getElementById('dayDetailSub');
  if (dSub) dSub.textContent = hijriStr ? `🌙 ${hijriStr}` : 'Günün detaylı görev ve ibadet takibi';

  // 1. Görevler Listesi
  const tasks = S.tasks.filter(t => t.due === selectedDate);
  const taskListEl = document.getElementById('dayDetailTasksList');
  if (taskListEl) {
    if (!tasks.length) {
      taskListEl.innerHTML = `<div style="font-size:0.76rem; color:var(--tx3); text-align:center; padding:12px; border:1px dashed var(--bd); border-radius:8px;">Bu gün için henüz görev eklenmemiş.</div>`;
    } else {
      taskListEl.innerHTML = tasks.map(t => {
        const cat = CATS[t.cat] || { n: 'Genel', c: '#9aa0b8' };
        return `<div style="display:flex; align-items:center; justify-content:space-between; padding:7px 10px; background:var(--sf); border:1px solid var(--bd); border-radius:8px; font-size:0.78rem;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1;">
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask('${t.id}'); openDayDetailModal('${selectedDate}');" style="cursor:pointer; width:15px; height:15px;"/>
            <span style="font-weight:700; color:var(--tx); ${t.done ? 'text-decoration:line-through; opacity:0.6;' : ''} overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(t.name)}</span>
          </div>
          <span style="background:${cat.c}22; color:${cat.c}; border:1px solid ${cat.c}44; padding:2px 6px; border-radius:6px; font-weight:800; font-size:0.68rem;">${esc(cat.n)}</span>
        </div>`;
      }).join('');
    }
  }

  // 2. Namaz Vakitleri & Durumu
  const prayersEl = document.getElementById('dayDetailPrayersList');
  if (prayersEl) {
    const dayPrayers = S.prayers[selectedDate] || {};
    prayersEl.innerHTML = PRAYERS.map(p => {
      const isDone = !!dayPrayers[p.n];
      return `<div style="padding:6px; background:${isDone ? 'rgba(5, 150, 105, 0.15)' : 'var(--sf)'}; border:1px solid ${isDone ? 'var(--grn)' : 'var(--bd)'}; border-radius:8px;">
        <div style="font-size:0.72rem; font-weight:800; color:var(--tx);">${p.t}</div>
        <div style="font-size:0.65rem; color:${isDone ? 'var(--grn)' : 'var(--tx3)'}; margin-top:2px;">${isDone ? '✅ Kılındı' : '⚪ Kılınmadı'}</div>
      </div>`;
    }).join('');
  }

  modal.classList.add('on');
}

function renderCalendar() {
  const td = today();
  if (!selectedDate) selectedDate = td;
  const sel = new Date(selectedDate + 'T12:00:00');
  const year = sel.getFullYear(), month = sel.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - (first.getDay() === 0 ? 6 : first.getDay() - 1));
  const dnames = ['PTS', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'];
  const calSubEl = document.getElementById('calSub');
  if (calSubEl) {
    calSubEl.textContent =
      new Date(selectedDate + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }) + ' için planlama';
  }
  const mt = document.getElementById('monthTitle');
  if (mt) {
    const gregStr = sel.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    const hijriStr = getHijriStr(sel);
    mt.innerHTML = `<span>${gregStr}</span>${hijriStr ? `<span style="font-size:0.80rem; color:var(--gold); font-weight:700; font-family:var(--font-arabic);">🌙 ${hijriStr}</span>` : ''}`;
  }
  const heads = dnames.map(d => `<div class="mday-head">${d}</div>`).join('');
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isT = ds === td, isSel = ds === selectedDate, other = d.getMonth() !== month;
    const tasks = S.tasks.filter(t => t.due === ds);
    const pending = tasks.filter(t => !t.done).length;
    const allDone = tasks.length > 0 && pending === 0;
    const dots = tasks.slice(0, 6).map(t =>
      `<div class="wdot" style="background:${safeColor(CATS[t.cat]?.c || '#9aa0b8')};opacity:${t.done ? 1 : .4}"></div>`
    ).join('');

    // Görev yoğunluğu (heat-map) hesaplama
    let heatClass = '';
    if (tasks.length > 0) {
      if (tasks.length <= 2) heatClass = ' heat-1';
      else if (tasks.length <= 4) heatClass = ' heat-2';
      else heatClass = ' heat-3';
    }

    // Görev başlığı önizlemeleri (Masaüstü için)
    let titleLines = '';
    if (tasks.length > 0) {
      titleLines = `<div class="wday-task-titles-list">
        ${tasks.slice(0, 2).map(t => `<div class="wday-task-title-line${t.done ? ' done' : ''}">${esc(t.name)}</div>`).join('')}
        ${tasks.length > 2 ? `<div class="wday-task-more-line">+${tasks.length - 2} daha</div>` : ''}
      </div>`;
    }

    const hoverAttrs = tasks.length > 0
      ? ` onmouseenter="showCalTooltip(event, '${ds}')" onmouseleave="hideCalTooltip()" onpointerdown="handleWdayPointerDown(event, '${ds}')" onpointerup="handleWdayPointerUp(event)" onpointercancel="handleWdayPointerUp(event)"`
      : '';

    const holy = ISLAMIC_HOLY_DAYS[ds];
    const holyBadge = holy
      ? `<div class="wday-holy-badge" title="${esc(holy.title)}" style="background:${holy.color}22; color:${holy.color}; border:1px solid ${holy.color}55;">${holy.icon} ${esc(holy.title)}</div>`
      : '';

    return `<div class="wday${isT ? ' today' : ''}${isSel ? ' sel' : ''}${other ? ' other' : ''}${tasks.length ? ' has-tasks' : ''}${allDone ? ' all-done' : ''}${heatClass}"${hoverAttrs}
      onclick="handleCalendarDayClick('${ds}', event)">
      <div class="wday-n">${d.getDate()}</div>
      ${holyBadge}
      <div class="wdots">${dots}</div>
      ${tasks.length ? `<div class="wday-tasks-count-mobile">${tasks.length} görev</div>` : ''}
      ${titleLines}
    </div>`;
  }).join('');
  const wgrid = document.getElementById('wgrid');
  if (wgrid) wgrid.innerHTML = heads + days;
  try { updateMobileStats(); } catch(e) {}
}

window.calTooltipTimeout = null;
window.currentHoveredWday = null;
window.currentHoveredDs = null;

function showCalTooltip(e, ds) {
  if (window.calTooltipTimeout) clearTimeout(window.calTooltipTimeout);
  window.currentHoveredWday = e.currentTarget;
  window.currentHoveredDs = ds;

  const tooltip = document.getElementById('calTooltip');
  if (!tooltip) return;

  const tasks = S.tasks.filter(t => t.due === ds);
  if (!tasks.length) {
    tooltip.style.display = 'none';
    return;
  }

  const dateObj = new Date(ds + 'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

  let html = `<div class="cal-tt-header">${dateStr} Görevleri</div>`;
  html += `<div class="cal-tt-list">`;

  tasks.forEach(t => {
    const cat = CATS[t.cat] || { n: 'Genel', c: '#9aa0b8' };
    const priMap = {
      'yuksek': { icon: '🔴', label: 'Yüksek' },
      'orta': { icon: '🟡', label: 'Orta' },
      'dusuk': { icon: '🟢', label: 'Düşük' }
    };
    const pri = priMap[t.pri] || { icon: '⚪', label: 'Normal' };
    const doneClass = t.done ? ' done' : '';

    html += `
      <div class="cal-tt-item${doneClass}" onclick="toggleCalTooltipTask('${t.id}', event)">
        <span class="cal-tt-status">${t.done ? '✅' : '⬜'}</span>
        <div class="cal-tt-content">
          <div class="cal-tt-name">${esc(t.name)}</div>
          <div class="cal-tt-meta">
            <span class="cal-tt-cat" style="color: ${safeColor(cat.c)};"><span class="cal-tt-dot" style="background: ${safeColor(cat.c)};"></span>${esc(cat.n)}</span>
            <span class="cal-tt-pri">${pri.icon} ${pri.label}</span>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  tooltip.innerHTML = html;
  tooltip.style.display = 'block';

  const rect = e.currentTarget.getBoundingClientRect();

  let top = window.scrollY + rect.top - tooltip.offsetHeight - 10;
  let left = window.scrollX + rect.left + (rect.width - tooltip.offsetWidth) / 2;

  // Bounds checking
  if (rect.top - tooltip.offsetHeight - 10 < 0) {
    top = window.scrollY + rect.bottom + 10;
  }

  if (left < 10) {
    left = 10;
  } else if (left + tooltip.offsetWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltip.offsetWidth - 10;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

function hideCalTooltip() {
  window.calTooltipTimeout = setTimeout(() => {
    const tooltip = document.getElementById('calTooltip');
    if (tooltip) tooltip.style.display = 'none';
  }, 120);
}

function toggleCalTooltipTask(id, event) {
  if (event) event.stopPropagation();
  toggleTask(id);
  renderCalendar();
  if (window.currentHoveredWday && window.currentHoveredDs) {
    showCalTooltip({ currentTarget: window.currentHoveredWday }, window.currentHoveredDs);
  }
}

function changeMonth(delta) {
  if (!selectedDate) selectedDate = today();
  const d = new Date(selectedDate + 'T12:00:00');
  const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + delta);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  selectedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  renderCalendar();
}

/* ── RENDER: ANALİTİK ── */
function habitRate(id, days) {
  let done = 0;
  for (let i = 0; i < days; i++) if (S.habits[dOff(i)]?.[id]) done++;
  return { done, total: days, pct: Math.round(done / (days || 1) * 100) };
}
function longestStreak(id, days = 365) {
  let best = 0, cur = 0;
  for (let i = days - 1; i >= 0; i--) {
    if (S.habits[dOff(i)]?.[id]) { cur++; best = Math.max(best, cur); } else cur = 0;
  }
  return best;
}
function habitSeriesHtml() {
  if (!HABITS.length) return '';
  const cards = HABITS.map(h => {
    const r7 = habitRate(h.id, 7);
    const r30 = habitRate(h.id, 30);
    const cur = streak(h.id);
    const best = longestStreak(h.id, 365);
    const dots = Array.from({ length: 7 }, (_, i) => {
      const ds = dOff(6 - i);
      const isDone = !!(S.habits[ds]?.[h.id]);
      return `<div class="sc-day${isDone ? ' done' : ''}${ds === today() ? ' today' : ''}" title="${ds}">${isDone ? '✓' : ''}</div>`;
    }).join('');
    return `<div class="series-card">
      <div class="sc-top"><div class="sc-name"><span class="sc-label">${esc(h.l)}</span></div><div class="sc-streak">🔥 ${cur}</div></div>
      <div class="sc-metrics">
        <div class="sc-metric"><strong>%${r7.pct}</strong><span>7 Gün</span></div>
        <div class="sc-metric"><strong>${best}</strong><span>En Uzun</span></div>
      </div>
      <div class="sc-prog"><div class="sc-fill" style="width:${r30.pct}%"></div></div>
      <div class="sc-sub">30 gün: ${r30.done}/${r30.total} · %${r30.pct}</div>
      <div class="sc-days">${dots}</div>
    </div>`;
  }).join('');
  return `<div class="series-title">🔥 Alışkanlık Serileri</div><div class="series-grid">${cards}</div>`;
}
// H-06: Haftalık tekrar repDays dizisini de kontrol ediyor
function taskOccursOn(t, ds) {
  if (t.due === ds) return true;
  const rep = t.rep || 'yok'; if (rep === 'yok') return false;
  const start = t.due || (t.created?.slice(0, 10) || today());
  if (!start || ds < start || ds > today()) return false;
  const d1 = new Date(start + 'T12:00:00'), d2 = new Date(ds + 'T12:00:00');
  const diff = Math.round((d2 - d1) / 86400000); if (diff < 0) return false;
  if (rep === 'gunluk') return true;
  if (rep === 'haftalik') {
    // repDays varsa haftanın belirli günlerini kontrol et
    if (Array.isArray(t.repDays) && t.repDays.length) {
      return t.repDays.includes(d2.getDay());
    }
    return diff % 7 === 0;
  }
  if (rep === 'aylik') {
    if (Array.isArray(t.repDays) && t.repDays.length) {
      return t.repDays.includes(d2.getDate());
    }
    return d1.getDate() === d2.getDate();
  }
  if (rep === 'her_2_gunde') return diff % 2 === 0;
  if (rep === 'ozel' && t.repInterval > 1) return diff % t.repInterval === 0;
  return false;
}
function catSeriesHtml() {
  const cards = Object.entries(CATS).map(([k, c]) => {
    let streak2 = 0, best = 0, cur2 = 0, done7 = 0, total7 = 0, done30 = 0, total30 = 0;
    const arr = Array.from({ length: 7 }, (_, i) => dOff(6 - i));
    const dots = arr.map((ds, i) => {
      const list = S.tasks.filter(t => t.cat === k && taskOccursOn(t, ds));
      const done = list.filter(t => (t.completedAt?.slice(0, 10) === ds) || (t.due === ds && t.done)).length;
      if (i >= 7 - 7) { done7 += done; total7 += list.length; }
      done30 += done; total30 += list.length;
      const cls = list.length === 0 ? '' : done === list.length ? 'done' : 'partial';
      return `<div class="sc-day ${cls}${ds === today() ? ' today' : ''}" title="${ds}">${done === list.length && list.length ? '✓' : done || ''}</div>`;
    }).join('');
    for (let i = 0; i < 30; i++) {
      const list = S.tasks.filter(t => t.cat === k && taskOccursOn(t, dOff(i)));
      const dn = list.filter(t => (t.completedAt?.slice(0, 10) === dOff(i)) || (t.due === dOff(i) && t.done)).length;
      if (list.length > 0 && dn === list.length) { streak2++; best = Math.max(best, streak2); } else streak2 = 0;
    }
    const p7 = total7 ? Math.round(done7 / total7 * 100) : 0;
    const p30 = total30 ? Math.round(done30 / total30 * 100) : 0;
    return `<div class="series-card">
      <div class="sc-top"><div class="sc-name"><span style="font-size:.95rem">${esc(c.i)}</span><span class="sc-label">${esc(c.l)}</span></div><div class="sc-streak">🔥 ${streak2}</div></div>
      <div class="sc-metrics">
        <div class="sc-metric"><strong>%${p7}</strong><span>7 Gün</span></div>
        <div class="sc-metric"><strong>${best}</strong><span>En Uzun</span></div>
      </div>
      <div class="sc-prog"><div class="sc-fill" style="width:${p30}%;background:${safeColor(c.c)}"></div></div>
      <div class="sc-sub">30 gün: ${done30}/${total30} · %${p30}</div>
      <div class="sc-days">${dots}</div>
    </div>`;
  }).join('');
  return `<div class="series-title">📈 Kategori Seri Takibi</div><div class="series-grid">${cards}</div>`;
}
function renderAnalytics() {
  const total = S.tasks.length;
  const done = S.tasks.filter(t => t.done).length;
  const over = S.tasks.filter(t => t.due && t.due < today() && !t.done).length;
  const d = today();
  const focus = Object.values(S.catTime[d] || {}).reduce((a, b) => a + b, 0);
  const sess = S.timerSess[d] || 0;

  // Bu ay verimlilik oranı
  const curMonth = d.substring(0, 7);
  const monthTasks = S.tasks.filter(t => t.due && t.due.startsWith(curMonth));
  const monthDone = monthTasks.filter(t => t.done).length;
  const monthPct = monthTasks.length ? Math.round((monthDone / monthTasks.length) * 100) : 0;

  const cards = [
    { v: total, l: 'Toplam Görev', c: 'var(--tx)' },
    { v: done, l: 'Tamamlanan', c: 'var(--grn)', tr: '%' + Math.round(done / (total || 1) * 100) + ' oran' },
    { v: total - done, l: 'Bekleyen', c: 'var(--gold)' },
    { v: over, l: 'Geciken', c: 'var(--rose)' },
    { v: focus ? fmtSec(focus) : '0dk', l: 'Bugün Odak', c: 'var(--teal)' },
    { v: `%${monthPct}`, l: 'Bu Ay Verimlilik', c: 'var(--gold)', tr: `${monthDone}/${monthTasks.length} görev` },
  ];
  const agrid = document.getElementById('agrid');
  if (agrid) {
    agrid.innerHTML = cards.map(x =>
      `<div class="acard"><div class="aval" style="color:${x.c}">${x.v}</div><div class="albl">${x.l}</div>${x.tr ? `<div class="atrend">${x.tr}</div>` : ''}</div>`
    ).join('');
  }
  const aperf = document.getElementById('aperf');
  if (aperf) aperf.innerHTML = habitSeriesHtml() + catSeriesHtml();
  renderWeeklyIbadet();
}

/* ── RENDER: SAAT ── */
function renderSmartAssistant() {
  const el = document.getElementById('headerAssistantMsg');
  if (!el) return;
  const now = new Date();
  const h = now.getHours();
  const td = today();
  const tdTasks = S.tasks.filter(isTaskForToday);
  const done = tdTasks.filter(t => t.done).length;
  const total = tdTasks.length;
  const pct = total ? Math.round(done / total * 100) : 0;
  const namazDone = PRAYERS.filter(p => S.prayers[td]?.[p.n]).length;

  let msg = '';
  if (h >= 4 && h < 6) msg = `🌅 Sabah namazı vakti • ${namazDone}/5 namaz`;
  else if (h >= 6 && h < 12) msg = `☀️ Günaydın! • ${done}/${total} görev tamamlandı`;
  else if (h >= 12 && h < 14) msg = `🕌 Öğle vakti • Bugün ${pct}% verimlilik`;
  else if (h >= 14 && h < 17) msg = `⚡ Öğleden sonra • ${total - done} görev bekliyor`;
  else if (h >= 17 && h < 20) msg = `🌇 Akşam üzeri • ${namazDone}/5 namaz kılındı`;
  else if (h >= 20 && h < 23) msg = `🌙 İyi akşamlar • ${pct}% tamamlandı`;
  else msg = `⭐ İyi geceler • Bugün ${done} görev tamamlandı`;

  if (el.textContent !== msg) el.textContent = msg;
}

function renderClock() {
  // Header namaz vakti göstergesini güncelle
  renderHeaderPrayerVakit();
  updateDialCountdownAndNeedle();
  renderPrayerTimeline();
}

function updateDialCountdownAndNeedle() {
  const dialNeedle = document.getElementById('dialNeedle');
  const dialCountdown = document.getElementById('dialCountdown');
  const dialLabel = document.getElementById('dialCountdownLabel');
  if (!PRAYERS || PRAYERS.length !== 5) return;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nowSec = now.getSeconds();

  // ── İğne açısı (saniyeler dahil hassas) ──
  if (dialNeedle) {
    const totalMins = nowMin + nowSec / 60;
    const fMin = PRAYERS[0].t.split(':').map(Number).reduce((a, b) => a * 60 + b);
    const relativeMins = ((totalMins - fMin) % 1440 + 1440) % 1440;
    // Sol kenar = Sabah vakti (0°), sağ kenar = Sabah+24s (180°)
    const needleAngle = (relativeMins / 1440) * 180 - 90;
    dialNeedle.setAttribute('transform', `rotate(${needleAngle} 100 110)`);
  }

  // ── Geri sayım: aktif vakit adı + kalan süre ──
  if (dialCountdown) {
    const cur = nowMin * 60 + nowSec;
    const toS = t => t.split(':').map(Number).reduce((h, m) => (h * 60 + m) * 60);
    const fS = toS(PRAYERS[0].t);
    const sunS = SUNRISE_TIME ? SUNRISE_TIME.split(':').map(Number).reduce((h, m) => h * 60 + m) * 60 : fS + 3000;
    const oS = toS(PRAYERS[1].t);
    const iS = toS(PRAYERS[2].t);
    const aS = toS(PRAYERS[3].t);
    const yS = toS(PRAYERS[4].t);

    let targetS = 0, activeName = '';
    if (cur >= fS && cur < sunS) { targetS = sunS; activeName = 'Sabah'; }
    else if (cur >= sunS && cur < oS) { targetS = oS; activeName = 'Güneş'; }
    else if (cur >= oS && cur < iS) { targetS = iS; activeName = 'Öğle'; }
    else if (cur >= iS && cur < aS) { targetS = aS; activeName = 'İkindi'; }
    else if (cur >= aS && cur < yS) { targetS = yS; activeName = 'Akşam'; }
    else if (cur >= yS) { targetS = fS + 86400; activeName = 'Yatsı'; }
    else { targetS = fS; activeName = 'Yatsı'; }

    let diff = targetS - cur;
    if (diff < 0) diff += 86400;

    const hh = String(Math.floor(diff / 3600)).padStart(2, '0');
    const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const ss = String(diff % 60).padStart(2, '0');

    dialCountdown.innerHTML =
      `${hh}:${mm}<span style="font-size:0.65em;font-weight:900;vertical-align:super;margin-left:2px;" id="dialCountdownSec">${ss}</span>`;
    if (dialLabel) dialLabel.textContent = activeName + ' Vakti — Bitimine';
  }
}

/* ── SİDEBAR DİNAMİK NAMAZ VAKTİ KARTI ── */
function getCurrentPrayerInfo() {
  if (!PRAYERS || PRAYERS.length === 0) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const times = PRAYERS.map(p => {
    const [h, m] = p.t.split(':').map(Number);
    return { name: p.n, minutes: h * 60 + m, timeStr: p.t };
  });

  times.sort((a, b) => a.minutes - b.minutes);

  if (currentMinutes < times[0].minutes) {
    const yatsı = times[times.length - 1];
    const sabah = times[0];
    const diff = sabah.minutes - currentMinutes;
    return { current: yatsı.name, next: sabah.name, left: diff, nextTime: sabah.timeStr };
  }

  let currentIdx = -1;
  for (let i = 0; i < times.length; i++) {
    const start = times[i].minutes;
    const end = (i === times.length - 1) ? (24 * 60 + times[0].minutes) : times[i + 1].minutes;
    if (currentMinutes >= start && currentMinutes < end) {
      currentIdx = i;
      break;
    }
  }

  if (currentIdx !== -1) {
    const cur = times[currentIdx];
    const nextIdx = (currentIdx + 1) % times.length;
    const next = times[nextIdx];

    let diff = 0;
    if (nextIdx === 0) {
      diff = (24 * 60 - currentMinutes) + next.minutes;
    } else {
      diff = next.minutes - currentMinutes;
    }
    return { current: cur.name, next: next.name, left: diff, nextTime: next.timeStr };
  }

  return null;
}

function formatRemainingTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) {
    return `${h} sa ${m} dk`;
  }
  return `${m} dk`;
}

function renderHeaderPrayerVakit() {
  const container = document.getElementById('headerPrayerVakit');
  if (container) container.innerHTML = '';
}

/* ── AKILLI GÜNLÜK ASİSTAN ── */
function buildAssistantMessages() { return []; }
function tickHeaderAssistant() { renderHeaderAssistant(); }
function initHeaderAssistant() { renderHeaderAssistant(); }

/* ── TOAST ── */
function toast(msg, type) {
  const icons = { s: '✅', e: '❌', i: 'ℹ️', w: '⚠️' };
  const tc = document.getElementById('tc');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span>${esc(icons[type] || '')}</span><span>${esc(msg)}</span>`;
  tc.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 320); }, 2800);
}

/* ── SIFIRLAMA PANELİ ── */
function dailyReset() {
  showConfirm(
    '↺ Günlük Sıfırla',
    'Bugünün işaretleri sıfırlansın mı?',
    '• Görev işaretleri (tekrarlı & bugünlük)\n• Namaz, zikir, alışkanlık tikleri temizlenir\n• Görevler ve kategoriler korunur',
    '↺ Sıfırla',
    () => {
      const td = today(); let n = 0;
      S.tasks.forEach(t => { if (isTaskDueToday(t) && t.done) { t.done = false; t.completedAt = null; t.subs?.forEach(s => s.done = false); n++; } });
      if (S.prayers) delete S.prayers[td];
      if (S.habits) delete S.habits[td];
      if (S.zikirDone) delete S.zikirDone[td];
      save(); render(); toast(`Günlük işaretler sıfırlandı. Görev: ${n}`, 's');
    },
    false
  );
}
function trackingReset() {
  showConfirm(
    '📊 Takip Verilerini Sıfırla',
    'Takip verileri sıfırlansın mı?',
    'Silinir: Alışkanlık geçmişi, namaz, zikir, odaklanma süreleri\nKalır: Görevler, kategoriler, alışkanlık isimleri',
    '📊 Sıfırla',
    () => {
      S.prayers = {}; S.habits = {}; S.zikirDone = {}; S.catTime = {}; S.timerSess = {};
      S.tasks.forEach(t => t.completedAt = null);
      save(); render(); toast('Takip verileri sıfırlandı.', 's');
    },
    true
  );
}
function factoryReset() {
  // H-13: prompt() kaldırıldı — factoryModal (text input) kullanılıyor
  const inp = document.getElementById('factoryConfirmInp');
  if (inp) inp.value = '';
  const btn = document.getElementById('factoryOkBtn');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed'; }
  document.getElementById('factoryModal')?.classList.add('on');
  setTimeout(() => inp?.focus(), 80);
}
function factoryCheckInput(inp) {
  const ok = inp.value === 'SIFIRLA';
  const btn = document.getElementById('factoryOkBtn');
  btn.disabled = !ok;
  btn.style.opacity = ok ? '1' : '0.4';
  btn.style.cursor = ok ? 'pointer' : 'not-allowed';
}
function doFactoryReset() {
  closeModal('factoryModal');
  localStorage.removeItem('mikat'); localStorage.removeItem('mikat-v5'); localStorage.removeItem('mikat-v6'); localStorage.removeItem('mikat-auto-backup');
  CATS = JSON.parse(JSON.stringify(DEFAULT_CATS));
  HABITS = JSON.parse(JSON.stringify(DEFAULT_HABITS));
  S = {
    tasks: [], prayers: {}, habits: {}, zikirDone: {}, zikirCardCounts: {}, catTime: {}, timerSess: {},
    theme: 'light', cats: null, habitDefs: null, lastReset: '', notifEnabled: false, namazCity: 'Konya',
    autoBackup: false, lastBackup: '', lat: null, lng: null, books: [], quotes: [], nafile: {},
    teacherTasks: [], snippets: [], webTools: [], subdomains: [],
    qada: { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 }, esmaMemorized: {},
    quran: { surah: 1, surahName: 'Fâtiha', page: 1, ayah: 1, routines: {} },
    customMenus: { komutrotasi: false, teacher: false, books: false },
    customMenuNames: { komutrotasi: '🌐 Komut Rotası', teacher: '🏫 Bilişimci Hocam', books: '📚 Kitaplık' }
  };
  selectedDate = today(); activeCat = null; statusF = 'all';
  applyTheme('light'); save(); render(); renderSelects();
  toast('Fabrika ayarlarına dönüldü.', 's');
}

/* ── ANA RENDER ── */
function render() {
  try { renderSelects(); } catch (e) { }
  try { renderCatCards(); } catch (e) { }
  try { renderDayProg(); } catch (e) { }
  try { renderNamazProg(); } catch (e) { }
  try { renderNamaz(); } catch (e) { }
  try { renderCalendar(); } catch (e) { }
  try { renderTasks(); } catch (e) { }
  try { renderHabits(); } catch (e) { }
  try { renderSessions(); } catch (e) { }
  try { renderCatTimes(); } catch (e) { }
  try { drawTimer(); } catch (e) { }
  try { initDailyQuotes(); } catch (e) { }
  try { renderEsma(); } catch (e) { }
  try { renderDailyZikir(); } catch (e) { }
  try { renderAuthCard(); } catch (e) { }
  try { renderHeaderAssistant(); } catch (e) { }
  try { applyCustomMenusUI(); } catch (e) { }
  if (document.getElementById('v-habits')?.classList.contains('on') || document.getElementById('v-analytics')?.classList.contains('on')) {
    try { renderAnalytics(); } catch (e) { }
  }
}

/* ── TOHUM VERİSİ (DEVREDEN ÇIKARILDI - BAŞLANGIÇTA GÖREVLER BOŞ GELİR) ── */
function seed() {
  return;
}

/* ── KEYBOARD KISAYOLLARI ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['taskModal', 'confModal', 'catModal', 'settingsModal', 'habitModal', 'habitDelModal', 'factoryModal'].forEach(closeModal);
    closeHabitModal();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) { e.preventDefault(); openAdd(); }
});

/* ── SES KILIT AÇ ── */
document.addEventListener('click', unlockAudio, { once: true });

/* ── PWA ── */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
  if (!localStorage.getItem('pwaDismissed'))
    document.getElementById('pwaBanner')?.classList.add('show');
});
function pwsInstall() {
  if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(() => { deferredPrompt = null; pwaDismiss(); }); }
}
function pwaDismiss() {
  document.getElementById('pwaBanner')?.classList.remove('show');
  localStorage.setItem('pwaDismissed', '1');
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(reg => {
    reg.update();
    reg.addEventListener('updatefound', () => {
      const newSW = reg.installing;
      if (!newSW) return;
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
          toast('Güncellendi! Yenileniyor...', 'i');
          setTimeout(() => location.reload(), 1000);
        }
      });
    });
  }).catch(() => { });
}

/* ── NAFİLE, KERAHET, VAKTİN HADİSİ, KAZA HESAPLAMA ── */
const NAFILE_LIST = ['Teheccüd', 'Duha (Kuşluk)', 'Evvabin', 'Şükür Namazı'];
function renderNafile() {
  const d = today();
  const grid = document.getElementById('nafileGrid');
  if (!grid) return;
  if (!S.nafile) S.nafile = {};
  if (!S.nafile[d]) S.nafile[d] = {};
  grid.innerHTML = NAFILE_LIST.map(n => {
    const isDone = !!(S.nafile[d][n]);
    return `<div class="nafile-item${isDone ? ' done' : ''}" onclick="toggleNafile('${n}')">
      <div class="chk${isDone ? ' done' : ''}"></div>
      <div class="nn">${n}</div>
    </div>`;
  }).join('');
}
function toggleNafile(n) {
  const d = today();
  if (!S.nafile) S.nafile = {};
  if (!S.nafile[d]) S.nafile[d] = {};
  S.nafile[d][n] = !S.nafile[d][n];
  save();
  renderNafile();
}
function renderKerahet() {
  const banner = document.getElementById('kerahatBanner');
  if (!banner) return;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const ogleTime = PRAYERS.find(p => p.n === 'Öğle')?.t;
  const aksamTime = PRAYERS.find(p => p.n === 'Akşam')?.t;
  let isKerahat = false;
  let msg = '';
  if (ogleTime) {
    const [oh, om] = ogleTime.split(':').map(Number);
    const ogleMin = oh * 60 + om;
    if (nowMin >= ogleMin - 45 && nowMin < ogleMin) {
      isKerahat = true;
      msg = '⚠️ Öğle kerahet vakti (İstiva): Öğle ezanına 45 dakikadan az kaldı. Namaz kılınması mekruhtur.';
    }
  }
  if (!isKerahat && aksamTime) {
    const [ah, am] = aksamTime.split(':').map(Number);
    const aksamMin = ah * 60 + am;
    if (nowMin >= aksamMin - 45 && nowMin < aksamMin) {
      isKerahat = true;
      msg = '⚠️ Akşam kerahet vakti (Güneş batışı): Akşam ezanına 45 dakikadan az kaldı. Sadece ikindi namazının farzı kılınabilir, nafile kılınmaz.';
    }
  }
  if (!isKerahat && SUNRISE_TIME) {
    const [sh, sm] = SUNRISE_TIME.split(':').map(Number);
    const sunriseMin = sh * 60 + sm;
    if (nowMin >= sunriseMin && nowMin < sunriseMin + 45) {
      isKerahat = true;
      msg = '⚠️ Sabah kerahet vakti (Güneş doğuşu): Güneş yeni doğdu. İlk 45 dakika namaz kılınması mekruhtur.';
    }
  }
  if (isKerahat) {
    banner.textContent = msg;
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }
}
const VAKIT_QUOTES = {
  Sabah: {
    ar: "وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا",
    t: "Güneşin doğmasından önce ve batmasından önce Rabbini hamd ile tesbih et.",
    s: "Tâhâ 20/130",
    h: "Sabah namazının iki rekat sünneti, dünyadan ve dünyadaki her şeyden daha hayırlıdır.",
    hs: "Buhârî, Salât, 12"
  },
  Öğle: {
    ar: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ",
    t: "Namazlara ve orta namaza devam edin.",
    s: "Bakara 2/238",
    h: "Öğle namazından önce kılınan dört rekatta gök kapıları açılır.",
    hs: "Tirmizî, Vitir, 9"
  },
  İkindi: {
    ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    t: "Namazı kılın, zekatı verin ve rüku edenlerle birlikte rüku edin.",
    s: "Bakara 2/43",
    h: "İkindi namazını kaçıran kimsenin sanki ailesi ve malı elinden alınmış gibidir.",
    hs: "Buhârî, Mevâkît, 14"
  },
  Akşam: {
    ar: "وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِنَ اللَّيْلِ",
    t: "Gecenin iki tarafında ve gündüzün saçaklarında namaz kıl.",
    s: "Hûd 11/114",
    h: "Akşam namazının farzından sonra kılınan iki rekat nafileyi aksatmayın.",
    hs: "Tirmizî, Salât, 203"
  },
  Yatsı: {
    ar: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    t: "Şüphesiz namaz, müminler üzerine belirli vakitlerde yazılmış bir farzdır.",
    s: "Nisâ 4/103",
    h: "Yatsı namazını cemaatle kılan, gecenin yarısını ibadetle geçirmiş gibidir.",
    hs: "Müslim, Mesâcid, 260"
  }
};
let PRAYER_AYATS = [
  {
    ar: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
    t: "Şüphesiz namaz, müminler üzerine belirli vakitlerde yazılmış bir farzdır.",
    s: "Nisâ 4/103"
  },
  {
    ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    t: "Namazı dosdoğru kılın, zekâtı verin ve rüku edenlerle birlikte rüku edin.",
    s: "Bakara 2/43"
  },
  {
    ar: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    t: "Sabır ve namazla Allah'tan yardım isteyin. Şüphesiz namaz, huşû duyanlardan başkasına ağır gelir.",
    s: "Bakara 2/45"
  },
  {
    ar: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ",
    t: "Namazlara ve orta namaza devam edin. Allah'ın huzurunda saygı ve itaate durun.",
    s: "Bakara 2/238"
  },
  {
    ar: "اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ",
    t: "Sana vahyedilen kitabı oku ve namazı dosdoğru kıl. Şüphesiz namaz, insanı hayasızlıktan ve kötülükten alıkoyar.",
    s: "Ankebût 29/45"
  },
  {
    ar: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    t: "Rabbim! Beni ve neslimi namazı dosdoğru kılanlardan eyle. Rabbimiz! Duamı kabul buyur.",
    s: "İbrâhîm 14/40"
  },
  {
    ar: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۦ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    t: "Müminler kesinlikle kurtuluşa ermiştir; onlar ki namazlarında derin bir hürmet ve huşû içindedirler.",
    s: "Mü'minûn 23/1-2"
  },
  {
    ar: "وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِنَ اللَّيْلِ ۚ إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ",
    t: "Gündüzün iki tarafında ve gecenin gündüze yakın saatlerinde namaz kıl. Şüphesiz iyilikler kötülükleri giderir.",
    s: "Hûd 11/114"
  },
  {
    ar: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
    t: "Beni anmak ve hatırlamak için namazı dosdoğru kıl.",
    s: "Tâhâ 20/14"
  },
  {
    ar: "فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ ۦ وَلَهُ الْحَمْدُ فِي السَّمَاوَاتِ وَالْأَرْضِ وَعَشِيًّا وَحِينَ تُظْهِرُونَ",
    t: "Akşama erdiğinizde ve sabaha çıktığınızda Allah'ı tesbih edin. Göklerde ve yerde, akşamleyin ve öğleye erdiğinizde hamd O'na mahsustur.",
    s: "Rûm 30/17-18"
  }
];

function renderVaktinQuote() {
  const card = document.getElementById('vaktinQuoteCard');
  const title = document.getElementById('vaktinQuoteTitle');
  const text = document.getElementById('vaktinQuoteText');
  const src = document.getElementById('vaktinQuoteSrc');
  const arabic = document.getElementById('vaktinQuoteArabic');
  if (!card || !title || !text || !src) return;

  const dayIdx = dayOfYear();
  const quote = PRAYER_AYATS[dayIdx % PRAYER_AYATS.length];

  title.innerHTML = `📖 GÜNÜN AYETİ`;
  if (arabic) {
    arabic.style.display = 'block';
    arabic.textContent = quote.ar || '';
  }
  text.textContent = quote.t;
  src.textContent = quote.s;
  card.style.borderLeftColor = 'var(--gold)';
}



function updateZikirDisplay() {
  const countEl = document.getElementById('zmCount');
  const arabicEl = document.getElementById('zmArabic');
  const trEl = document.getElementById('zmTr');
  const ring = document.getElementById('zmRing');
  const dots = document.querySelectorAll('.zm-phase-dot');

  if (countEl) countEl.textContent = `${zikirCount} / 33`;

  const phase = ZIKIR_PHASES[zikirPhase];
  if (arabicEl) {
    arabicEl.textContent = phase.a;
    arabicEl.style.direction = 'rtl';
    arabicEl.style.fontSize = '1.65rem';
    arabicEl.style.lineHeight = '1.6';
    arabicEl.style.fontFamily = "var(--font-arabic)";
  }
  if (trEl) trEl.textContent = phase.t;

  if (dots.length === 3) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === zikirPhase);
    });
  }

  if (ring) {
    const pct = zikirCount / 33;
    const offset = 376.99 - (pct * 376.99);
    ring.style.strokeDashoffset = offset;
  }
}

/* ── GÜNLÜK İÇERİK YÜKLEME ── */
async function loadDailyContent() {
  try {
    const [rAyats, rNamazAyats, rHadiths, rDuas, rEsma, rZikir] = await Promise.all([
      fetch('./data/ayetler.json').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('./data/namaz_ayetleri.json').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('./data/hadisler.json').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('./data/dualar.json').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('./data/esmalar.json').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('./data/zikirler.json').then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    if (rAyats && Array.isArray(rAyats) && rAyats.length) DAILY_AYATS = rAyats;
    if (rNamazAyats && Array.isArray(rNamazAyats) && rNamazAyats.length) PRAYER_AYATS = rNamazAyats;
    if (rHadiths && Array.isArray(rHadiths) && rHadiths.length) DAILY_HADITHS = rHadiths;
    if (rDuas && Array.isArray(rDuas) && rDuas.length) DAILY_DUAS = rDuas;
    if (rEsma && Array.isArray(rEsma) && rEsma.length) ESMA_LIST = rEsma;
    if (rZikir && Array.isArray(rZikir) && rZikir.length) DAILY_ZIKIR = rZikir;

    initDailyQuotes();
    renderVaktinQuote();
    renderEsma();
    renderDailyZikir();
  } catch (e) {
    console.warn('Günlük içerikler yüklenirken hata:', e);
  }
}
const QADA_NAMES = {
  sabah: 'Sabah',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı',
  vitir: 'Vitir (Vitir Vacip)'
};
function renderQada() {
  const box = document.getElementById('qadaBox');
  if (!box) return;
  if (!S.qada) S.qada = { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 };
  box.innerHTML = `
    <div class="qada-grid">
      ${Object.entries(QADA_NAMES).map(([k, name]) => {
    const count = S.qada[k] || 0;
    return `
          <div class="qada-row">
            <span class="qada-name">${name}</span>
            <div class="qada-controls">
              <button class="qada-btn minus" onclick="changeQada('${k}', -1)" ${count <= 0 ? 'disabled' : ''}>-</button>
              <span class="qada-count${count > 0 ? ' has-debt' : ''}">${count}</span>
              <button class="qada-btn plus" onclick="changeQada('${k}', 1)">+</button>
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
  renderQadaCalculator();
}
function changeQada(k, diff) {
  if (!S.qada) S.qada = { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 };
  S.qada[k] = Math.max(0, (S.qada[k] || 0) + diff);
  save();
  renderQada();
}
function renderQadaCalculator() {
  const calc = document.getElementById('qadaCalculator');
  if (!calc) return;
  if (!S.qada) { calc.innerHTML = ''; return; }
  const totalDebts = Object.values(S.qada).reduce((a, b) => a + b, 0);
  if (totalDebts <= 0) {
    calc.innerHTML = `<div style="font-size:0.7rem;color:var(--grn);text-align:center;font-weight:600;">🎉 Kaza borcunuz bulunmamaktadır!</div>`;
    return;
  }
  const maxDebts = Math.max(...Object.values(S.qada));
  const date1 = new Date(); date1.setDate(date1.getDate() + maxDebts);
  const date1Str = date1.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const halfDays = Math.ceil(maxDebts / 2);
  const date2 = new Date(); date2.setDate(date2.getDate() + halfDays);
  const date2Str = date2.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  calc.innerHTML = `
    <div style="font-size:0.6rem;text-transform:uppercase;color:var(--tx3);font-weight:800;margin-bottom:6px;">📈 Bitiş Öngörüsü</div>
    <div style="display:flex;flex-direction:column;gap:4px;font-size:0.68rem;color:var(--tx2);">
      <div>• Günde <strong>1'er vakit</strong> kaza ile: <span style="color:var(--gold);font-weight:700;">${maxDebts} gün</span> sonra (<span style="font-weight:600;">${date1Str}</span>)</div>
      <div>• Günde <strong>2'er vakit</strong> kaza ile: <span style="color:var(--teal);font-weight:700;">${halfDays} gün</span> sonra (<span style="font-weight:600;">${date2Str}</span>)</div>
    </div>
  `;
}

function toggleQadaPanel() {
  const panel = document.getElementById('qadaPanelContent');
  const icon = document.getElementById('qadaToggleIcon');
  if (!panel || !icon) return;

  if (panel.style.display === 'none') {
    panel.style.display = 'grid';
    icon.textContent = '▲ Gizle';
    icon.style.color = 'var(--rose)';
    icon.style.background = 'rgba(240,104,120,0.12)';
  } else {
    panel.style.display = 'none';
    icon.textContent = '▼ Göster';
    icon.style.color = 'var(--gold)';
    icon.style.background = 'var(--goldbg)';
  }
}

/* ── ZİKİRMATİK MANTIK & SES/TİTREŞİM EFEKTLERİ ── */
let zikirCount = 0;
let zikirPhase = 0; // 0: Sübhanallah, 1: Elhamdülillah, 2: Allahu Ekber
const ZIKIR_PHASES = [
  { a: 'سُبْحَانَ اللَّهِ', t: 'Sübhanallah' },
  { a: 'الْحَمْدُ لِلَّهِ', t: 'Elhamdülillah' },
  { a: 'اللَّهُ أَكْبَرُ', t: 'Allahu Ekber' }
];

function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.warn('Audio Context failed', e);
  }
}

function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) { }
}

function openZikirmatik() {
  const modal = document.getElementById('zikirmatikModal');
  if (modal) {
    modal.classList.add('on');
    resetZikirmatik();
  }
}

function closeZikirmatik() {
  const modal = document.getElementById('zikirmatikModal');
  if (modal) modal.classList.remove('on');
}

function resetZikirmatik() {
  zikirCount = 0;
  zikirPhase = 0;
  updateZikirDisplay();
}

/* updateZikirDisplay: Stil detaylı tanım satır ~5660'ta. Basit duplikat kaldırıldı. */

function tapZikirmatik() {
  if (navigator.vibrate) {
    navigator.vibrate(35);
  }
  playClickSound();

  zikirCount++;
  if (zikirCount >= 33) {
    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
    playChimeSound();

    zikirCount = 0;
    zikirPhase++;
    if (zikirPhase >= 3) {
      zikirPhase = 0;
      toast('Tesbihat tamamlandı! Allah kabul etsun.', 's');
      triggerConfetti();
      if (navigator.vibrate) {
        navigator.vibrate([120, 40, 120, 40, 180]);
      }
    }
  }
  updateZikirDisplay();
}

/* Confetti animation */
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#3ecfb0', '#D4AF37', '#3b82f6', '#f43f5e', '#a855f7', '#10b981'];
  const particles = Array.from({ length: 80 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight + 10,
    vx: (Math.random() - 0.5) * 15,
    vy: -Math.random() * 15 - 10,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * 360,
    vr: (Math.random() - 0.5) * 10,
    g: 0.4
  }));

  function anim() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let active = false;
    particles.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      if (p.y < window.innerHeight) active = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (active) requestAnimationFrame(anim);
    else canvas.remove();
  }
  requestAnimationFrame(anim);
}

/* ── ÇEVRİMDIŞI GÖSTERGESİ ── */
function updateOnlineStatus() {
  const banner = document.getElementById('offlineBanner');
  if (!banner) return;
  if (!navigator.onLine) {
    banner.style.display = 'block';
    requestAnimationFrame(() => banner.classList.add('show'));
  } else {
    banner.classList.remove('show');
    setTimeout(() => { if (banner.classList.contains('show') === false) banner.style.display = 'none'; }, 300);
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
// Sayfa yüklenirken de kontrol et
updateOnlineStatus();

/* ═══════════════════════════════════════════
   BAŞLATMA
═══════════════════════════════════════════ */
load();
autoReset();
seed();
renderSelects();
renderColorPresets();
applyTheme(S.theme || 'light');
updateNotifBtn();
if (S.notifEnabled && Notification.permission === 'granted') scheduleNotifs();
save();
render();
renderHeaderPrayerVakit();
initHeaderAssistant();
renderClock();
loadDailyContent();
// H-15: Saat saniyeyi gösterdiğinden 1s aralığı doğru; tarih güncellenmesi dakikada bir yeterli
setInterval(renderClock, 1000);
// Namaz vakitlerini ve header'ı dakikada bir güncelle
setInterval(() => { renderNamaz(); renderHeaderPrayerVakit(); renderHeaderAssistant(); }, 60000);
// Sabah 04:00'da namaz vakitlerini yeniden çek ve otomatik sıfırla
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 4 && now.getMinutes() === 0) { fetchPrayerTimes(); autoReset(); }
}, 60000);
// Namaz vakitleri: önce localStorage cache'den dene, sonra otomatik konum + API
(function fetchPrayerWithCache() {
  try {
    const cached = localStorage.getItem('mikat-prayer-cache');
    if (cached) {
      const { date, city, prayers, sunrise, imsak } = JSON.parse(cached);
      if (date === today() && city === (S.namazCity || 'Konya') && Array.isArray(prayers)) {
        PRAYERS = prayers;
        SUNRISE_TIME = sunrise || null;
        IMSAK_TIME = imsak || null;
        const srcEl = document.getElementById('namazSource');
        if (srcEl) srcEl.textContent = '💾 Önbellek — ' + (S.namazCity || 'Konya');
        renderNamaz();
        renderHeaderPrayerVakit();
        initHeaderAssistant();
        if (S.notifEnabled) scheduleNotifs();
        return; // cache geçerli, API çağrısına gerek yok
      }
    }
  } catch (e) { }
  // Cache yok veya geçersiz — direkt varsayılan şehir (Konya) ile API'den çek
  fetchPrayerTimes();
})();

/**
 * İlk açılışta (cache yokken) konum iznini sessizce kontrol eder.
 * - İzin daha önce verilmişse: koordinatları güncelle + koordinatlı API çağrısı yap
 * - İzin verilmemişse veya desteklenmiyorsa: şehir adıyla normal API çağrısı yap
 * Kullanıcıya popup göstermez — sadece zaten verilmiş izni kullanır.
 */
function autoDetectAndFetch() {
  if (!navigator.geolocation) {
    fetchPrayerTimes();
    return;
  }
  // Permissions API destekleniyorsa izni kontrol et, desteklenmiyorsa direkt dene
  const tryGeo = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        // Konum başarılı — koordinatları sakla ve koordinatlı API çağrısı yap
        S.lat = pos.coords.latitude;
        S.lng = pos.coords.longitude;
        save();
        renderSettings();
        fetchPrayerTimesWithCoords(S.lat, S.lng);
      },
      () => {
        // Konum alınamadı (izin reddedildi veya timeout) — şehir adıyla devam et
        fetchPrayerTimes();
      },
      { timeout: 8000, maximumAge: 3600000, enableHighAccuracy: false }
    );
  };

  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'granted') {
        tryGeo(); // İzin zaten verilmiş — sessizce al
      } else {
        // İzin verilmemiş veya prompt bekliyor — kullanıcıya sormadan şehir ile devam et
        fetchPrayerTimes();
      }
    }).catch(() => fetchPrayerTimes());
  } else {
    // Permissions API yok — şehir adıyla devam et (güvenli taraf)
    fetchPrayerTimes();
  }
}

/**
 * Koordinat bazlı namaz vakti çekimi.
 * Şehir adı yerine lat/lng kullanır; daha hassas sonuç verir.
 */
async function fetchPrayerTimesWithCoords(lat, lng) {
  try {
    const srcElLoading = document.getElementById('namazSource');
    if (srcElLoading) srcElLoading.textContent = '📡 Konuma göre yükleniyor…';
    const nowD = new Date();
    const dateStr = `${String(nowD.getDate()).padStart(2,'0')}-${String(nowD.getMonth()+1).padStart(2,'0')}-${nowD.getFullYear()}`;
    const r = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=13`
    );
    if (!r.ok) throw new Error('API hatası');
    const j = await r.json();
    const t = j?.data?.timings;
    if (!t?.Fajr || !t?.Dhuhr) throw new Error('Geçersiz API yanıtı');

    if (j?.data?.date?.hijri) {
      try {
        const hObj = j.data.date.hijri;
        const HIJRI_MONTHS_TR = ['Muharrem', 'Sefer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'];
        const mNum = parseInt(hObj.month?.number || 1, 10);
        const mName = HIJRI_MONTHS_TR[mNum - 1] || 'Muharrem';
        const officialStr = `${parseInt(hObj.day, 10)} ${mName} ${hObj.year}`;
        localStorage.setItem('mikat-hijri-official', JSON.stringify({ date: today(), str: officialStr }));
      } catch (e) { }
    }

    SUNRISE_TIME = t.Sunrise ? t.Sunrise.slice(0, 5) : null;
    IMSAK_TIME = t.Imsak ? t.Imsak.slice(0, 5) : null;
    PRAYERS = [
      { n: 'Sabah', t: t.Fajr.slice(0, 5), h: parseInt(t.Fajr) },
      { n: 'Öğle', t: t.Dhuhr.slice(0, 5), h: parseInt(t.Dhuhr) },
      { n: 'İkindi', t: t.Asr.slice(0, 5), h: parseInt(t.Asr) },
      { n: 'Akşam', t: t.Maghrib.slice(0, 5), h: parseInt(t.Maghrib) },
      { n: 'Yatsı', t: t.Isha.slice(0, 5), h: parseInt(t.Isha) },
    ];
    try {
      localStorage.setItem('mikat-prayer-cache', JSON.stringify({
        date: today(), city: S.namazCity || 'Konya',
        prayers: PRAYERS, sunrise: SUNRISE_TIME, imsak: IMSAK_TIME
      }));
    } catch (e) { }
    const srcElDone = document.getElementById('namazSource');
    if (srcElDone) srcElDone.textContent = '📍 Konuma göre — ' + (S.namazCity || 'Konya');
    renderNamaz();
    renderHeaderPrayerVakit();
    initHeaderAssistant();
    if (S.notifEnabled) scheduleNotifs();
  } catch (e) {
    // Koordinatlı API başarısız — şehir adıyla dene
    fetchPrayerTimes();
  }
}

/* ── BULUT HESAP & SENKRONİZASYON (MOCK AUTH) ── */

function renderAuthCard() {
  const card = document.getElementById('sidebarAuthCard');
  if (!card) return;

  if (AUTH_USER) {
    card.innerHTML = `
      <div style="font-size:0.6rem;text-transform:uppercase;color:var(--teal);font-weight:800;margin-bottom:6px;letter-spacing:0.06em;">👤 BULUT HESABI</div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--tealbg);color:var(--teal);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0;">
          ${AUTH_USER.name[0].toUpperCase()}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.78rem;font-weight:700;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${AUTH_USER.name}</div>
          <div style="font-size:0.56rem;color:var(--grn);font-weight:700;text-transform:uppercase;margin-top:1px;">Senkronize</div>
        </div>
        <button onclick="mockLogout()" style="background:none;border:none;color:var(--rose);font-size:0.7rem;cursor:pointer;font-weight:600;padding:2px 6px;">Çıkış</button>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div style="font-size:0.6rem;text-transform:uppercase;color:var(--gold);font-weight:800;margin-bottom:6px;letter-spacing:0.06em;">🔒 BULUT HESABI</div>
      <form id="authForm" onsubmit="mockLogin(event)" style="display:flex;flex-direction:column;gap:6px;">
        <input type="email" id="authEmail" placeholder="E-posta" required style="width:100%;background:rgba(0,0,0,0.12);border:1px solid var(--bd);border-radius:6px;padding:6px 8px;font-size:0.72rem;color:var(--tx);outline:none;transition:border-color 0.2s;">
        <input type="password" id="authPassword" placeholder="Şifre" required style="width:100%;background:rgba(0,0,0,0.12);border:1px solid var(--bd);border-radius:6px;padding:6px 8px;font-size:0.72rem;color:var(--tx);outline:none;transition:border-color 0.2s;">
        <button type="submit" style="background:var(--teal);color:#fff;border:none;border-radius:6px;padding:6px;font-size:0.74rem;font-weight:700;cursor:pointer;transition:filter 0.2s;">Giriş Yap</button>
      </form>
    `;
  }
}

function mockLogin(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const name = email.split('@')[0];
  AUTH_USER = { name: name, email: email };
  toast(`Bulut senkronizasyonu aktif: Hoş geldiniz ${name}!`, 's');
  renderAuthCard();
}

function mockLogout() {
  AUTH_USER = null;
  toast('Senkronizasyon kapatıldı. Oturum sonlandırıldı.', 'i');
  renderAuthCard();
}

/* ── GÜNLÜK KURAN MODÜLÜ ── */
const SURAHS = [
  { id: 1, n: 'Fâtiha', p: 1 }, { id: 2, n: 'Bakara', p: 2 }, { id: 3, n: 'Âl-i İmrân', p: 50 },
  { id: 4, n: 'Nisâ', p: 77 }, { id: 5, n: 'Mâide', p: 106 }, { id: 6, n: 'En\'âm', p: 128 },
  { id: 7, n: 'A\'râf', p: 151 }, { id: 8, n: 'Enfâl', p: 177 }, { id: 9, n: 'Tevbe', p: 187 },
  { id: 10, n: 'Yûnus', p: 208 }, { id: 11, n: 'Hûd', p: 221 }, { id: 12, n: 'Yûsuf', p: 235 },
  { id: 13, n: 'Ra\'d', p: 249 }, { id: 14, n: 'İbrâhîm', p: 255 }, { id: 15, n: 'Hicr', p: 262 },
  { id: 16, n: 'Nahl', p: 267 }, { id: 17, n: 'İsrâ', p: 282 }, { id: 18, n: 'Kehf', p: 293 },
  { id: 19, n: 'Meryem', p: 305 }, { id: 20, n: 'Tâhâ', p: 312 }, { id: 21, n: 'Enbiyâ', p: 322 },
  { id: 22, n: 'Hac', p: 332 }, { id: 23, n: 'Mü\'minûn', p: 342 }, { id: 24, n: 'Nûr', p: 350 },
  { id: 25, n: 'Furkân', p: 359 }, { id: 26, n: 'Şuarâ', p: 367 }, { id: 27, n: 'Neml', p: 377 },
  { id: 28, n: 'Kasas', p: 385 }, { id: 29, n: 'Ankebût', p: 396 }, { id: 30, n: 'Rûm', p: 404 },
  { id: 31, n: 'Lokmân', p: 411 }, { id: 32, n: 'Secde', p: 415 }, { id: 33, n: 'Ahzâb', p: 418 },
  { id: 34, n: 'Sebe\'', p: 428 }, { id: 35, n: 'Fâtır', p: 434 }, { id: 36, n: 'Yâsîn', p: 440 },
  { id: 37, n: 'Sâffât', p: 446 }, { id: 38, n: 'Sâd', p: 453 }, { id: 39, n: 'Zümer', p: 458 },
  { id: 40, n: 'Mü\'min (Gâfir)', p: 467 }, { id: 41, n: 'Fussilet', p: 477 }, { id: 42, n: 'Şûrâ', p: 483 },
  { id: 43, n: 'Zuhruf', p: 489 }, { id: 44, n: 'Duhân', p: 496 }, { id: 45, n: 'Câsiye', p: 499 },
  { id: 46, n: 'Ahkâf', p: 502 }, { id: 47, n: 'Muhammed', p: 507 }, { id: 48, n: 'Fetih', p: 511 },
  { id: 49, n: 'Hucurât', p: 515 }, { id: 50, n: 'Kâf', p: 518 }, { id: 51, n: 'Zâriyât', p: 520 },
  { id: 52, n: 'Tûr', p: 523 }, { id: 53, n: 'Necm', p: 526 }, { id: 54, n: 'Kamer', p: 528 },
  { id: 55, n: 'Rahmân', p: 531 }, { id: 56, n: 'Vâkıa', p: 534 }, { id: 57, n: 'Hadîd', p: 537 },
  { id: 58, n: 'Mücâdele', p: 542 }, { id: 59, n: 'Haşr', p: 545 }, { id: 60, n: 'Mümtehine', p: 549 },
  { id: 61, n: 'Saff', p: 551 }, { id: 62, n: 'Cuma', p: 553 }, { id: 63, n: 'Münâfikûn', p: 554 },
  { id: 64, n: 'Teğâbün', p: 556 }, { id: 65, n: 'Talâk', p: 558 }, { id: 66, n: 'Tahrîm', p: 560 },
  { id: 67, n: 'Mülk', p: 562 }, { id: 68, n: 'Kalem', p: 564 }, { id: 69, n: 'Hâkka', p: 566 },
  { id: 70, n: 'Meâric', p: 568 }, { id: 71, n: 'Nûh', p: 570 }, { id: 72, n: 'Cin', p: 572 },
  { id: 73, n: 'Müzzemmil', p: 574 }, { id: 74, n: 'Müddessir', p: 575 }, { id: 75, n: 'Kıyâme', p: 577 },
  { id: 76, n: 'İnsân', p: 578 }, { id: 77, n: 'Mürselât', p: 580 }, { id: 78, n: 'Nebe\'', p: 582 },
  { id: 79, n: 'Nâziât', p: 583 }, { id: 80, n: 'Abese', p: 585 }, { id: 81, n: 'Tekvîr', p: 586 },
  { id: 82, n: 'İnfıtâr', p: 587 }, { id: 83, n: 'Mutaffifîn', p: 587 }, { id: 84, n: 'İnşikâk', p: 589 },
  { id: 85, n: 'Bürûc', p: 590 }, { id: 86, n: 'Târık', p: 591 }, { id: 87, n: 'A\'lâ', p: 591 },
  { id: 88, n: 'Ğâşiye', p: 592 }, { id: 89, n: 'Fecr', p: 593 }, { id: 90, n: 'Beled', p: 594 },
  { id: 91, n: 'Şems', p: 595 }, { id: 92, n: 'Leyl', p: 595 }, { id: 93, n: 'Duhâ', p: 596 },
  { id: 94, n: 'İnşirâh', p: 596 }, { id: 95, n: 'Tîn', p: 597 }, { id: 96, n: 'Alak', p: 597 },
  { id: 97, n: 'Kadr', p: 598 }, { id: 98, n: 'Beyyine', p: 598 }, { id: 99, n: 'Zilzâl', p: 599 },
  { id: 100, n: 'Âdiyât', p: 599 }, { id: 101, n: 'Kâria', p: 600 }, { id: 102, n: 'Tekâsür', p: 600 },
  { id: 103, n: 'Asr', p: 601 }, { id: 104, n: 'Hümeze', p: 601 }, { id: 105, n: 'Fîl', p: 601 },
  { id: 106, n: 'Kureyş', p: 602 }, { id: 107, n: 'Mâûn', p: 602 }, { id: 108, n: 'Kevser', p: 602 },
  { id: 109, n: 'Kâfirûn', p: 603 }, { id: 110, n: 'Nasr', p: 603 }, { id: 111, n: 'Tebbet', p: 603 },
  { id: 112, n: 'İhlâs', p: 604 }, { id: 113, n: 'Felak', p: 604 }, { id: 114, n: 'Nâs', p: 604 }
];

const QURAN_DAILY_VERSES = [
  { ar: "وَقُلْ رَبِّ زِدْنِي عِلْمًا", tr: "\"Rabbim! Benim ilmimi artır.\"", ref: "Tâhâ 20/114" },
  { ar: "وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", tr: "\"O, her şeye gücü yetendir.\"", ref: "Mülk 67/1" },
  { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", tr: "\"Şüphesiz her güçlükle bir kolaylık vardır.\"", ref: "İnşirâh 94/6" },
  { ar: "وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ", tr: "\"Allah bilir, siz bilmezsiniz.\"", ref: "Bakara 2/216" },
  { ar: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", tr: "\"Kim Allah'a tevekkül ederse O ona yeter.\"", ref: "Talâk 65/3" },
  { ar: "وَكَفَىٰ بِاللَّهِ وَكِيلًا", tr: "\"Vekil olarak Allah yeter.\"", ref: "Nisâ 4/81" },
  { ar: "وَكَفَىٰ بِاللَّهِ نَصِيرًا", tr: "\"Yardımcı olarak Allah yeter.\"", ref: "Nisâ 4/45" },
  { ar: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", tr: "\"Şüphesiz Allah bağışlayandır, merhamet edendir.\"", ref: "Bakara 2/173" },
  { ar: "إِنَّ اللَّهَ عَلِيمٌ حَكِيمٌ", tr: "\"Şüphesiz Allah hakkıyla bilendir, hüküm sahibidir.\"", ref: "İnsân 76/30" },
  { ar: "وَاللَّهُ سَمِيعٌ عَلِيمٌ", tr: "\"Allah hakkıyla işitendir, hakkıyla bilendir.\"", ref: "Bakara 2/224" },
  { ar: "وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ", tr: "\"Sana ölüm gelinceye kadar Rabbine kulluk et.\"", ref: "Hicr 15/99" },
  { ar: "وَقُولُوا لِلنَّاسِ حُسْنًا", tr: "\"İnsanlara güzel söz söyleyin.\"", ref: "Bakara 2/83" },
  { ar: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", tr: "\"Eğer şükrederseniz elbette artırırım.\"", ref: "İbrâhîm 14/7" },
  { ar: "وَاللَّهُ مَعَ الصَّابِرِينَ", tr: "\"Allah sabredenlerle beraberdir.\"", ref: "Bakara 2/249" },
  { ar: "إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ", tr: "\"Şüphesiz Rabbim yakındır, duaları kabul edendir.\"", ref: "Hûd 11/61" },
  { ar: "وَهُوَ الْغَفُورُ الْوَدُودُ", tr: "\"O çok bağışlayandır, çok sevendir.\"", ref: "Bürûc 85/14" },
  { ar: "رَبِّ ابْنِ لِي عِنْدَكَ بَيْتًا فِي الْجَنَّةِ", tr: "\"Rabbim! Bana katında cennette bir ev yap.\"", ref: "Tahrîm 66/11" },
  { ar: "فَاصْبِرْ صَبْرًا جَمِيلًا", tr: "\"Şimdi sen güzelce sabret.\"", ref: "Meâric 70/5" },
  { ar: "فَابْتَغُوا عِنْدَ اللَّهِ الرِّزْقَ", tr: "\"Rızkı Allah'ın katında arayın.\"", ref: "Ankebût 29/17" },
  { ar: "إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا", tr: "\"Şüphesiz Allah üzerinizde bir gözetleyicidir.\"", ref: "Nisâ 4/1" },
  { ar: "وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", tr: "\"Allah'tan bağışlanma dileyin. Allah bağışlayandır.\"", ref: "Bakara 2/199" },
  { ar: "وَاللَّهُ يَهْدِي مَنْ يَشَاءُ", tr: "\"Allah dilediğini doğru yola iletir.\"", ref: "Bakara 2/213" },
  { ar: "إِنَّ اللَّهَ لَا يُخْلِفُ الْمِيعَادَ", tr: "\"Şüphesiz Allah sözünden dönmez.\"", ref: "Âl-i İmrân 3/9" },
  { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tr: "\"Yalnız sana kulluk eder, yalnız senden yardım dileriz.\"", ref: "Fâtiha 1/5" },
  { ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tr: "\"Bizi doğru yola ilet.\"", ref: "Fâtiha 1/6" },
  { ar: "وَقُلْ رَبِّ اغْفِرْ وَارْحَمْ", tr: "\"De ki: Rabbim! Bağışla ve merhamet et.\"", ref: "Mü'minûn 23/118" },
  { ar: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا", tr: "\"Gevşemeyin, üzülmeyin.\"", ref: "Âl-i İmrân 3/139" },
  { ar: "إِنَّ رَبَّكَ لَبِالْمِرْصَادِ", tr: "\"Şüphesiz Rabbin her an gözetlemektedir.\"", ref: "Fecr 89/14" },
  { ar: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", tr: "\"Başarım ancak Allah'ın yardımıyladır.\"", ref: "Hûd 11/88" },
  { ar: "وَاللَّهُ بَصِيرٌ بِالْعِبَادِ", tr: "\"Allah kullarını hakkıyla görendir.\"", ref: "Âl-i İmrân 3/15" },
  { ar: "قُلْ كُلٌّ يَعْمَلُ عَلَىٰ شَاكِلَتِهِ", tr: "\"De ki: Herkes kendi mizaç ve karakterine göre iş yapar.\"", ref: "İsrâ 17/84" },
  { ar: "وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", tr: "\"İyilik edin; Allah iyilik edenleri sever.\"", ref: "Bakara 2/195" },
  { ar: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ", tr: "\"Şüphesiz Allah çok tövbe edenleri sever.\"", ref: "Bakara 2/222" },
  { ar: "وَاللَّهُ غَنِيٌّ حَلِيمٌ", tr: "\"Allah zengindir, müsamaha sahibidir.\"", ref: "Bakara 2/263" },
  { ar: "وَاللَّهُ يَعِدُكُمْ مَغْفِرَةً مِنْهُ وَفَضْلًا", tr: "\"Allah size katından bir bağışlanma ve lütuf vadeder.\"", ref: "Bakara 2/268" },
  { ar: "قُلْ إِنَّ هُدَى اللَّهِ هُوَ الْهُدَىٰ", tr: "\"De ki: Asıl doğru yol Allah'ın yoludur.\"", ref: "Bakara 2/120" },
  { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", tr: "\"Beni anın ki ben de sizi anayım.\"", ref: "Bakara 2/152" },
  { ar: "وَأَنِ اسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ", tr: "\"Rabbinizden bağışlanma dileyin, sonra O'na tövbe edin.\"", ref: "Hûd 11/3" },
  { ar: "إِنَّ رَبِّي لَطِيفٌ لِمَا يَشَاءُ", tr: "\"Şüphesiz Rabbim dilediğine karşı lütufkârdır.\"", ref: "Yûsuf 12/100" },
  { ar: "وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ", tr: "\"Allah emrini yerine getirmeye muktedirdir.\"", ref: "Yûsuf 12/21" },
  { ar: "وَهُوَ أَرْحَمُ الرَّاحِمِينَ", tr: "\"O merhametlilerin en merhametlisidir.\"", ref: "Yûsuf 12/92" },
  { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", tr: "\"Biliniz ki kalpler ancak Allah'ı anmakla huzur bulur.\"", ref: "Ra'd 13/28" },
  { ar: "وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ", tr: "\"De ki: Hak geldi, batıl yok oldu.\"", ref: "İsrâ 17/81" },
  { ar: "رَبِّ اشْرَحْ لِي صَدْرِي", tr: "\"Rabbim! Göğsümü genişlet.\"", ref: "Tâhâ 20/25" },
  { ar: "وَيَسِّرْ لِي أَمْرِي", tr: "\"İşimi bana kolaylaştır.\"", ref: "Tâhâ 20/26" },
  { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", tr: "\"Her nefis ölümü tadacaktır.\"", ref: "Âl-i İmrân 3/185" },
  { ar: "سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ", tr: "\"Çok merhametli olan Rabden bir selam vardır.\"", ref: "Yâsîn 36/58" },
  { ar: "وَاللَّهُ خَيْرُ الرَّازِقِينَ", tr: "\"Allah rızık verenlerin en hayırlısıdır.\"", ref: "Cuma 62/11" },
  { ar: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", tr: "\"Biz Allah'a aitiz ve şüphesiz O'na döneceğiz.\"", ref: "Bakara 2/156" },
  { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", tr: "\"De ki: O Allah tektir.\"", ref: "İhlâs 112/1" }
];

const QURAN_ROUTINES_DEF = [
  {
    id: 'yasin',
    title: '☀️ Yasin Suresi',
    sub: 'Sabah okuması',
    fazilet: 'Hz. Peygamber (s.a.v.) "Yâsîn, Kur\'an\'ın kalbidir. Kim onu Allah\'ın rızasını gözeterek okursa geçmiş günahları bağışlanır." (Tirmizî, Dârimî)',
    neden: 'Güne Allah\'ın kelamıyla başlamak, günün manevi ferahlık ve bereketle geçmesi için sabah namazından sonra okunması gelenekleşmiştir.'
  },
  {
    id: 'fetih',
    title: '☀️ Fetih Suresi',
    sub: 'Öğle okuması',
    fazilet: 'Hudeybiye Antlaşması sonrasında inen bu sure; zafer, huzur, bağışlanma ve ilahi desteği müjdeler.',
    neden: 'Gün ortasında işlerin kolaylaşması, engellerin kalkması, başarı ve fetihler nasip olması niyetiyle öğle namazından sonra okunur.'
  },
  {
    id: 'nebe',
    title: '🌇 Nebe (Amme) Suresi',
    sub: 'İkindi okuması',
    fazilet: 'Kıyamet gününü, ahiret haberlerini, Allah\'ın kâinattaki kudretini ve cennet nimetlerini hatırlatır.',
    neden: 'Günün sonuna doğru ilerlerken dünya meşgalesinden sıyrılıp ahireti tefekkür etmek ve imanı taze tutmak amacıyla okunur.'
  },
  {
    id: 'vakia',
    title: '🌙 Vâkıa Suresi',
    sub: 'Akşam okuması',
    fazilet: 'Hz. Peygamber (s.a.v.) "Her kim gece Vâkıa suresini okursa, ona asla fakirlik dokunmaz." (İbn Kesîr, Beyhakî) buyurmuştur.',
    neden: 'Rızık bereketi, helal kazanç ve manevi darlıklardan korunmak amacıyla akşam ile yatsı arasında okunması tavsiye edilir.'
  },
  {
    id: 'mulk_secde',
    title: '🌙 Mülk & Secde Sureleri',
    sub: 'Yatsı okuması',
    fazilet: 'Hz. Peygamber (s.a.v.) Secde ve Mülk surelerini okumadan uyumazdı. Mülk suresi hakkında "O kabir azabına engel olur ve okuyanına şefaat eder" buyrulmuştur.',
    neden: 'Gece istirahatine geçmeden önce kabir alemini hatırlamak, korunmak ve uykuyu bereketlendirmek için yatsı sonrası okunur.'
  },
  {
    id: 'kehf',
    title: '🕌 Kehf Suresi',
    sub: 'Cuma günü okuması',
    fazilet: 'Hz. Peygamber (s.a.v.) "Cuma günü Kehf suresini okuyan kimsenin altından göğe kadar bir nur yükselir, iki cuma arası aydınlanır" buyurmuştur.',
    neden: 'Ahir zaman fitnelerinden korunmak ve haftalık manevi arınma sağlamak için Perşembe akşamından Cuma gün batımına kadar okunur.'
  }
];

let _currentVerseIdx = null;

function renderQuranView() {
  if (!S.quran) S.quran = { surah: 1, surahName: 'Fâtiha', page: 1, ayah: 1, routines: {} };

  // 1. Günün Ayeti Render (Günün tarihine göre otomatik seçilir)
  if (_currentVerseIdx === null) {
    const doy = typeof dayOfYear === 'function' ? dayOfYear() : new Date().getDate();
    _currentVerseIdx = doy % QURAN_DAILY_VERSES.length;
  }
  const v = QURAN_DAILY_VERSES[_currentVerseIdx % QURAN_DAILY_VERSES.length];
  const arEl = document.getElementById('quranVerseAr');
  const trEl = document.getElementById('quranVerseTr');
  const refEl = document.getElementById('quranVerseRef');
  if (arEl) arEl.textContent = v.ar;
  if (trEl) trEl.textContent = v.tr;
  if (refEl) refEl.textContent = v.ref;

  // 2. Akıllı Ayraç Render
  const sName = document.getElementById('bmSurahName');
  const pNum = document.getElementById('bmPageNum');
  const aNum = document.getElementById('bmAyahNum');
  if (sName) sName.textContent = S.quran.surahName || 'Fâtiha';
  if (pNum) pNum.textContent = `${S.quran.page || 1} / 604`;
  if (aNum) aNum.textContent = S.quran.ayah || 1;

  // Hatim İlerleme
  const pg = Math.min(604, Math.max(1, S.quran.page || 1));
  const pct = ((pg / 604) * 100).toFixed(1);
  const hVal = document.getElementById('hatimProgVal');
  const hFill = document.getElementById('hatimProgFill');
  if (hVal) hVal.textContent = `%${pct} (${pg}/604 Sayfa)`;
  if (hFill) hFill.style.width = `${pct}%`;

  // 3. Günlük Rutinler Render
  renderQuranRoutines();
}

function nextDailyVerse() {
  _currentVerseIdx = (_currentVerseIdx + 1) % QURAN_DAILY_VERSES.length;
  renderQuranView();
}

function copyVerseText() {
  const v = QURAN_DAILY_VERSES[_currentVerseIdx % QURAN_DAILY_VERSES.length];
  const text = `${v.ar}\n\n${v.tr}\n(${v.ref})`;
  navigator.clipboard.writeText(text).then(() => {
    toast('Ayet panoya kopyalandı!', 's');
  }).catch(() => {
    toast('Kopyalama başarısız', 'e');
  });
}

function incQuranPage(n) {
  if (!S.quran) S.quran = { surah: 1, surahName: 'Fâtiha', page: 1, ayah: 1, routines: {} };
  S.quran.page = Math.min(604, (S.quran.page || 1) + n);

  // Bulunduğu surenin adını sayfa numarasına göre güncelle
  const foundSurah = SURAHS.slice().reverse().find(s => s.p <= S.quran.page);
  if (foundSurah) {
    S.quran.surah = foundSurah.id;
    S.quran.surahName = foundSurah.n;
  }

  save();
  renderQuranView();
  toast(`Sayfa güncellendi: ${S.quran.page}. Sayfa (${S.quran.surahName})`, 's');
}

function renderQuranRoutines() {
  const listEl = document.getElementById('quranRoutinesList');
  const badgeEl = document.getElementById('quranRoutineBadge');
  if (!listEl) return;

  const tKey = today();
  if (!S.quran.routines) S.quran.routines = {};
  if (!S.quran.routines[tKey]) S.quran.routines[tKey] = {};
  const todayDone = S.quran.routines[tKey];

  let completedCount = 0;
  listEl.innerHTML = QURAN_ROUTINES_DEF.map(item => {
    const isDone = !!todayDone[item.id];
    if (isDone) completedCount++;
    return `
      <div class="qroutine-card ${isDone ? 'done' : ''}" style="background:var(--sf); border:1.5px solid ${isDone ? 'var(--teal)' : 'var(--bd)'}; border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:14px; width:100%; transition:all 0.2s ease; box-shadow:var(--sh);">
        
        <!-- ÜST SATIR: Tik Kutusu & Başlık & Odaklan Butonu -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px;">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="toggleQuranRoutine('${item.id}')">
            <div style="width:28px; height:28px; border-radius:50%; border:2px solid ${isDone ? 'var(--teal)' : 'var(--tx3)'}; background:${isDone ? 'var(--teal)' : 'transparent'}; color:#0b1320; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; flex-shrink:0;">
              ${isDone ? '✓' : ''}
            </div>
            <div>
              <div style="font-weight:800; font-size:1.05rem; color:${isDone ? 'var(--teal)' : 'var(--tx)'}; text-decoration:${isDone ? 'line-through' : 'none'}; display:flex; align-items:center; gap:8px;">
                ${item.title}
              </div>
              <div style="font-size:0.78rem; color:var(--gold); font-weight:700; margin-top:2px;">${item.sub}</div>
            </div>
          </div>
          <button class="tbtn" onclick="startFocusForTask('quran_${item.id}', 30)" style="font-size:0.68rem; min-height:28px; padding:3px 9px; border-radius:8px; border:1px solid var(--teal); color:var(--teal); background:rgba(62,207,176,0.1); font-weight:700;" title="30dk Odaklanma Sayacını Başlat">⏱ 30dk</button>
        </div>

        <!-- YATAY DETAY IZGARASI (Görünür Fazilet & Hikmet) -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
          
          <!-- SURE FAZİLETİ (HADİS VE MEAL) -->
          <div style="background:rgba(212,175,55,0.08); border-left:4px solid var(--gold); padding:12px 14px; border-radius:10px; font-size:0.86rem; line-height:1.5; color:var(--tx);">
            <div style="font-size:0.7rem; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:5px; display:flex; align-items:center; gap:5px;">
              <span>✨ SURE FAZİLETİ & HADİS-İ ŞERİF</span>
            </div>
            <div style="font-style:italic;">${item.fazilet}</div>
          </div>

          <!-- VAKİT HİKMETİ -->
          <div style="background:rgba(62,207,176,0.06); border-left:4px solid var(--teal); padding:12px 14px; border-radius:10px; font-size:0.83rem; line-height:1.48; color:var(--tx2);">
            <div style="font-size:0.7rem; font-weight:800; color:var(--teal); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:5px; display:flex; align-items:center; gap:5px;">
              <span>⏰ VAKİT HİKMETİ & OKUMA NEDENİ</span>
            </div>
            <div>${item.neden}</div>
          </div>

        </div>

      </div>
    `;
  }).join('');

  if (badgeEl) {
    badgeEl.textContent = `${completedCount}/${QURAN_ROUTINES_DEF.length} Tamamlandı`;
  }
}

function openSurahInfoModal(id, e) {
  if (e) e.stopPropagation();
  const surah = QURAN_ROUTINES_DEF.find(s => s.id === id);
  if (!surah) return;

  const tEl = document.getElementById('sInfoTitle');
  const sEl = document.getElementById('sInfoSub');
  const fEl = document.getElementById('sInfoFazilet');
  const nEl = document.getElementById('sInfoNeden');

  if (tEl) tEl.textContent = surah.title;
  if (sEl) sEl.textContent = surah.sub;
  if (fEl) fEl.textContent = surah.fazilet;
  if (nEl) nEl.textContent = surah.neden;

  document.getElementById('surahInfoModal')?.classList.add('on');
}

function toggleQuranRoutine(id) {
  const tKey = today();
  if (!S.quran) S.quran = { routines: {} };
  if (!S.quran.routines) S.quran.routines = {};
  if (!S.quran.routines[tKey]) S.quran.routines[tKey] = {};

  S.quran.routines[tKey][id] = !S.quran.routines[tKey][id];
  save();
  renderQuranView();
  renderQuranRoutines();
  renderHeaderAssistant();
  renderWeeklyQuranAnalysis();
  if (S.quran.routines[tKey][id]) {
    toast('Rutin tamamlandı!', 's');
  }
}

function openBookmarkModal() {
  if (!S.quran) S.quran = { surah: 1, surahName: 'Fâtiha', page: 1, ayah: 1, routines: {} };

  const sel = document.getElementById('bmSurahSelect');
  if (sel) {
    sel.innerHTML = SURAHS.map(s => `<option value="${s.id}" ${s.id === S.quran.surah ? 'selected' : ''}>${s.id}. ${s.n} (Sayfa ${s.p})</option>`).join('');
  }

  const pInp = document.getElementById('bmPageInput');
  const aInp = document.getElementById('bmAyahInput');
  if (pInp) pInp.value = S.quran.page || 1;
  if (aInp) aInp.value = S.quran.ayah || 1;

  document.getElementById('bookmarkModal')?.classList.add('on');
}

function onSurahSelectChange() {
  const sel = document.getElementById('bmSurahSelect');
  if (!sel) return;
  const sId = parseInt(sel.value, 10);
  const surah = SURAHS.find(s => s.id === sId);
  if (surah) {
    const pInp = document.getElementById('bmPageInput');
    if (pInp) pInp.value = surah.p;
  }
}

function saveBookmarkModal() {
  const sel = document.getElementById('bmSurahSelect');
  const pInp = document.getElementById('bmPageInput');
  const aInp = document.getElementById('bmAyahInput');

  const sId = parseInt(sel?.value || '1', 10);
  const surah = SURAHS.find(s => s.id === sId);

  S.quran.surah = sId;
  S.quran.surahName = surah ? surah.n : 'Fâtiha';
  S.quran.page = Math.min(604, Math.max(1, parseInt(pInp?.value || '1', 10)));
  S.quran.ayah = Math.max(1, parseInt(aInp?.value || '1', 10));

  save();
  renderQuranView();
  closeModal('bookmarkModal');
  toast('Kaldığın yer kaydedildi!', 's');
}

// Sayfa yüklendiğinde canlı header barı, zikir analizi ve maskot hatırlatıcısını başlat
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => { renderHeaderAssistant(); renderWeeklyZikirAnalysis(); initMascotReminder(); }, 100);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { renderHeaderAssistant(); renderWeeklyZikirAnalysis(); initMascotReminder(); }, 100);
  });
}

// Canlı header barını her 30 saniyede bir otomatik güncelle (kalan vakit sayacı için)
setInterval(() => {
  renderHeaderAssistant();
}, 30000);

/* ════════════════════════════════════════════════════════════
   1. DUA & MÜNÂCÂT MODÜLÜ
   ════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════
   1. DUA & MÜNÂCÂT MODÜLÜ
   ════════════════════════════════════════════════════════════ */
const DEFAULT_DUAS = [
  { id: 'd1', type: 'daily', title: 'Sabah Okunacak Me\'sûrât Duası', ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ', tr: 'Sabaha erdik, mülk de Allah\'ın olarak sabaha erdi. Hamd Allah\'a mahsustur.', fazilet: 'Her sabah okunması sünnet olan şükür duasıdır.' },
  { id: 'd2', type: 'daily', title: 'Akşam Korunma Duası', ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ', tr: 'İsmiyle yerde ve gökte hiçbir şeyin zarar veremediği Allah\'ın adıyla.', fazilet: 'Sabah ve akşam 3\'er defa okuyan her türlü afetten korunur.' },
  { id: 'd3', type: 'prophet', title: 'Hz. İbrahim\'in (a.s.) Namaz & Nesil Duası', ar: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ', tr: 'Rabbim! Beni ve neslimi namazı dosdoğru kılanlardan eyle. Rabbimiz! Duamı kabul buyur.', fazilet: 'İbrahim Suresi 40. ayet.' },
  { id: 'd4', type: 'prophet', title: 'Hz. Yunus\'un (a.s.) Zikr-i Şerifi (Lâ ilâhe illâ ente)', ar: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', tr: 'Senden başka hiçbir ilâh yoktur. Seni tenzih ederim. Şüphesiz ben zalimlerden oldum.', fazilet: 'Sıkıntı ve darlıklardan kurtulmak için okunan en tesirli tesbihattır.' },
  { id: 'd5', type: 'daily', title: 'Seyyidül İstiğfar Duası', ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ', tr: 'Allah\'ım! Sen benim Rabbimsin. Senden başka ilâh yoktur. Beni sen yarattın, ben senin kulunum.', fazilet: 'İstiğfarların efendisi olan çok mübarek bir duadır.' }
];

let activeDuaTab = 'all';
let _featuredDuaIdx = 0;

function switchDuaTab(tab, btn) {
  activeDuaTab = tab;
  document.querySelectorAll('#v-dua .fchip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderDuaView();
}

function openAddDuaModal() {
  ['duaTitleInp', 'duaArInp', 'duaTrInp'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('addDuaModal')?.classList.add('on');
}

function saveCustomDua() {
  const title = document.getElementById('duaTitleInp').value.trim();
  const ar = document.getElementById('duaArInp').value.trim();
  const tr = document.getElementById('duaTrInp').value.trim();
  if (!title) { toast('Lütfen dua başlığı girin.', 'e'); return; }

  if (!S.customDuas) S.customDuas = [];
  S.customDuas.push({ id: 'cdua_' + Date.now(), type: 'custom', title, ar, tr, fazilet: 'Kişisel dua notu' });
  save();
  closeModal('addDuaModal');
  renderDuaView();
  toast('Dua kaydedildi! 🤲', 's');
}

function toggleDuaDone(id) {
  const ds = today();
  if (!S.duaDone) S.duaDone = {};
  if (!S.duaDone[ds]) S.duaDone[ds] = {};

  const cur = !!S.duaDone[ds][id];
  S.duaDone[ds][id] = !cur;

  save();
  renderDuaView();
  renderHeaderAssistant();
  if (typeof playSound === 'function') playSound(cur ? 'bell' : 'done');
  toast(!cur ? 'Dua okundu olarak işaretlendi! 🤲' : 'Dua okundu işareti kaldırıldı.', 's');
}

function nextDailyDua() {
  const allDuas = [...DEFAULT_DUAS, ...(S.customDuas || [])];
  _featuredDuaIdx = (_featuredDuaIdx + 1) % allDuas.length;
  const d = allDuas[_featuredDuaIdx];
  const refEl = document.getElementById('duaFeaturedRef');
  const arEl = document.getElementById('duaFeaturedAr');
  const trEl = document.getElementById('duaFeaturedTr');
  if (refEl) refEl.textContent = d.title;
  if (arEl) arEl.textContent = d.ar || '';
  if (trEl) trEl.textContent = `"${d.tr}"`;
}

function copyFeaturedDuaText() {
  const allDuas = [...DEFAULT_DUAS, ...(S.customDuas || [])];
  const d = allDuas[_featuredDuaIdx] || allDuas[0];
  navigator.clipboard.writeText(`"${d.tr}" - ${d.title}`);
  toast('Günün Niyazı kopyalandı! 📋', 's');
}

function renderDuaView() {
  const cont = document.getElementById('duaGridContainer');
  if (!cont) return;

  const ds = today();
  const todayDone = S.duaDone?.[ds] || {};

  const q = (document.getElementById('searchDuaInp')?.value || '').toLowerCase().trim();
  const allDuas = [...DEFAULT_DUAS, ...(S.customDuas || [])];

  const totalDuas = allDuas.length;
  const doneCount = allDuas.filter(d => todayDone[d.id]).length;
  const pendCount = totalDuas - doneCount;
  const pct = totalDuas > 0 ? Math.round((doneCount / totalDuas) * 100) : 0;

  // Üst kart istatistiklerini güncelle
  const bVal = document.getElementById('duaBadgeVal');
  const cTot = document.getElementById('duaCountTotal');
  const cDon = document.getElementById('duaCountDone');
  const cPen = document.getElementById('duaCountPending');
  const pVal = document.getElementById('duaProgVal');
  const pFil = document.getElementById('duaProgFill');

  if (bVal) bVal.textContent = `${doneCount}/${totalDuas} Okundu`;
  if (cTot) cTot.textContent = totalDuas;
  if (cDon) cDon.textContent = doneCount;
  if (cPen) cPen.textContent = pendCount;
  if (pVal) pVal.textContent = `%${pct}`;
  if (pFil) pFil.style.width = `${pct}%`;

  let filtered = allDuas;
  if (activeDuaTab !== 'all') {
    filtered = filtered.filter(d => d.type === activeDuaTab);
  }
  if (q) {
    filtered = filtered.filter(d => (d.title || '').toLowerCase().includes(q) || (d.tr || '').toLowerCase().includes(q));
  }

  if (!filtered.length) {
    if (activeDuaTab === 'custom') {
      cont.innerHTML = `
        <div class="empty" style="grid-column:1/-1; padding:30px 20px; text-align:center;">
          <div class="empty-ico" style="font-size:2.5rem; margin-bottom:10px;">🤲</div>
          <div class="empty-txt" style="font-weight:800; font-size:1.1rem; color:var(--tx); margin-bottom:6px;">Henüz Kişisel Dua Eklenmedi</div>
          <div style="font-size:0.85rem; color:var(--tx2); margin-bottom:16px;">Kendi özel dualarınızı, niyazlarınızı ve dileklerinizi buraya ekleyebilirsiniz.</div>
          <button class="btn btn-primary" onclick="openAddDuaModal()" style="font-size:0.85rem; padding:8px 18px;">+ İlk Kişisel Duamı Ekle</button>
        </div>
      `;
    } else {
      cont.innerHTML = `<div class="empty" style="grid-column:1/-1;"><div class="empty-ico">🤲</div><div class="empty-txt">Dua bulunamadı.</div></div>`;
    }
    return;
  }

  const customHeader = activeDuaTab === 'custom' ? `
    <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:8px; padding:10px 14px; background:rgba(62,207,176,0.08); border-radius:10px; border:1px solid rgba(62,207,176,0.2);">
      <span style="font-weight:800; font-size:0.9rem; color:var(--teal);">📝 Kişisel Özel Dualarım (${filtered.length})</span>
      <button class="btn btn-primary" style="font-size:0.75rem; padding:5px 12px;" onclick="openAddDuaModal()">+ Yeni Özel Dua Ekle</button>
    </div>
  ` : '';

  cont.innerHTML = customHeader + filtered.map(d => {
    const isDone = !!todayDone[d.id];
    return `
      <div style="background:var(--sf); border:1.5px solid ${isDone ? 'var(--teal)' : 'var(--bd)'}; border-radius:14px; padding:16px 18px; display:flex; flex-direction:column; gap:10px; width:100%; transition:all 0.2s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; width:100%;">
          
          <div style="display:flex; align-items:center; gap:10px; cursor:pointer; min-width:180px; flex:1;" onclick="toggleDuaDone('${d.id}')">
            <div style="width:28px; height:28px; border-radius:50%; border:2px solid ${isDone ? 'var(--teal)' : 'var(--tx3)'}; background:${isDone ? 'var(--teal)' : 'transparent'}; color:#0b1320; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; flex-shrink:0;">
              ${isDone ? '✓' : ''}
            </div>
            <div style="font-weight:800; font-size:1.05rem; color:${isDone ? 'var(--teal)' : 'var(--tx)'}; text-decoration:${isDone ? 'line-through' : 'none'}; word-break:break-word;">
              ${esc(d.title)}
            </div>
          </div>

          <div style="display:flex; gap:6px; align-items:center; flex-shrink:0; margin-left:auto;">
            <button class="tbtn" onclick="navigator.clipboard.writeText('${esc(d.tr)}'); toast('Dua kopyalandı!', 's');" style="font-size:0.75rem; padding:5px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; flex-shrink:0; cursor:pointer; font-weight:700;">
              📋 Kopyala
            </button>
            ${d.type === 'custom' ? `<button class="tbtn" onclick="deleteCustomDua('${d.id}')" style="font-size:0.75rem; padding:5px 10px; color:var(--rose); border-radius:8px; cursor:pointer; font-weight:700;" title="Duayı Sil">🗑️ Sil</button>` : ''}
          </div>
        </div>

        ${d.ar ? `<div style="font-family:var(--font-arabic); font-size:1.4rem; color:var(--gold); direction:rtl; text-align:right; line-height:1.6;">${esc(d.ar)}</div>` : ''}
        <div style="font-size:0.88rem; color:var(--tx); line-height:1.45;">${esc(d.tr)}</div>
        ${d.fazilet ? `<div style="font-size:0.75rem; color:var(--tx3); font-style:italic;">✨ ${esc(d.fazilet)}</div>` : ''}
      </div>
    `;
  }).join('');
}

function deleteCustomDua(id) {
  if (!S.customDuas) return;
  S.customDuas = S.customDuas.filter(d => d.id !== id);
  save();
  renderDuaView();
  toast('Kişisel dua silindi.', 'i');
}

/* ════════════════════════════════════════════════════════════
   2. 40 HADİS-İ ŞERİF & EZBER MODÜLÜ
   ════════════════════════════════════════════════════════════ */
const HADIS_40_DEF = [
  { id: 1, topic: 'İhlas & Niyet', ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', tr: 'Ameller ancak niyetlere göredir. Herkes için ancak niyet ettiğinin karşılığı vardır.', ref: 'Buhârî, Bed\'ü\'l-Vahy 1' },
  { id: 2, topic: 'Ahlak & İman', ar: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا', tr: 'Müminlerin iman bakımından en mükemmeli, ahlakı en güzel olanıdır.', ref: 'Tirmizî, Radâ 11' },
  { id: 3, topic: 'Kardeşlik & Merhamet', ar: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', tr: 'Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe hakiki iman etmiş olamaz.', ref: 'Buhârî, İmân 7' },
  { id: 4, topic: 'Kolaylaştırma', ar: 'يَسِّرُوا وَلاَ تُعَسِّرُوا وَبَشِّرُوا وَلاَ تُنَفِّرُوا', tr: 'Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.', ref: 'Buhârî, İlim 11' },
  { id: 5, topic: 'Selamlaşma & Sevgi', ar: 'أَفْشُوا السَّلاَمَ تَحَابُّوا', tr: 'Aramızda selamı yayın ki birbirinizi sevesiniz.', ref: 'Müslim, İmân 93' },
  { id: 6, topic: 'İlim Öğrenme', ar: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', tr: 'İlim öğrenmek her Müslümana farzdır.', ref: 'İbn Mâce, Mukaddime 17' },
  { id: 7, topic: 'Tebessüm & Sadaka', ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ', tr: 'Kardeşinin yüzüne tebessüm etmen senin için bir sadakadır.', ref: 'Tirmizî, Birr 36' },
  { id: 8, topic: 'Temizlik', ar: 'الطَّهُورُ شَطْرُ الإِيمَانِ', tr: 'Temizlik imanın yarısıdır.', ref: 'Müslim, Tahâret 1' },
  { id: 9, topic: 'Cömertlik', ar: 'الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى', tr: 'Veren el alan elden üstündür.', ref: 'Buhârî, Zekât 18' },
  { id: 10, topic: 'Komşuluk Hakkı', ar: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُحْسِنْ إِلَى جَارِهِ', tr: 'Allah\'a ve ahiret gününe iman eden kimse komşusuna iyilik etsin.', ref: 'Müslim, İmân 74' },
  { id: 11, topic: 'Güzel Söz', ar: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', tr: 'Güzel söz sadakadır.', ref: 'Buhârî, Edeb 34' },
  { id: 12, topic: 'Hayıra Vesile Olmak', ar: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', tr: 'Bir hayra vesile olan, o hayrı yapan kimse gibi sevap kazanır.', ref: 'Müslim, İmâre 133' },
  { id: 13, topic: 'Öfke Kontrolü', ar: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', tr: 'Pehlivan, güreşte rakibini yenen değildir; asıl pehlivan, öfke anında kendine hakim olandır.', ref: 'Buhârî, Edeb 76' },
  { id: 14, topic: 'Tevazu & Alçakgönüllülük', ar: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلاَّ عِزًّا', tr: 'Sadaka malı eksiltmez. Allah, affeden kulunun ancak izzet ve şerefini artırır.', ref: 'Müslim, Birr 69' },
  { id: 15, topic: 'Hayırlı İnsan', ar: 'خَيْرُ النَّاسِ مَنْ يَنْفَعُ النَّاسَ', tr: 'İnsanların en hayırlısı, insanlara en faydalı olanıdır.', ref: 'Taberânî, el-Mu\'cemü\'l-Evsat' },
  { id: 16, topic: 'Kur\'an Öğrenimi', ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', tr: 'Sizin en hayırlınız, Kur\'an\'ı öğrenen ve öğreteninizdir.', ref: 'Buhârî, Fezâilü\'l-Kur\'ân 21' },
  { id: 17, topic: 'Güvenilirlik', ar: 'لاَ إِيمَانَ لِمَنْ لاَ أَمَانَةَ لَهُ', tr: 'Emanete riayet etmeyenin (kâmil) imanı yoktur.', ref: 'Ahmed b. Hanbel, Müsned 3/135' },
  { id: 18, topic: 'Zaman Kadrini Bilmek', ar: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ', tr: 'İki nimet vardır ki insanların çoğu onların kıymetini bilmekte aldanmıştır: Sağlık ve boş vakit.', ref: 'Buhârî, Rikâk 1' },
  { id: 19, topic: 'Namazın Önemi', ar: 'الصَّلاَةُ عِمَادُ الدِّينِ', tr: 'Namaz dinin direğidir.', ref: 'Tirmizî, İmân 8' },
  { id: 20, topic: 'Dua ve Münâcât', ar: 'الدُّعَاءُ هُوَ الْعِبَادَةُ', tr: 'Dua, ibadetin ta kendisidir.', ref: 'Tirmizî, Tefsîru\'l-Kur\'ân 40' },
  { id: 21, topic: 'Anne-Baba Hakkı', ar: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ', tr: 'Rabb\'in rızası anne babanın rızasında, Rabb\'in öfkesi anne babanın öfkesindedir.', ref: 'Tirmizî, Birr 3' },
  { id: 22, topic: 'Doğruluk & Dürüstlük', ar: 'عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ', tr: 'Doğruluktan ayrılmayınız. Şüphesiz doğruluk insanı iyiliğe götürür.', ref: 'Müslim, Birr 105' },
  { id: 23, topic: 'Sıla-i Rahim (Akraba Ziyareti)', ar: 'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ', tr: 'Rızkının bollaşmasını ve ömrünün uzamasını isteyen kimse akrabasını ziyaret etsin.', ref: 'Buhârî, Büyû\' 13' },
  { id: 24, topic: 'Gıybet ve Dili Korumak', ar: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', tr: 'Allah\'a ve ahiret gününe iman eden ya hayır söylesin ya da sussun.', ref: 'Buhârî, Edeb 31' },
  { id: 25, topic: 'Tevbe ve İstiğfar', ar: 'التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لاَ ذَنْبَ لَهُ', tr: 'Günahından tam dönüp tevbe eden, hiç günah işlememiş gibidir.', ref: 'İbn Mâce, Zühd 30' },
  { id: 26, topic: 'Sabır & Şükür', ar: 'عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ', tr: 'Müminin durumu ne hoştur! Her hali kendisi için hayırdır: Sevinirse şükreder hayır olur, sıkıntıya düşerse sabreder hayır olur.', ref: 'Müslim, Zühd 64' },
  { id: 27, topic: 'Yetim Hakkı & Şefkat', ar: 'أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا', tr: 'Ben ve yetimi koruyup gözeten kimse cennette şöyle yan yanayız.', ref: 'Buhârî, Edeb 24' },
  { id: 28, topic: 'Kıskançlık & Haset', ar: 'إِيَّاكُمْ وَالْحَسَدَ فَإِنَّ الْحَسَدَ يَأْكُلُ الْحَسَنَاتِ كَمَا تَأْكُلُ النَّارُ الْحَطَبَ', tr: 'Haset etmekten sakının. Çünki haset, ateşin odunu yediği gibi iyilikleri yer bitirir.', ref: 'Ebû Dâvûd, Edeb 44' },
  { id: 29, topic: 'Hediyeleşmek', ar: 'تَهَادَوْا تَحَابُّوا', tr: 'Birbirinize hediye veriniz ki aranızdaki sevgi artsın.', ref: 'Buhârî, el-Edebü\'l-Müfred' },
  { id: 30, topic: 'Haya & Utanma Duygusu', ar: 'الْحَيَاءُ لاَ يَأْتِي إِلاَّ بِخَيْرٍ', tr: 'Hayâ (utanma duygusu) insan sadece hayır getirir.', ref: 'Buhârî, Edeb 77' },
  { id: 31, topic: 'Merhamet Etmek', ar: 'مَنْ لاَ يَرْحَمْ لاَ يُرْحَمْ', tr: 'Merhamet etmeyene merhamet olunmaz.', ref: 'Buhârî, Edeb 18' },
  { id: 32, topic: 'Zulümden Sakınmak', ar: 'اتَّقُوا الظُّلْمَ فَإِنَّ الظُّلْمَ ظُلُمَاتٌ يَوْمَ الْقِيَامَةِ', tr: 'Zulümden sakının! Çünki zulüm, kıyamet gününde zifiri karanlıklardır.', ref: 'Müslim, Birr 56' },
  { id: 33, topic: 'İbadetlerde Devamlılık', ar: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', tr: 'Allah katında amellerin en makbulü, az da olsa devamlı olanıdır.', ref: 'Müslim, Musâfirîn 218' },
  { id: 34, topic: 'Dünya ve Ahiret Dengesi', ar: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ', tr: 'Dünyada sanki bir garip yahut bir yolcu gibi ol.', ref: 'Buhârî, Rikâk 3' },
  { id: 35, topic: 'Ayıp Örtmek', ar: 'مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالآخِرَةِ', tr: 'Kim bir Müslümanın ayıbını örterse, Allah da dünya ve ahirette onun ayıbını örter.', ref: 'Müslim, Birr 72' },
  { id: 36, topic: 'Güzel Huyluluk', ar: 'إِنَّمَا بُعِثْتُ لأُتَمِّمَ صَالِحَ الأَخْلاَقِ', tr: 'Ben ancak güzel ahlakı tamamlamak için gönderildim.', ref: 'Ahmed b. Hanbel 2/381' },
  { id: 37, topic: 'Kalp Temizliği', ar: 'أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ وَهِيَ الْقَلْبُ', tr: 'Dikkat edin! Vücutta bir et parçası vardır ki, o iyi olursa bütün vücut iyi olur; o bozulursa bütün vücut bozulur. O kalptir!', ref: 'Buhârî, İmân 39' },
  { id: 38, topic: 'Cemaat ve Birlik', ar: 'يَدُ اللَّهِ مَعَ الْجَمَاعَةِ', tr: 'Allah\'ın yardım eli cemaat (birlik ve beraberlik) ile beraberdir.', ref: 'Tirmizî, Fiten 7' },
  { id: 39, topic: 'Helal Rızık', ar: 'إِنَّ اللَّهَ طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا', tr: 'Şüphesiz Allah tayyibdir (temizdir), ancak temiz ve helal olanı kabul eder.', ref: 'Müslim, Zekât 65' },
  { id: 40, topic: 'Şükür ve Hamd', ar: 'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ', tr: 'İnsanlara teşekkür etmeyen, Allah\'a da şükretmiş olmaz.', ref: 'Tirmizî, Birr 35' }
];

let activeHadisTab = 'all';
let _featuredHadisIdx = 0;

function switchHadisTab(tab, btn) {
  activeHadisTab = tab;
  document.querySelectorAll('#v-hadis .fchip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderHadisView();
}

function toggleHadisMemorized(idx) {
  if (!S.hadisMemorized) S.hadisMemorized = {};
  S.hadisMemorized[idx] = !S.hadisMemorized[idx];
  save();
  renderHadisView();
  toast(S.hadisMemorized[idx] ? 'Hadis ezberlendi! 🧠🎉' : 'Ezber işareti kaldırıldı.', 'i');
}

function nextDailyHadis() {
  _featuredHadisIdx = (_featuredHadisIdx + 1) % HADIS_40_DEF.length;
  const h = HADIS_40_DEF[_featuredHadisIdx];
  const refEl = document.getElementById('hadisFeaturedRef');
  const arEl = document.getElementById('hadisFeaturedAr');
  const trEl = document.getElementById('hadisFeaturedTr');
  if (refEl) refEl.textContent = `Buhârî / Müslim #${h.id}`;
  if (arEl) arEl.textContent = h.ar;
  if (trEl) trEl.textContent = `"${h.tr}"`;
}

function copyFeaturedHadisText() {
  const h = HADIS_40_DEF[_featuredHadisIdx] || HADIS_40_DEF[0];
  navigator.clipboard.writeText(`"${h.tr}" (${h.ref})`);
  toast('Günün Hadis-i Şerifi kopyalandı! 📋', 's');
}

function renderHadisView() {
  const cont = document.getElementById('hadisGridContainer');
  if (!cont) return;

  if (!S.hadisMemorized) S.hadisMemorized = {};
  const total = HADIS_40_DEF.length;
  const memCount = HADIS_40_DEF.filter(h => S.hadisMemorized[h.id]).length;
  const pendCount = total - memCount;

  // Kuran tarzı üst kart istatistiklerini güncelle
  const hBVal = document.getElementById('hadisBadgeVal');
  const hCTot = document.getElementById('hadisCountTotal');
  const hCMem = document.getElementById('hadisCountMem');
  const hCPen = document.getElementById('hadisCountPend');
  const hPVal = document.getElementById('hadisProgVal');
  const hPFil = document.getElementById('hadisProgFill');

  const pct = Math.round((memCount / total) * 100);
  if (hBVal) hBVal.textContent = `${memCount}/${total} Ezberlendi`;
  if (hCTot) hCTot.textContent = total;
  if (hCMem) hCMem.textContent = memCount;
  if (hCPen) hCPen.textContent = pendCount;
  if (hPVal) hPVal.textContent = `%${pct}`;
  if (hPFil) hPFil.style.width = `${pct}%`;

  const setHCnt = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setHCnt('hcnt-mem', memCount);
  setHCnt('hcnt-pend', pendCount);

  const q = (document.getElementById('searchHadisInp')?.value || '').toLowerCase().trim();

  let list = HADIS_40_DEF;
  if (activeHadisTab === 'mem') list = list.filter(h => S.hadisMemorized[h.id]);
  if (activeHadisTab === 'pend') list = list.filter(h => !S.hadisMemorized[h.id]);
  if (q) list = list.filter(h => (h.tr || '').toLowerCase().includes(q) || (h.topic || '').toLowerCase().includes(q));

  if (!list.length) {
    cont.innerHTML = `<div class="empty"><div class="empty-ico">📜</div><div class="empty-txt">Hadis-i Şerif bulunamadı.</div></div>`;
    return;
  }

  cont.innerHTML = list.map(h => {
    const isMem = !!S.hadisMemorized[h.id];
    return `
      <div class="hadis-card-item" style="background:var(--sf); border:1.5px solid ${isMem ? 'var(--teal)' : 'var(--bd)'}; border-radius:14px; padding:12px 14px; display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap; gap:8px; width:100%; box-sizing:border-box;">
          <div style="display:flex; align-items:center; gap:6px; min-width:0; flex:1 1 auto; overflow:hidden;">
            <span style="font-size:0.72rem; font-weight:800; color:var(--gold); background:rgba(232,184,75,0.12); padding:3px 8px; border-radius:6px; white-space:nowrap; flex-shrink:0;">#Hadis ${h.id}</span>
            <span style="font-size:0.75rem; font-weight:700; color:var(--teal); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(h.topic)}</span>
          </div>
          <div style="display:flex; gap:6px; align-items:center; flex-shrink:0; margin-left:auto;">
            <button class="hadis-act-btn" onclick="navigator.clipboard.writeText('${esc(h.tr)} (${esc(h.ref)})'); toast('Hadis kopyalandı!', 's');">
              📋 Kopyala
            </button>
            <button class="hadis-act-btn ${isMem ? 'mem-on' : ''}" onclick="toggleHadisMemorized(${h.id})">
              ${isMem ? '🧠 Ezberlendi ✓' : '➕ Ezberle'}
            </button>
          </div>
        </div>
        <div style="font-family:var(--font-arabic); font-size:1.40rem; color:var(--gold); direction:rtl; text-align:right; line-height:1.6; word-break:break-word; margin-top:2px;">${esc(h.ar)}</div>
        <div style="font-size:0.88rem; color:var(--tx); line-height:1.45; font-weight:500; word-break:break-word;">"${esc(h.tr)}"</div>
        <div style="font-size:0.72rem; color:var(--tx3); text-align:right; font-weight:600;">📖 ${esc(h.ref)}</div>
      </div>
    `;
  }).join('');
}

/* ════════════════════════════════════════════════════════════
   3. KİTAPLIK & OKUMA TAKİBİ MODÜLÜ
   ════════════════════════════════════════════════════════════ */
let activeBookTab = 'reading';
let _editingBookId = null;

function switchBookTab(tab, btn) {
  activeBookTab = tab;
  document.querySelectorAll('#v-books .fchip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderBooksView();
}

function openAddBookModal(bookId = null) {
  _editingBookId = bookId;
  const modalTitle = document.querySelector('#addBookModal .modal-title');

  if (bookId) {
    const b = (S.books || []).find(x => x.id === bookId);
    if (b) {
      document.getElementById('bookTitleInp').value = b.title || '';
      document.getElementById('bookAuthorInp').value = b.author || '';
      document.getElementById('bookTotalPagesInp').value = b.totalPages || '';
      document.getElementById('bookCurrentPageInp').value = b.currentPage || 0;
      if (modalTitle) modalTitle.textContent = '✏️ Kitap Bilgilerini Düzenle';
    }
  } else {
    ['bookTitleInp', 'bookAuthorInp', 'bookTotalPagesInp', 'bookCurrentPageInp'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    if (modalTitle) modalTitle.textContent = '📚 Yeni Kitap Ekle';
  }
  document.getElementById('addBookModal')?.classList.add('on');
}

function saveBookModal() {
  const title = document.getElementById('bookTitleInp').value.trim();
  const author = document.getElementById('bookAuthorInp').value.trim() || 'Bilinmiyor';
  const totalP = Math.max(1, parseInt(document.getElementById('bookTotalPagesInp').value || '100', 10));
  const curP = Math.max(0, parseInt(document.getElementById('bookCurrentPageInp').value || '0', 10));

  if (!title) { toast('Lütfen kitap adı girin.', 'e'); return; }

  if (!S.books) S.books = [];

  if (_editingBookId) {
    const b = S.books.find(x => x.id === _editingBookId);
    if (b) {
      b.title = title;
      b.author = author;
      b.totalPages = totalP;
      b.currentPage = Math.min(totalP, curP);
      b.finished = b.currentPage >= totalP;
    }
    toast('Kitap güncellendi! 📚', 's');
  } else {
    S.books.push({ id: 'b_' + Date.now(), title, author, totalPages: totalP, currentPage: Math.min(totalP, curP), finished: curP >= totalP });
    toast('Kitap kütüphanenize eklendi! 📚', 's');
  }

  save();
  closeModal('addBookModal');
  _editingBookId = null;
  renderBooksView();
}

function deleteBook(bookId) {
  if (!S.books) return;
  const b = S.books.find(x => x.id === bookId);
  if (!b) return;
  S.books = S.books.filter(x => x.id !== bookId);
  save();
  renderBooksView();
  toast(`"${b.title}" silindi.`, 'i');
}

function incBookPage(bookId, n) {
  const b = (S.books || []).find(x => x.id === bookId);
  if (!b) return;
  b.currentPage = Math.min(b.totalPages, Math.max(0, (b.currentPage || 0) + n));
  if (b.currentPage >= b.totalPages) b.finished = true;
  save();
  renderBooksView();
  toast(`"${b.title}" ${b.currentPage}/${b.totalPages}. Sayfa`, 's');
}

function openAddQuoteModal() {
  ['quoteBookInp', 'quoteTextInp', 'quotePageInp'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('addQuoteModal')?.classList.add('on');
}

function saveQuoteModal() {
  const book = document.getElementById('quoteBookInp').value.trim() || 'Genel';
  const text = document.getElementById('quoteTextInp').value.trim();
  const page = document.getElementById('quotePageInp').value.trim();

  if (!text) { toast('Lütfen alıntı metni girin.', 'e'); return; }

  if (!S.quotes) S.quotes = [];
  S.quotes.push({ id: 'q_' + Date.now(), book, text, page });
  save();
  closeModal('addQuoteModal');
  renderBooksView();
  toast('Alıntı defterinize kaydedildi! 📝', 's');
}

function deleteQuote(quoteId) {
  if (!S.quotes) return;
  S.quotes = S.quotes.filter(x => x.id !== quoteId);
  save();
  renderBooksView();
  toast('Alıntı silindi.', 'i');
}

function renderBooksView() {
  const cont = document.getElementById('booksGridContainer');
  if (!cont) return;

  if (!S.books) S.books = [];
  if (!S.quotes) S.quotes = [];

  if (activeBookTab === 'quotes') {
    if (!S.quotes.length) {
      cont.innerHTML = `<div class="empty"><div class="empty-ico">📝</div><div class="empty-txt">Henüz kayıtlı alıntı yok.</div></div>`;
      return;
    }
    cont.innerHTML = S.quotes.map(q => `
      <div style="background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; width:100%; box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <div style="font-weight:800; font-size:0.80rem; color:var(--gold);">📖 ${esc(q.book)} ${q.page ? `· Sayfa ${q.page}` : ''}</div>
          <button class="book-act-btn del" onclick="deleteQuote('${q.id}')">🗑️ Sil</button>
        </div>
        <div style="font-size:0.88rem; font-style:italic; color:var(--tx); line-height:1.4; word-break:break-word;">"${esc(q.text)}"</div>
      </div>
    `).join('');
    return;
  }

  const isFin = activeBookTab === 'finished';
  const list = S.books.filter(b => isFin ? b.finished : !b.finished);

  if (!list.length) {
    cont.innerHTML = `<div class="empty"><div class="empty-ico">📚</div><div class="empty-txt">${isFin ? 'Henüz bitirilen kitap yok.' : 'Okunmakta olan kitap yok.'}</div></div>`;
    return;
  }

  cont.innerHTML = list.map(b => {
    const pct = Math.round(((b.currentPage || 0) / (b.totalPages || 1)) * 100);
    return `
      <div class="book-card-item" style="background:var(--sf); border:1.5px solid ${isFin ? 'var(--grn)' : 'var(--bd)'}; border-radius:14px; padding:12px 14px; display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box;">
        <!-- Kart Üst Başlık & Aksiyonlar -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; width:100%; box-sizing:border-box;">
          <div style="flex:1 1 170px; min-width:0;">
            <div style="font-weight:800; font-size:1.05rem; color:var(--teal); line-height:1.2; word-break:break-word;">${esc(b.title)}</div>
            <div style="font-size:0.78rem; color:var(--tx2); font-style:italic; margin-top:3px;">✍️ ${esc(b.author)}</div>
          </div>
          <div style="display:flex; gap:4px; align-items:center; flex-wrap:nowrap; flex-shrink:0; margin-left:auto;">
            <button class="book-act-btn" onclick="openAddBookModal('${b.id}')" title="Düzenle">✏️ Düzenle</button>
            <button class="book-act-btn del" onclick="deleteBook('${b.id}')" title="Sil">🗑️ Sil</button>
            <button class="book-act-btn focus" onclick="startFocusForTask('book_${b.id}', 30)" title="30 Dakika Okuma Sayacı">⏱ 30dk</button>
          </div>
        </div>

        <!-- Okuma İlerleme Çubuğu -->
        <div style="background:var(--sf2); padding:8px 12px; border-radius:10px; border:1px solid var(--bd);">
          <div style="display:flex; justify-content:space-between; font-size:0.78rem; font-weight:800; color:var(--tx); margin-bottom:4px;">
            <span>İlerleme: ${b.currentPage} / ${b.totalPages} Sayfa</span>
            <span style="color:var(--gold); font-family:'JetBrains Mono',monospace;">%${pct}</span>
          </div>
          <div style="width:100%; height:7px; background:var(--sf3); border-radius:4px; overflow:hidden;">
            <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #3ecfb0, #e8b84b); transition:width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Hızlı Sayfa İlerleme Butonları -->
        <div style="display:flex; gap:6px; width:100%;">
          <button class="book-inc-btn" onclick="incBookPage('${b.id}', 1)" style="flex:1;">+1 Sayfa</button>
          <button class="book-inc-btn" onclick="incBookPage('${b.id}', 5)" style="flex:1;">+5 Sayfa</button>
          <button class="book-inc-btn primary" onclick="incBookPage('${b.id}', 10)" style="flex:1;">+10 Sayfa</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ════════════════════════════════════════════════════════════
   4. KOMUT ROTASI (WEB & KOD DEFTERİ) MODÜLÜ
   ════════════════════════════════════════════════════════════ */
let activeKomutTab = 'snippets';
let _editingSnippetId = null;
let _editingWebToolId = null;
let _editingSubdomainId = null;

const DEFAULT_WEB_TOOLS = [
  { id: 'wt1', title: 'Komut Rotası Web Portal', url: 'https://komutrotasi.com', icon: '🌐', note: 'Ana web sitesi ve teknoloji yayınları' },
  { id: 'wt2', title: 'Google Search Console', url: 'https://search.google.com/search-console', icon: '🔍', note: 'İndeks takibi, SEO ve arama performansı' },
  { id: 'wt3', title: 'Google Analytics', url: 'https://analytics.google.com', icon: '📊', note: 'Canlı ziyaretçi trafiği ve analiz raporları' },
  { id: 'wt4', title: 'Google PageSpeed Insights', url: 'https://pagespeed.web.dev', icon: '⚡', note: 'Core Web Vitals ve site hız ölçümü' }
];

const DEFAULT_SUBDOMAINS = [
  { id: 'sd1', title: 'Mikat Portal', url: 'https://mikat.komutrotasi.com', icon: '⚡', note: 'Mikat Yönetim Paneli ve Alışkanlık Takibi' },
  { id: 'sd2', title: 'Kovan Proje Portalı', url: 'https://kovan.komutrotasi.com', icon: '🐝', note: 'Kovan Proje Yönetimi ve İş Takibi' },
  { id: 'sd3', title: 'Seyir Portalı', url: 'https://seyir.komutrotasi.com', icon: '🚀', note: 'Seyir Modülü ve Gözlem Defteri' },
  { id: 'sd4', title: 'Lab & Ar-Ge Dizin', url: 'https://lab.komutrotasi.com', icon: '🧪', note: 'Deneysel çalışmalar ve test ortamı' }
];

function switchKomutTab(tab, btn) {
  activeKomutTab = tab;
  document.querySelectorAll('#v-komutrotasi .fchip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderKomutRotasiView();
}

// 🌐 SUBDOMAIN İŞLEMLERİ
function openAddSubdomainModal(subId = null) {
  _editingSubdomainId = subId;
  const modalTitle = document.querySelector('#addSubdomainModal .modal-title');
  const allSubs = S.subdomains || [];

  if (subId) {
    const s = allSubs.find(x => x.id === subId);
    if (s) {
      document.getElementById('subdomainTitleInp').value = s.title || '';
      document.getElementById('subdomainUrlInp').value = s.url || '';
      document.getElementById('subdomainIconInp').value = s.icon || '🌐';
      document.getElementById('subdomainNoteInp').value = s.note || '';
      if (modalTitle) modalTitle.textContent = '✏️ Subdomain Düzenle';
    }
  } else {
    ['subdomainTitleInp', 'subdomainUrlInp', 'subdomainNoteInp'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const sIco = document.getElementById('subdomainIconInp'); if (sIco) sIco.value = '🌐';
    if (modalTitle) modalTitle.textContent = '🌐 Yeni Subdomain Ekle';
  }
  document.getElementById('addSubdomainModal')?.classList.add('on');
}

function saveSubdomainModal() {
  const title = document.getElementById('subdomainTitleInp').value.trim();
  let url = document.getElementById('subdomainUrlInp').value.trim();
  const icon = document.getElementById('subdomainIconInp').value;
  const note = document.getElementById('subdomainNoteInp').value.trim();

  if (!title || !url) { toast('Lütfen subdomain adı ve web adresi (URL) girin.', 'e'); return; }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  if (!S.subdomains) S.subdomains = [];

  if (_editingSubdomainId) {
    const s = S.subdomains.find(x => x.id === _editingSubdomainId);
    if (s) {
      s.title = title;
      s.url = url;
      s.icon = icon;
      s.note = note;
    }
    toast('Subdomain güncellendi! 🌐', 's');
  } else {
    S.subdomains.push({ id: 'sd_' + Date.now(), title, url, icon, note });
    toast('Yeni Subdomain eklendi! 🌐', 's');
  }

  save();
  closeModal('addSubdomainModal');
  _editingSubdomainId = null;
  activeKomutTab = 'subdomains';
  renderKomutRotasiView();
}

function deleteSubdomain(subId) {
  if (!S.subdomains) S.subdomains = [];
  const s = S.subdomains.find(x => x.id === subId);
  if (!s) return;
  S.subdomains = S.subdomains.filter(x => x.id !== subId);
  save();
  renderKomutRotasiView();
  toast(`"${s.title}" subdomain'i silindi.`, 'i');
}

// 💻 SNIPPET / KOD & FİKİR İŞLEMLERİ
function openAddSnippetModal(snipId = null, isIdeaMode = false) {
  _editingSnippetId = snipId;
  const modalTitle = document.querySelector('#addSnippetModal .modal-title');

  if (snipId) {
    const s = (S.snippets || []).find(x => x.id === snipId);
    if (s) {
      document.getElementById('snipTitleInp').value = s.title || '';
      document.getElementById('snipLangInp').value = s.lang || 'HTML';
      document.getElementById('snipCodeInp').value = s.code || '';
      if (modalTitle) modalTitle.textContent = '✏️ Snippet / Not Düzenle';
    }
  } else {
    ['snipTitleInp', 'snipCodeInp'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const sLang = document.getElementById('snipLangInp');
    if (sLang) sLang.value = isIdeaMode ? 'İçerik' : 'HTML';
    if (modalTitle) modalTitle.textContent = isIdeaMode ? '💡 Yeni İçerik Fikri Ekle' : '💻 Kod Snippet / Not Ekle';
  }
  document.getElementById('addSnippetModal')?.classList.add('on');
}

function saveSnippetModal() {
  const title = document.getElementById('snipTitleInp').value.trim();
  const lang = document.getElementById('snipLangInp').value;
  const code = document.getElementById('snipCodeInp').value.trim();

  if (!title || !code) { toast('Lütfen başlık ve kod içeriği girin.', 'e'); return; }

  if (!S.snippets) S.snippets = [];

  if (_editingSnippetId) {
    const s = S.snippets.find(x => x.id === _editingSnippetId);
    if (s) {
      s.title = title;
      s.lang = lang;
      s.code = code;
    }
    toast('Öğe güncellendi! 💻', 's');
  } else {
    S.snippets.push({ id: 'snip_' + Date.now(), title, lang, code });
    toast(lang === 'İçerik' ? 'İçerik fikri kaydedildi! 💡' : 'Kod Snippet kaydedildi! 💻', 's');
  }

  save();
  closeModal('addSnippetModal');
  _editingSnippetId = null;
  activeKomutTab = (lang === 'İçerik') ? 'ideas' : 'snippets';
  renderKomutRotasiView();
}

function deleteSnippet(snipId) {
  if (!S.snippets) return;
  const s = S.snippets.find(x => x.id === snipId);
  if (!s) return;
  S.snippets = S.snippets.filter(x => x.id !== snipId);
  save();
  renderKomutRotasiView();
  toast(`"${s.title}" silindi.`, 'i');
}

// 🛠️ WEBMASTER ARACI İŞLEMLERİ
function openAddWebToolModal(toolId = null) {
  _editingWebToolId = toolId;
  const modalTitle = document.querySelector('#addWebToolModal .modal-title');
  const allTools = S.webTools || [];

  if (toolId) {
    const t = allTools.find(x => x.id === toolId);
    if (t) {
      document.getElementById('webToolTitleInp').value = t.title || '';
      document.getElementById('webToolUrlInp').value = t.url || '';
      document.getElementById('webToolIconInp').value = t.icon || '🌐';
      document.getElementById('webToolNoteInp').value = t.note || '';
      if (modalTitle) modalTitle.textContent = '✏️ Webmaster Aracını Düzenle';
    }
  } else {
    ['webToolTitleInp', 'webToolUrlInp', 'webToolNoteInp'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const wIco = document.getElementById('webToolIconInp'); if (wIco) wIco.value = '🌐';
    if (modalTitle) modalTitle.textContent = '🌐 Webmaster Aracı / Site Bağlantısı Ekle';
  }
  document.getElementById('addWebToolModal')?.classList.add('on');
}

function saveWebToolModal() {
  const title = document.getElementById('webToolTitleInp').value.trim();
  let url = document.getElementById('webToolUrlInp').value.trim();
  const icon = document.getElementById('webToolIconInp').value;
  const note = document.getElementById('webToolNoteInp').value.trim();

  if (!title || !url) { toast('Lütfen araç adı ve web adresi (URL) girin.', 'e'); return; }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  if (!S.webTools) S.webTools = [];

  if (_editingWebToolId) {
    const t = S.webTools.find(x => x.id === _editingWebToolId);
    if (t) {
      t.title = title;
      t.url = url;
      t.icon = icon;
      t.note = note;
    }
    toast('Webmaster aracı güncellendi! 🌐', 's');
  } else {
    S.webTools.push({ id: 'wt_' + Date.now(), title, url, icon, note });
    toast('Yeni Webmaster aracı eklendi! 🌐', 's');
  }

  save();
  closeModal('addWebToolModal');
  _editingWebToolId = null;
  activeKomutTab = 'tools';
  renderKomutRotasiView();
}

function deleteWebTool(toolId) {
  if (!S.webTools) S.webTools = [];
  const t = S.webTools.find(x => x.id === toolId);
  if (!t) return;
  S.webTools = S.webTools.filter(x => x.id !== toolId);
  save();
  renderKomutRotasiView();
  toast(`"${t.title}" kaldırıldı.`, 'i');
}

// ➕ MERKEZİ / TEKİL EKLE MENÜSÜ HEDEF DİNAMİK YÖNETİMİ
function openUnifiedKomutModal(presetTab = null) {
  const targetSel = document.getElementById('uKomutTargetInp');
  if (targetSel) {
    targetSel.value = presetTab || activeKomutTab || 'subdomains';
  }
  
  // Input temizleme
  ['uKomutTitleInp', 'uKomutUrlInp', 'uKomutNoteInp', 'uKomutCodeTitleInp', 'uKomutCodeTextInp'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const ukIco = document.getElementById('uKomutIconInp'); if (ukIco) ukIco.value = '🌐';
  const ukLang = document.getElementById('uKomutCodeLangInp');
  if (ukLang) ukLang.value = (targetSel?.value === 'ideas') ? 'İçerik' : 'HTML';

  onUnifiedKomutTargetChange();
  document.getElementById('unifiedKomutModal')?.classList.add('on');
}

function onUnifiedKomutTargetChange() {
  const target = document.getElementById('uKomutTargetInp')?.value || 'subdomains';
  const linkFields = document.getElementById('uKomutLinkFields');
  const codeFields = document.getElementById('uKomutCodeFields');
  const titleLbl = document.getElementById('uKomutTitleLbl');
  const langSel = document.getElementById('uKomutCodeLangInp');

  if (target === 'subdomains' || target === 'tools') {
    if (linkFields) linkFields.style.display = 'contents';
    if (codeFields) codeFields.style.display = 'none';
    if (titleLbl) titleLbl.textContent = (target === 'subdomains') ? 'Subdomain Adı / Başlık' : 'Webmaster Aracı Adı';
  } else {
    if (linkFields) linkFields.style.display = 'none';
    if (codeFields) codeFields.style.display = 'contents';
    if (langSel) {
      if (target === 'ideas') langSel.value = 'İçerik';
      else if (langSel.value === 'İçerik') langSel.value = 'HTML';
    }
  }
}

function saveUnifiedKomutModal() {
  const target = document.getElementById('uKomutTargetInp')?.value || 'subdomains';

  if (target === 'subdomains') {
    const title = document.getElementById('uKomutTitleInp').value.trim();
    let url = document.getElementById('uKomutUrlInp').value.trim();
    const icon = document.getElementById('uKomutIconInp').value;
    const note = document.getElementById('uKomutNoteInp').value.trim();

    if (!title || !url) { toast('Lütfen subdomain adı ve web adresi (URL) girin.', 'e'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    if (!S.subdomains) S.subdomains = [];
    S.subdomains.push({ id: 'sd_' + Date.now(), title, url, icon, note });
    toast('Yeni Subdomain eklendi! 🌐', 's');
    activeKomutTab = 'subdomains';

  } else if (target === 'tools') {
    const title = document.getElementById('uKomutTitleInp').value.trim();
    let url = document.getElementById('uKomutUrlInp').value.trim();
    const icon = document.getElementById('uKomutIconInp').value;
    const note = document.getElementById('uKomutNoteInp').value.trim();

    if (!title || !url) { toast('Lütfen araç adı ve web adresi (URL) girin.', 'e'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    if (!S.webTools) S.webTools = [];
    S.webTools.push({ id: 'wt_' + Date.now(), title, url, icon, note });
    toast('Yeni Webmaster aracı eklendi! 🛠️', 's');
    activeKomutTab = 'tools';

  } else if (target === 'snippets' || target === 'ideas') {
    const title = document.getElementById('uKomutCodeTitleInp').value.trim();
    const lang = document.getElementById('uKomutCodeLangInp').value;
    const code = document.getElementById('uKomutCodeTextInp').value.trim();

    if (!title || !code) { toast('Lütfen başlık ve kod/not içeriği girin.', 'e'); return; }

    if (!S.snippets) S.snippets = [];
    S.snippets.push({ id: 'snip_' + Date.now(), title, lang, code });
    toast(target === 'ideas' || lang === 'İçerik' ? 'Yeni İçerik Fikri eklendi! 💡' : 'Yeni Kod Snippet eklendi! 💻', 's');
    activeKomutTab = (target === 'ideas' || lang === 'İçerik') ? 'ideas' : 'snippets';
  }

  save();
  closeModal('unifiedKomutModal');
  
  // Tab vurgusunu güncelle
  document.querySelectorAll('#v-komutrotasi .fchip').forEach(b => b.classList.remove('on'));
  const activeChip = document.getElementById(`ktab-${activeKomutTab}`);
  if (activeChip) activeChip.classList.add('on');

  renderKomutRotasiView();
}

function renderKomutRotasiView() {
  const cont = document.getElementById('komutGridContainer');
  if (!cont) return;

  if (!S.snippets) S.snippets = [];
  if (!S.subdomains || !S.subdomains.length) {
    S.subdomains = JSON.parse(JSON.stringify(DEFAULT_SUBDOMAINS));
  }
  if (!S.webTools || !S.webTools.length) {
    S.webTools = JSON.parse(JSON.stringify(DEFAULT_WEB_TOOLS));
  }

  if (activeKomutTab === 'subdomains') {
    cont.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:14px; width:100%;">
        ${S.subdomains.map(sd => `
          <div style="background:var(--sf); border:1px solid var(--bd); padding:18px; border-radius:14px; display:flex; flex-direction:column; justify-content:space-between; gap:12px; transition:all 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="font-size:2rem;">${esc(sd.icon || '🌐')}</div>
                <div style="display:flex; gap:4px;">
                  <button class="book-act-btn" onclick="openAddSubdomainModal('${sd.id}')" title="Düzenle">✏️</button>
                  <button class="book-act-btn del" onclick="deleteSubdomain('${sd.id}')" title="Sil">🗑️</button>
                </div>
              </div>
              <div style="font-weight:800; font-size:1.05rem; color:var(--gold); margin-bottom:4px;">${esc(sd.title)}</div>
              <div style="font-size:0.78rem; font-weight:700; color:var(--teal); margin-bottom:6px;">🔗 ${esc(sd.url)}</div>
              ${sd.note ? `<div style="font-size:0.8rem; color:var(--tx2); line-height:1.4;">${esc(sd.note)}</div>` : ''}
            </div>
            <button class="btn btn-primary" onclick="window.open('${esc(sd.url)}', '_blank')" style="font-size:0.8rem; width:100%; font-weight:700; margin-top:6px;">
              Subdomain'e Git ↗
            </button>
          </div>
        `).join('')}

        <div onclick="openAddSubdomainModal()" style="background:rgba(232,184,75,0.04); border:2px dashed var(--bd); padding:20px; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; min-height:160px; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--gold)';" onmouseout="this.style.borderColor='var(--bd)';">
          <div style="font-size:2rem; color:var(--gold);">🌐</div>
          <div style="font-weight:800; font-size:0.9rem; color:var(--gold);">+ Yeni Subdomain Ekle</div>
          <div style="font-size:0.75rem; color:var(--tx3); text-align:center;">mikat.komutrotasi.com, lab.komutrotasi.com vb.</div>
        </div>
      </div>
    `;
    return;
  }

  if (activeKomutTab === 'tools') {
    cont.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:14px; width:100%;">
        ${S.webTools.map(wt => `
          <div style="background:var(--sf); border:1px solid var(--bd); padding:18px; border-radius:14px; display:flex; flex-direction:column; justify-content:space-between; gap:12px; transition:all 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="font-size:2rem;">${esc(wt.icon || '🌐')}</div>
                <div style="display:flex; gap:4px;">
                  <button class="book-act-btn" onclick="openAddWebToolModal('${wt.id}')" title="Düzenle">✏️</button>
                  <button class="book-act-btn del" onclick="deleteWebTool('${wt.id}')" title="Sil">🗑️</button>
                </div>
              </div>
              <div style="font-weight:800; font-size:1.05rem; color:var(--teal); margin-bottom:4px;">${esc(wt.title)}</div>
              ${wt.note ? `<div style="font-size:0.8rem; color:var(--tx2); line-height:1.4;">${esc(wt.note)}</div>` : ''}
            </div>
            <button class="btn btn-primary" onclick="window.open('${esc(wt.url)}', '_blank')" style="font-size:0.8rem; width:100%; font-weight:700; margin-top:6px;">
              Siteye / Araca Git ↗
            </button>
          </div>
        `).join('')}
        
        <div onclick="openAddWebToolModal()" style="background:rgba(62,207,176,0.04); border:2px dashed var(--bd); padding:20px; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; min-height:160px; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--teal)';" onmouseout="this.style.borderColor='var(--bd)';">
          <div style="font-size:2rem; color:var(--teal);">🛠️</div>
          <div style="font-weight:800; font-size:0.9rem; color:var(--teal);">+ Yeni Webmaster Aracı Ekle</div>
          <div style="font-size:0.75rem; color:var(--tx3); text-align:center;">Analytics, Search Console, PageSpeed vb.</div>
        </div>
      </div>
    `;
    return;
  }

  let list = S.snippets;
  if (activeKomutTab === 'snippets') {
    list = list.filter(s => s.lang !== 'İçerik');
  } else if (activeKomutTab === 'ideas') {
    list = list.filter(s => s.lang === 'İçerik');
  }

  const q = (document.getElementById('searchKomutInp')?.value || '').toLowerCase().trim();
  if (q) list = list.filter(s => (s.title || '').toLowerCase().includes(q) || (s.code || '').toLowerCase().includes(q));

  if (!list.length) {
    const isIdea = (activeKomutTab === 'ideas');
    cont.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
        <div class="empty"><div class="empty-ico">${isIdea ? '💡' : '💻'}</div><div class="empty-txt">${isIdea ? 'Henüz içerik fikri eklenmemiş.' : 'Kayıtlı kod snippet bulunamadı.'}</div></div>
        <div onclick="openAddSnippetModal(null, ${isIdea})" style="background:rgba(62,207,176,0.04); border:2px dashed var(--bd); padding:20px; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--teal)';" onmouseout="this.style.borderColor='var(--bd)';">
          <div style="font-size:2rem; color:var(--teal);">${isIdea ? '💡' : '💻'}</div>
          <div style="font-weight:800; font-size:0.9rem; color:var(--teal);">${isIdea ? '+ Yeni İçerik Fikri Ekle' : '+ Yeni Kod Snippet Ekle'}</div>
        </div>
      </div>
    `;
    return;
  }

  cont.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
      ${list.map(s => `
        <div style="background:var(--sf); border:1px solid var(--bd); border-radius:14px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; width:100%; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; width:100%;">
            <div style="display:flex; align-items:center; gap:6px; flex:1 1 auto; min-width:0;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--teal); background:rgba(62,207,176,0.12); padding:2px 7px; border-radius:6px; white-space:nowrap; flex-shrink:0;">${esc(s.lang)}</span>
              <span style="font-weight:800; font-size:0.95rem; color:var(--tx); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(s.title)}</span>
            </div>
            <div style="display:flex; gap:4px; align-items:center; flex-shrink:0; margin-left:auto;">
              <button class="book-act-btn" onclick="openAddSnippetModal('${s.id}')" title="Düzenle">✏️ Düzenle</button>
              <button class="book-act-btn del" onclick="deleteSnippet('${s.id}')" title="Sil">🗑️ Sil</button>
              <button class="book-act-btn" onclick="navigator.clipboard.writeText(\`${esc(s.code)}\`); toast('Kod panoya kopyalandı!', 's');" title="Kopyala">📋 Kopyala</button>
            </div>
          </div>
          <pre style="background:var(--sf2); border:1px solid var(--bd); padding:10px; border-radius:10px; font-family:'JetBrains Mono',monospace; font-size:0.80rem; color:var(--gold); overflow-x:auto; margin:0; box-sizing:border-box;"><code>${esc(s.code)}</code></pre>
        </div>
      `).join('')}
    </div>
  `;
}

/* ════════════════════════════════════════════════════════════
   5. DERS & ÖĞRETMENLİK PANELİ MODÜLÜ
   ════════════════════════════════════════════════════════════ */
let activeTeacherTab = 'classes';
let _editingTeacherTaskId = null;

function switchTeacherTab(tab, btn) {
  activeTeacherTab = tab;
  document.querySelectorAll('#v-teacher .fchip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderTeacherView();
}

function openAddTeacherTaskModal(taskId = null, presetTab = null) {
  _editingTeacherTaskId = taskId;
  const modalTitle = document.querySelector('#addTeacherTaskModal .modal-title');
  const targetTab = presetTab || activeTeacherTab || 'classes';

  if (taskId) {
    const t = (S.teacherTasks || []).find(x => x.id === taskId);
    if (t) {
      document.getElementById('ttaskTitleInp').value = t.title || '';
      document.getElementById('ttaskClassInp').value = t.class || '5. Sınıf';
      document.getElementById('ttaskTypeInp').value = t.type || 'Müfredat';
      if (modalTitle) modalTitle.textContent = '✏️ Ders Görevini Düzenle';
    }
  } else {
    const ttTitle = document.getElementById('ttaskTitleInp'); if (ttTitle) ttTitle.value = '';
    const ttClass = document.getElementById('ttaskClassInp'); if (ttClass) ttClass.value = targetTab === 'lab' ? 'Laboratuvar' : '5. Sınıf';
    const ttType = document.getElementById('ttaskTypeInp'); if (ttType) ttType.value = targetTab === 'exams' ? 'Sınav' : (targetTab === 'lab' ? 'Lab' : 'Müfredat');
    if (modalTitle) modalTitle.textContent = '🏫 Ders / Sınıf Görevi Ekle';
  }
  document.getElementById('addTeacherTaskModal')?.classList.add('on');
}

function saveTeacherTaskModal() {
  const title = document.getElementById('ttaskTitleInp').value.trim();
  const cls = document.getElementById('ttaskClassInp').value;
  const type = document.getElementById('ttaskTypeInp').value;

  if (!title) { toast('Lütfen görev başlığı girin.', 'e'); return; }

  if (!S.teacherTasks) S.teacherTasks = [];

  let tabTarget = activeTeacherTab || 'classes';
  if (type === 'Sınav' || type === 'Ödev') tabTarget = 'exams';
  else if (type === 'Lab' || cls === 'Laboratuvar') tabTarget = 'lab';
  else if (type === 'Müfredat') tabTarget = 'classes';

  if (_editingTeacherTaskId) {
    const t = S.teacherTasks.find(x => x.id === _editingTeacherTaskId);
    if (t) {
      t.title = title;
      t.class = cls;
      t.type = type;
      t.tabTarget = tabTarget;
    }
    toast('Ders görevi güncellendi! 🏫', 's');
  } else {
    S.teacherTasks.push({ id: 'tt_' + Date.now(), title, class: cls, type, tabTarget, done: false });
    toast('Ders görevi eklendi! 🏫', 's');
  }

  save();
  closeModal('addTeacherTaskModal');
  _editingTeacherTaskId = null;
  activeTeacherTab = tabTarget;
  renderTeacherView();
}

// ➕ MERKEZİ / TEKİL BİLİŞİMCİ HOCAM EKLE MENÜSÜ
function openUnifiedTeacherModal(presetTab = null) {
  const targetSel = document.getElementById('uTeacherTargetInp');
  if (targetSel) {
    targetSel.value = presetTab || activeTeacherTab || 'classes';
  }

  const utTitle = document.getElementById('uTeacherTitleInp'); if (utTitle) utTitle.value = '';
  onUnifiedTeacherTargetChange();
  document.getElementById('unifiedTeacherModal')?.classList.add('on');
}

function onUnifiedTeacherTargetChange() {
  const target = document.getElementById('uTeacherTargetInp')?.value || 'classes';
  const classSel = document.getElementById('uTeacherClassInp');
  const typeSel = document.getElementById('uTeacherTypeInp');

  if (target === 'classes') {
    if (classSel && classSel.value === 'Laboratuvar') classSel.value = '5. Sınıf';
    if (typeSel) typeSel.value = 'Müfredat';
  } else if (target === 'exams') {
    if (classSel && classSel.value === 'Laboratuvar') classSel.value = '5. Sınıf';
    if (typeSel) typeSel.value = 'Sınav';
  } else if (target === 'lab') {
    if (classSel) classSel.value = 'Laboratuvar';
    if (typeSel) typeSel.value = 'Lab';
  }
}

function saveUnifiedTeacherModal() {
  const target = document.getElementById('uTeacherTargetInp')?.value || 'classes';
  const title = document.getElementById('uTeacherTitleInp').value.trim();
  const cls = document.getElementById('uTeacherClassInp').value;
  const type = document.getElementById('uTeacherTypeInp').value;

  if (!title) { toast('Lütfen görev / ders başlığı girin.', 'e'); return; }

  if (!S.teacherTasks) S.teacherTasks = [];

  S.teacherTasks.push({
    id: 'tt_' + Date.now(),
    title,
    class: cls,
    type,
    tabTarget: target,
    done: false
  });

  toast(target === 'exams' ? 'Sınav & Ödev görevi eklendi! 📝' : (target === 'lab' ? 'Lab & Tahta görevi eklendi! 🖥️' : 'Müfredat görevi eklendi! 📚'), 's');

  save();
  closeModal('unifiedTeacherModal');
  activeTeacherTab = target;

  // Tab vurgusunu güncelle
  document.querySelectorAll('#v-teacher .fchip').forEach(b => b.classList.remove('on'));
  const activeChip = document.getElementById(`ttab-${activeTeacherTab}`);
  if (activeChip) activeChip.classList.add('on');

  renderTeacherView();
}

function deleteTeacherTask(taskId) {
  if (!S.teacherTasks) return;
  const t = S.teacherTasks.find(x => x.id === taskId);
  if (!t) return;
  S.teacherTasks = S.teacherTasks.filter(x => x.id !== taskId);
  save();
  renderTeacherView();
  toast(`"${t.title}" silindi.`, 'i');
}

function toggleTeacherTask(id) {
  const t = (S.teacherTasks || []).find(x => x.id === id);
  if (t) {
    t.done = !t.done;
    save();
    renderTeacherView();
    toast(t.done ? 'Görev tamamlandı! 🎉' : 'Görev geri alındı.', 'i');
  }
}

function renderTeacherView() {
  const cont = document.getElementById('teacherGridContainer');
  if (!cont) return;

  if (!S.teacherTasks) S.teacherTasks = [];

  let list = S.teacherTasks;
  if (activeTeacherTab === 'classes') {
    list = list.filter(t => t.tabTarget === 'classes' || (!t.tabTarget && (t.type === 'Müfredat' || (t.class && !t.class.includes('Laboratuvar') && t.type !== 'Sınav' && t.type !== 'Ödev' && t.type !== 'Lab'))));
  } else if (activeTeacherTab === 'exams') {
    list = list.filter(t => t.tabTarget === 'exams' || (!t.tabTarget && (t.type === 'Sınav' || t.type === 'Ödev')));
  } else if (activeTeacherTab === 'lab') {
    list = list.filter(t => t.tabTarget === 'lab' || (!t.tabTarget && (t.type === 'Lab' || t.class === 'Laboratuvar')));
  }

  const q = (document.getElementById('searchTeacherInp')?.value || '').toLowerCase().trim();
  if (q) list = list.filter(t => (t.title || '').toLowerCase().includes(q) || (t.class || '').toLowerCase().includes(q));

  const tabNames = {
    classes: 'Sınıflar & Müfredat',
    exams: 'Sınav & Ödev',
    lab: 'Lab & Tahta'
  };

  if (!list.length) {
    cont.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
        <div class="empty"><div class="empty-ico">🏫</div><div class="empty-txt">Bu kategoride (${tabNames[activeTeacherTab] || ''}) henüz görev bulunamadı.</div></div>
        <div onclick="openAddTeacherTaskModal(null, '${activeTeacherTab}')" style="background:rgba(167,139,250,0.04); border:2px dashed var(--bd); padding:20px; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--pur)';" onmouseout="this.style.borderColor='var(--bd)';">
          <div style="font-size:2rem; color:var(--pur);">🏫</div>
          <div style="font-weight:800; font-size:0.9rem; color:var(--pur);">+ Yeni ${tabNames[activeTeacherTab] || 'Görev'} Ekle</div>
        </div>
      </div>
    `;
    return;
  }

  cont.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
      ${list.map(t => `
        <div style="background:var(--sf); border:1.5px solid ${t.done ? 'var(--teal)' : 'var(--bd)'}; border-radius:14px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%; box-sizing:border-box; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:10px; cursor:pointer; flex:1 1 180px; min-width:0;" onclick="toggleTeacherTask('${t.id}')">
            <div style="width:24px; height:24px; border-radius:50%; border:2px solid ${t.done ? 'var(--teal)' : 'var(--tx3)'}; background:${t.done ? 'var(--teal)' : 'transparent'}; color:#0b1320; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.80rem; flex-shrink:0;">
              ${t.done ? '✓' : ''}
            </div>
            <div style="min-width:0; flex:1;">
              <div style="font-weight:800; font-size:0.95rem; color:${t.done ? 'var(--teal)' : 'var(--tx)'}; text-decoration:${t.done ? 'line-through' : 'none'}; word-break:break-word;">${esc(t.title)}</div>
              <div style="display:flex; gap:6px; margin-top:3px; flex-wrap:wrap;">
                <span style="font-size:0.70rem; font-weight:700; color:var(--pur); background:rgba(167,139,250,0.12); padding:1px 6px; border-radius:6px;">${esc(t.class)}</span>
                <span style="font-size:0.70rem; font-weight:700; color:var(--gold); background:rgba(232,184,75,0.12); padding:1px 6px; border-radius:6px;">${esc(t.type)}</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:4px; align-items:center; flex-shrink:0; margin-left:auto;">
            <button class="book-act-btn" onclick="openAddTeacherTaskModal('${t.id}')" title="Düzenle">✏️ Düzenle</button>
            <button class="book-act-btn del" onclick="deleteTeacherTask('${t.id}')" title="Sil">🗑️ Sil</button>
            <button class="book-act-btn focus" onclick="startFocusForTask('ttask_${t.id}', 30)" title="30dk Odaklan">⏱ 30dk</button>
          </div>
        </div>
      `).join('')}

      <div onclick="openAddTeacherTaskModal(null, '${activeTeacherTab}')" style="background:rgba(167,139,250,0.04); border:2px dashed var(--bd); padding:14px; border-radius:14px; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; margin-top:4px; transition:all 0.2s ease;" onmouseover="this.style.borderColor='var(--pur)';" onmouseout="this.style.borderColor='var(--bd)';">
        <div style="font-size:1.2rem; color:var(--pur);">➕</div>
        <div style="font-weight:800; font-size:0.88rem; color:var(--pur);">+ Bu Kategoriye (${tabNames[activeTeacherTab] || ''}) Görev Ekle</div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════════════
   6. KİŞİSEL FİNANS & BÜTÇE TAKİBİ MODÜLÜ
   ════════════════════════════════════════════════════════════ */
let activeFinanceTab = 'all';
let _editingFinanceId = null;

const DEFAULT_FINANCE_ITEMS = [
  { id: 'fin1', title: 'Öğretmenlik Maaşı (Milli Eğitim)', type: 'income', amount: 42500, category: 'Maaş / Ek Ders', date: today(), note: 'Aylık sabit maaş ödemesi', totalInstallments: 1, paidInstallments: 0 },
  { id: 'fin2', title: 'Okul Ek Ders Ücreti', type: 'income', amount: 4800, category: 'Maaş / Ek Ders', date: today(), note: 'Aylık 40 saat ek ders', totalInstallments: 1, paidInstallments: 0 },
  { id: 'fin3', title: 'Komut Rotası Sunucu & Hosting', type: 'expense', amount: 450, category: 'Hosting / Domain', date: today(), note: 'Hetzner VPS sunucu ödemesi', totalInstallments: 1, paidInstallments: 0 },
  { id: 'fin4', title: 'Bilişim Laboratuvarı Laptop Alımı', type: 'expense', amount: 24000, category: 'Okul / Eğitim', date: today(), note: '12 Taksitli bilgisayar alımı', totalInstallments: 12, paidInstallments: 4 },
  { id: 'fin5', title: 'Ev İnterneti (Türk Telekom Fiber)', type: 'expense', amount: 390, category: 'Fatura / Ev', date: today(), note: 'Aylık fiber internet faturası', totalInstallments: 1, paidInstallments: 0 }
];

function toggleInstallmentDetails() {
  const count = parseInt(document.getElementById('finInstallmentCountInp')?.value || '1', 10);
  const row = document.getElementById('finPaidInstallmentsRow');
  if (row) {
    row.style.display = count > 1 ? 'block' : 'none';
  }
}

function payFinanceInstallment(id) {
  const allItems = S.financeItems || DEFAULT_FINANCE_ITEMS;
  const f = allItems.find(x => x.id === id);
  if (f && (f.totalInstallments || 1) > 1) {
    const totalInst = f.totalInstallments;
    const curPaid = f.paidInstallments || 0;
    if (curPaid < totalInst) {
      f.paidInstallments = curPaid + 1;
      save();
      renderFinanceView();
      toast(`"${f.title}" için ${f.paidInstallments}/${totalInst}. taksit ödendi! 💳`, 's');
    } else {
      toast('Bu işlemin tüm taksitleri zaten ödenmiş.', 'i');
    }
  }
}

const DEFAULT_FINANCE_CATEGORIES = [
  'Maaş / Ek Ders',
  'Hosting / Domain',
  'Abonelik / Yazılım',
  'Fatura / Ev',
  'Okul / Eğitim',
  'Mutfak / Market',
  'Ulaşım / Yakıt',
  'Diğer'
];

function getFinanceCategories() {
  if (!S.financeCategories || !S.financeCategories.length) {
    S.financeCategories = [...DEFAULT_FINANCE_CATEGORIES];
  }
  return S.financeCategories;
}

function openManageFinanceCategoriesModal() {
  renderFinanceCategoryManagerList();
  document.getElementById('manageFinanceCategoriesModal')?.classList.add('on');
}

function renderFinanceCategoryManagerList() {
  const cont = document.getElementById('finCategoryManagerList');
  if (!cont) return;
  const cats = getFinanceCategories();

  cont.innerHTML = cats.map((cat, i) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--sf2); border:1px solid var(--bd); padding:8px 12px; border-radius:8px;">
      <span style="font-weight:700; font-size:0.88rem; color:var(--tx);">${esc(cat)}</span>
      <button class="tbtn" onclick="deleteCustomFinanceCategory(${i})" style="font-size:0.75rem; padding:2px 6px; color:#ef4444;" title="Kategoriyi Sil">🗑️</button>
    </div>
  `).join('');

  populateFinanceCategorySelect();
}

function addCustomFinanceCategory() {
  const inp = document.getElementById('newFinCatInp');
  const val = (inp?.value || '').trim();
  if (!val) { toast('Lütfen kategori adı girin.', 'e'); return; }

  const cats = getFinanceCategories();
  if (cats.includes(val)) { toast('Bu kategori zaten mevcut.', 'i'); return; }

  cats.push(val);
  save();
  if (inp) inp.value = '';
  renderFinanceCategoryManagerList();
  toast(`"${val}" kategorisi eklendi! ⚙️`, 's');
}

function deleteCustomFinanceCategory(index) {
  const cats = getFinanceCategories();
  if (index >= 0 && index < cats.length) {
    const deleted = cats.splice(index, 1)[0];
    save();
    renderFinanceCategoryManagerList();
    toast(`"${deleted}" kategorisi silindi.`, 'i');
  }
}

function populateFinanceCategorySelect() {
  const sel = document.getElementById('finCategoryInp');
  if (!sel) return;
  const curVal = sel.value;
  const cats = getFinanceCategories();

  sel.innerHTML = cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  if (curVal && cats.includes(curVal)) {
    sel.value = curVal;
  }
}

function switchFinanceTab(tab, btn) {
  activeFinanceTab = tab;
  document.querySelectorAll('#v-finance .fchip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderFinanceView();
}

function openAddFinanceModal(itemValId = null) {
  populateFinanceCategorySelect();
  _editingFinanceId = itemValId;
  const modalTitle = document.querySelector('#addFinanceModal .modal-title');
  const allItems = S.financeItems || DEFAULT_FINANCE_ITEMS;

  if (itemValId) {
    const f = allItems.find(x => x.id === itemValId);
    if (f) {
      document.getElementById('finTitleInp').value = f.title || '';
      document.getElementById('finTypeInp').value = f.type || 'expense';
      document.getElementById('finAmountInp').value = f.amount || '';
      document.getElementById('finCategoryInp').value = f.category || 'Diğer';
      document.getElementById('finDateInp').value = f.date || today();
      document.getElementById('finInstallmentCountInp').value = f.totalInstallments || 1;
      document.getElementById('finPaidInstallmentsInp').value = f.paidInstallments || 0;
      document.getElementById('finNoteInp').value = f.note || '';
      if (modalTitle) modalTitle.textContent = '✏️ Finans İşlemini Düzenle';
    }
  } else {
    ['finTitleInp', 'finAmountInp', 'finNoteInp'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const fType = document.getElementById('finTypeInp'); if (fType) fType.value = 'expense';
    const cats = getFinanceCategories();
    const fCat = document.getElementById('finCategoryInp'); if (fCat) fCat.value = cats[0] || 'Maaş / Ek Ders';
    const fDate = document.getElementById('finDateInp'); if (fDate) fDate.value = today();
    const fInst = document.getElementById('finInstallmentCountInp'); if (fInst) fInst.value = '1';
    const fPaid = document.getElementById('finPaidInstallmentsInp'); if (fPaid) fPaid.value = '0';
    if (modalTitle) modalTitle.textContent = '💰 Finans İşlemi Ekle';
  }
  toggleInstallmentDetails();
  document.getElementById('addFinanceModal')?.classList.add('on');
}

function saveFinanceModal() {
  const title = document.getElementById('finTitleInp').value.trim();
  const type = document.getElementById('finTypeInp').value;
  const amount = parseFloat(document.getElementById('finAmountInp').value || '0');
  const category = document.getElementById('finCategoryInp').value;
  const date = document.getElementById('finDateInp').value || today();
  const totalInstallments = parseInt(document.getElementById('finInstallmentCountInp').value || '1', 10);
  const paidInstallments = parseInt(document.getElementById('finPaidInstallmentsInp').value || '0', 10);
  const note = document.getElementById('finNoteInp').value.trim();

  if (!title || isNaN(amount) || amount <= 0) {
    toast('Lütfen geçerli bir işlem adı ve tutar girin.', 'e');
    return;
  }

  if (!S.financeItems) S.financeItems = [...DEFAULT_FINANCE_ITEMS];

  if (_editingFinanceId) {
    const f = S.financeItems.find(x => x.id === _editingFinanceId);
    if (f) {
      f.title = title;
      f.type = type;
      f.amount = amount;
      f.category = category;
      f.date = date;
      f.totalInstallments = totalInstallments;
      f.paidInstallments = Math.min(totalInstallments, paidInstallments);
      f.note = note;
    }
    toast('İşlem güncellendi! 💰', 's');
  } else {
    S.financeItems.push({ id: 'fin_' + Date.now(), title, type, amount, category, date, totalInstallments, paidInstallments: Math.min(totalInstallments, paidInstallments), note });
    toast(type === 'income' ? 'Gelir kaydedildi! 📥' : 'Gider kaydedildi! 📤', 's');
  }

  save();
  closeModal('addFinanceModal');
  _editingFinanceId = null;
  renderFinanceView();
}

function deleteFinanceItem(itemId) {
  if (!S.financeItems) S.financeItems = [...DEFAULT_FINANCE_ITEMS];
  const f = S.financeItems.find(x => x.id === itemId);
  if (!f) return;
  S.financeItems = S.financeItems.filter(x => x.id !== itemId);
  save();
  renderFinanceView();
  toast(`"${f.title}" silindi.`, 'i');
}

function fmtTL(num) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(num || 0);
}

function renderFinanceView() {
  const cont = document.getElementById('financeGridContainer');
  if (!cont) return;

  if (!S.financeItems) S.financeItems = [...DEFAULT_FINANCE_ITEMS];

  const totalInc = S.financeItems.filter(x => x.type === 'income').reduce((acc, x) => acc + (x.amount || 0), 0);
  const totalExp = S.financeItems.filter(x => x.type === 'expense').reduce((acc, x) => acc + (x.amount || 0), 0);
  const netBal = totalInc - totalExp;

  const incEl = document.getElementById('finTotalIncome');
  const expEl = document.getElementById('finTotalExpense');
  const netEl = document.getElementById('finNetBalance');

  if (incEl) incEl.textContent = fmtTL(totalInc);
  if (expEl) expEl.textContent = fmtTL(totalExp);
  if (netEl) {
    netEl.textContent = fmtTL(netBal);
    netEl.style.color = netBal >= 0 ? 'var(--teal)' : '#ef4444';
  }

  let list = S.financeItems;
  if (activeFinanceTab === 'income') {
    list = list.filter(x => x.type === 'income');
  } else if (activeFinanceTab === 'expense') {
    list = list.filter(x => x.type === 'expense');
  } else if (activeFinanceTab === 'installments') {
    list = list.filter(x => (x.totalInstallments || 1) > 1);
  } else if (activeFinanceTab === 'sub') {
    list = list.filter(x => x.category === 'Abonelik / Yazılım' || x.category === 'Fatura / Ev');
  }

  const q = (document.getElementById('searchFinanceInp')?.value || '').toLowerCase().trim();
  if (q) list = list.filter(x => (x.title || '').toLowerCase().includes(q) || (x.category || '').toLowerCase().includes(q) || (x.note || '').toLowerCase().includes(q));

  if (!list.length) {
    cont.innerHTML = `<div class="empty"><div class="empty-ico">💰</div><div class="empty-txt">Kayıtlı işlem bulunamadı.</div></div>`;
    return;
  }

  cont.innerHTML = list.map(f => {
    const isInc = f.type === 'income';
    const totalInst = f.totalInstallments || 1;
    const paidInst = f.paidInstallments || 0;
    const isInst = totalInst > 1;
    const monthlyAmt = isInst ? f.amount / totalInst : f.amount;

    return `
      <div class="fin-card-item" style="background:var(--sf); border:1.5px solid ${isInc ? 'rgba(62,207,176,0.35)' : (isInst ? 'rgba(232,184,75,0.35)' : 'var(--bd)')}; border-radius:14px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; width:100%; box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap; gap:8px; width:100%; box-sizing:border-box;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1 1 auto; overflow:hidden;">
            <div style="width:30px; height:30px; border-radius:8px; background:${isInc ? 'rgba(62,207,176,0.14)' : (isInst ? 'rgba(232,184,75,0.14)' : 'rgba(239,68,68,0.12)')}; color:${isInc ? 'var(--teal)' : (isInst ? 'var(--gold)' : '#ef4444')}; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; font-weight:900;">
              ${isInc ? '📥' : (isInst ? '💳' : '📤')}
            </div>
            <div style="font-weight:800; font-size:0.95rem; color:var(--tx); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;">
              ${esc(f.title)}
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0; margin-left:auto;">
            <div style="font-weight:900; font-size:1.05rem; color:${isInc ? 'var(--teal)' : '#ef4444'}; white-space:nowrap; font-family:'JetBrains Mono',monospace;">
              ${isInc ? '+' : '-'}${fmtTL(f.amount)}
            </div>
            <div style="display:flex; gap:4px; align-items:center; flex-shrink:0;">
              ${isInst && paidInst < totalInst ? `<button class="fin-act-btn focus" onclick="payFinanceInstallment('${f.id}')" title="1 Taksit Öde">💳 Öde</button>` : ''}
              <button class="fin-act-btn" onclick="openAddFinanceModal('${f.id}')" title="Düzenle">✏️</button>
              <button class="fin-act-btn del" onclick="deleteFinanceItem('${f.id}')" title="Sil">🗑️</button>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; width:100%; font-size:0.72rem; box-sizing:border-box;">
          <span style="font-weight:700; color:var(--gold); background:rgba(232,184,75,0.12); padding:2px 7px; border-radius:6px; white-space:nowrap;">${esc(f.category)}</span>
          ${isInst ? `<span style="font-weight:800; color:var(--teal); background:rgba(62,207,176,0.12); padding:2px 7px; border-radius:6px; white-space:nowrap;">💳 ${paidInst}/${totalInst} Taksit (${fmtTL(monthlyAmt)}/ay) ${paidInst >= totalInst ? '✅ Borç Bitti' : `· Kalan: ${totalInst - paidInst}`}</span>` : ''}
          ${f.date ? `<span style="color:var(--tx3); white-space:nowrap;">📅 ${esc(f.date)}</span>` : ''}
          ${f.note ? `<span style="color:var(--tx2); font-style:italic; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;">💬 ${esc(f.note)}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}


/* ════════════════════════════════════════════════════════════
   MOBİL UX İYİLEŞTİRMELERİ
   ════════════════════════════════════════════════════════════ */

/* ─── MOBİL DRAWER (Slide-in Menü) ─── */
function toggleMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  if (!drawer) return;

  const isOpen = drawer.classList.contains('on');
  if (isOpen) {
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
}

function openMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  if (!drawer) return;

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  // Önce overlay'i display:block yap, sonra opacity geçişi için on class'ını ekle
  overlay.style.display = 'block';
  requestAnimationFrame(() => {
    drawer.classList.add('on');
    overlay.classList.add('on');
    if (hamburgerBtn) hamburgerBtn.textContent = '✕';
  });

  // Klavye erişilebilirlik: escape ile kapat
  document.addEventListener('keydown', _drawerEscHandler);
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (!drawer) return;

  drawer.classList.remove('on');
  overlay.classList.remove('on');
  if (hamburgerBtn) hamburgerBtn.textContent = '☰';

  // Geçiş bittikten sonra display'i kaldır
  setTimeout(() => {
    if (!overlay.classList.contains('on')) {
      overlay.style.display = 'none';
    }
  }, 280);

  document.removeEventListener('keydown', _drawerEscHandler);
}

function _drawerEscHandler(e) {
  if (e.key === 'Escape') closeMobileDrawer();
}

/**
 * iOS Safari'de %100vh gerçek görünür alanı kapsamaz.
 * Gerçek görünür yüksekliği CSS değişkeni olarak set ediyoruz.
 */
function setMobileVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setMobileVH, { passive: true });
window.addEventListener('orientationchange', () => {
  setTimeout(setMobileVH, 100);
}, { passive: true });
setMobileVH();

/**
 * Modal açıldığında mobilde body kaydırmasını kilitler,
 * kapandığında geri açar (iOS Safari bounce scroll fix).
 */
(function patchModalScroll() {
  const origOpen = window.openModal || function(){};
  const origClose = window.closeModal || function(){};

  // Modal açma/kapama sinyallerini body class üzerinden yönet
  const observer = new MutationObserver(() => {
    const hasOpenModal = document.querySelector('.mov.on') !== null;
    if (hasOpenModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  observer.observe(document.body, { subtree: true, attributeFilter: ['class'], attributes: true });
})();

/**
 * Bottom navigation aktif öğeyi scroll ile görünür kılar.
 * showView çağrıldığında otomatik tetiklenir.
 */
function syncBottomNavScroll(viewName) {
  const nav = document.getElementById('mobileBottomNav');
  if (!nav || window.innerWidth > 768) return;

  const activeBtn = nav.querySelector('.mb-nav-item.on');
  if (activeBtn) {
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// showView'i wrap ederek bottom nav scroll sync ve drawer kapat ekle
const _origShowView = window.showView;
window.showView = function(v, el) {
  _origShowView(v, el);
  syncBottomNavScroll(v);
  if (v === 'calendar') {
    updateMobileStats();
  }
  // Mobilede drawer açıksa otomatik kapat
  if (window.innerWidth <= 768) {
    closeMobileDrawer();
  }
};

/* ─── CANLI İSTATİSTİKLER (TAKVİM MENÜSÜ MOBİL MSTAT CHIP'LERİ) ─── */
function updateMobileStats() {
  const msgEl = document.getElementById('mobileStatsMsg');
  if (!msgEl) return;

  const dt = selectedDate || today();
  const isToday = dt === today();
  const dateObj = new Date(dt + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  const dateStr = isToday ? `Bugün (${formattedDate})` : formattedDate;

  // 1. Görevler (Seçili güne ait görevler / seçilmediyse bugünün görevleri)
  const dayTasks = (S.tasks || []).filter(t => t.due === dt || taskOccursOn(t, dt));
  const totalTasks = dayTasks.length;
  const doneTasks = dayTasks.filter(t => (t.completedAt?.slice(0, 10) === dt) || (t.due === dt && t.done) || (t.done && !t.due)).length;

  // 2. Namazlar (Seçili güne ait vakitler)
  const dayPrayers = (S.prayers || {})[dt] || {};
  const mainPrayers = ['Sabah', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'];
  const donePrayers = mainPrayers.filter(p => !!dayPrayers[p]).length;

  // 3. Alışkanlıklar (PC Header ile BİREBİR AYNI KONTROL MANTIĞI)
  const habitArr = (typeof HABITS !== 'undefined' && Array.isArray(HABITS)) ? HABITS : (S.habitDefs || []);
  const totalHabits = habitArr.length;
  const dayHabitData = (S.habits && S.habits[dt]) ? S.habits[dt] : {};
  const doneHabits = totalHabits > 0 ? habitArr.filter(h => !!dayHabitData[h.id]).length : 0;

  msgEl.innerHTML = `
    <div class="mstat-chip">📅 <b>${dateStr}</b></div>
    <div class="mstat-chip ${totalTasks > 0 && doneTasks === totalTasks ? 'complete' : ''}">
      📋 Görev: <b>${doneTasks}/${totalTasks}</b>
    </div>
    <div class="mstat-chip ${donePrayers === 5 ? 'complete' : ''}">
      🕌 Namaz: <b>${donePrayers}/5</b>
    </div>
    ${totalHabits > 0 ? `
    <div class="mstat-chip ${doneHabits === totalHabits ? 'complete' : ''}">
      📊 Alışkanlık: <b>${doneHabits}/${totalHabits}</b>
    </div>` : ''}
  `;
}

/* ─── GÜNLÜK İÇERİK SLİDER (AYET + HADİS + DUA) ─── */
let currentDailySlide = 0;
let dailySlideInterval = null;

function setDailySlide(index) {
  currentDailySlide = (index + 3) % 3;

  const track = document.getElementById('dailySliderTrack');
  if (track) {
    track.style.transform = `translateX(-${currentDailySlide * 100}%)`;
  }

  const tabs = document.querySelectorAll('.daily-tab-btn');
  const dots = document.querySelectorAll('.daily-dot');

  tabs.forEach((tab, i) => {
    tab.classList.toggle('on', i === currentDailySlide);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('on', i === currentDailySlide);
  });
}

function startDailySlideAutoPlay() {
  stopDailySlideAutoPlay();
  dailySlideInterval = setInterval(() => {
    setDailySlide(currentDailySlide + 1);
  }, 5000); // 5 saniyede bir otomatik geçiş
}

function stopDailySlideAutoPlay() {
  if (dailySlideInterval) {
    clearInterval(dailySlideInterval);
    dailySlideInterval = null;
  }
}

/* ─── ZİKİR MENÜSÜ SLİDER (GÜNÜN ESMASI + ZİKİR AYETİ) ─── */
let currentZikirSlide = 0;
let zikirSlideInterval = null;

function setZikirSlide(index) {
  currentZikirSlide = (index + 2) % 2;

  const track = document.getElementById('zikirSliderTrack');
  if (track) {
    track.style.transform = `translateX(-${currentZikirSlide * 50}%)`;
  }

  const tabs = document.querySelectorAll('.zikir-tab-btn');
  const dots = document.querySelectorAll('.zikir-dot');

  tabs.forEach((tab, i) => {
    tab.classList.toggle('on', i === currentZikirSlide);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('on', i === currentZikirSlide);
  });
}

function startZikirSlideAutoPlay() {
  stopZikirSlideAutoPlay();
  zikirSlideInterval = setInterval(() => {
    setZikirSlide(currentZikirSlide + 1);
  }, 5000); // 5 saniyede bir otomatik kayar geçiş
}

function stopZikirSlideAutoPlay() {
  if (zikirSlideInterval) {
    clearInterval(zikirSlideInterval);
    zikirSlideInterval = null;
  }
}

function initDailySliderTouch() {
  const wrapper = document.getElementById('dailySliderWrapper');
  if (!wrapper) return;

  let startX = 0;
  let dist = 0;

  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dist = 0;
    stopDailySlideAutoPlay();
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    dist = currentX - startX;
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    if (dist < -40) {
      setDailySlide(currentDailySlide + 1);
    } else if (dist > 40) {
      setDailySlide(currentDailySlide - 1);
    }
    startDailySlideAutoPlay();
  });
}

// Slider ve Canlı İstatistik Başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDailySliderTouch();
    startDailySlideAutoPlay();
    updateMobileStats();
    applyCustomMenusUI();
  });
} else {
  setTimeout(() => {
    initDailySliderTouch();
    startDailySlideAutoPlay();
    updateMobileStats();
    applyCustomMenusUI();
    renderBadgesGrid();
  }, 100);
}

/* ═══════════════════════════════════════════
   POMODORO TIMER, WEB AUDIO SYNTH & BADGES ENGINE
   ═══════════════════════════════════════════ */
let pomoInterval = null;
let pomoSecondsLeft = 25 * 60;
let pomoTotalSeconds = 25 * 60;
let pomoIsRunning = false;
let pomoMode = 'work';

/* setPomodoroMode: Ana Görev Odak Zamanlayıcısı modülü satır ~1897'de tanımlı.
   Bu ayrı Pomodoro modülü için setPomodoroModePomo adı kullanılıyor. */
function setPomodoroModePomo(mode, mins, btnEl) {
  if (pomoIsRunning) togglePomodoroTimer();
  pomoMode = mode;
  pomoTotalSeconds = mins * 60;
  pomoSecondsLeft = pomoTotalSeconds;
  
  if (btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.fchip').forEach(b => b.classList.remove('on'));
    btnEl.classList.add('on');
  }

  const lbl = document.getElementById('pomoStatusLabel');
  if (lbl) {
    if (mode === 'work') lbl.textContent = '💻 Çalışma Zamanı';
    else if (mode === 'shortBreak') lbl.textContent = '☕ Kısa Mola';
    else lbl.textContent = '🌴 Uzun Mola';
  }
  updatePomodoroUI();
}

function togglePomodoroTimer() {
  const btn = document.getElementById('pomoStartBtn');
  if (pomoIsRunning) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoIsRunning = false;
    if (btn) btn.textContent = '▶️ Başlat';
  } else {
    pomoIsRunning = true;
    if (btn) btn.textContent = '⏸️ Duraklat';
    pomoInterval = setInterval(() => {
      if (pomoSecondsLeft > 0) {
        pomoSecondsLeft--;
        updatePomodoroUI();
      } else {
        clearInterval(pomoInterval);
        pomoInterval = null;
        pomoIsRunning = false;
        if (btn) btn.textContent = '▶️ Başlat';
        playPomodoroBeep();
        toast('🎉 Pomodoro süresi doldu!', 's');
      }
    }, 1000);
  }
}

function resetPomodoroTimer() {
  if (pomoIsRunning) togglePomodoroTimer();
  pomoSecondsLeft = pomoTotalSeconds;
  updatePomodoroUI();
}

function updatePomodoroUI() {
  const m = Math.floor(pomoSecondsLeft / 60);
  const s = pomoSecondsLeft % 60;
  const str = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  
  const display = document.getElementById('pomoTimerDisplay');
  if (display) display.textContent = str;

  const ring = document.getElementById('pomoRing');
  if (ring) {
    const totalDash = 471.23;
    const progress = pomoSecondsLeft / pomoTotalSeconds;
    const offset = totalDash * (1 - progress);
    ring.style.strokeDashoffset = offset;
  }
}

function playPomodoroBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e){}
}

/* WEB AUDIO ACOUSTIC NATURE SOUND ENGINE (REALISTIC SOUNDSCAPES) */
let pomoAudioCtx = null;
let pomoActiveSynthSound = null;
let pomoSynthGainNode = null;
let ambientVol = 0.4;
let soundIntervals = [];

function setAmbientVolume(val) {
  ambientVol = val / 100;
  const label = document.getElementById('volLabel');
  if (label) label.textContent = val + '%';
  if (pomoSynthGainNode && pomoAudioCtx) {
    pomoSynthGainNode.gain.setValueAtTime(ambientVol * 0.35, pomoAudioCtx.currentTime);
  }
}

function clearSoundIntervals() {
  soundIntervals.forEach(id => clearInterval(id));
  soundIntervals = [];
}

function triggerRaindrop() {
  if (!pomoAudioCtx || pomoActiveSynthSound !== 'rain') return;
  try {
    const osc = pomoAudioCtx.createOscillator();
    const gain = pomoAudioCtx.createGain();
    const freq = 600 + Math.random() * 900;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, pomoAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180 + Math.random() * 100, pomoAudioCtx.currentTime + 0.025);
    
    const dropVol = (0.02 + Math.random() * 0.05) * (ambientVol * 1.5);
    gain.gain.setValueAtTime(dropVol, pomoAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, pomoAudioCtx.currentTime + 0.025);
    
    osc.connect(gain);
    gain.connect(pomoSynthGainNode);
    osc.start();
    osc.stop(pomoAudioCtx.currentTime + 0.026);
  } catch(e){}
}

function triggerBirdChirp() {
  if (!pomoAudioCtx || pomoActiveSynthSound !== 'wind') return;
  try {
    const baseFreq = 2400 + Math.random() * 1400;
    const chirpCount = 2 + Math.floor(Math.random() * 3);
    let now = pomoAudioCtx.currentTime;

    for (let i = 0; i < chirpCount; i++) {
      const osc = pomoAudioCtx.createOscillator();
      const gain = pomoAudioCtx.createGain();
      osc.type = 'sine';

      const startF = baseFreq + (i % 2 === 0 ? 300 : -200);
      const endF = startF + 400 + Math.random() * 300;
      
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.linearRampToValueAtTime(endF, now + 0.04);
      osc.frequency.linearRampToValueAtTime(startF - 150, now + 0.08);

      const chirpVol = (0.03 + Math.random() * 0.05) * (ambientVol * 1.8);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(chirpVol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(pomoSynthGainNode);
      osc.start(now);
      osc.stop(now + 0.085);

      now += 0.07 + Math.random() * 0.05;
    }
  } catch(e){}
}

function triggerNeyMelodyNote() {
  if (!pomoAudioCtx || pomoActiveSynthSound !== 'ney') return;
  try {
    const neyNotes = [293.66, 329.63, 349.23, 392.00, 440.00, 523.25];
    const targetFreq = neyNotes[Math.floor(Math.random() * neyNotes.length)];

    const osc = pomoAudioCtx.createOscillator();
    const gain = pomoAudioCtx.createGain();
    const filter = pomoAudioCtx.createBiquadFilter();

    osc.type = 'sine';
    const now = pomoAudioCtx.currentTime;
    const duration = 2.2 + Math.random() * 1.5;

    osc.frequency.setValueAtTime(targetFreq, now);

    const vibOsc = pomoAudioCtx.createOscillator();
    const vibGain = pomoAudioCtx.createGain();
    vibOsc.frequency.setValueAtTime(5.2, now);
    vibGain.gain.setValueAtTime(2.8, now);
    vibOsc.connect(vibGain);
    vibGain.connect(osc.frequency);
    vibOsc.start(now);
    vibOsc.stop(now + duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(targetFreq, now);
    filter.Q.setValueAtTime(2.5, now);

    const noteVol = (0.05 + Math.random() * 0.04) * (ambientVol * 1.6);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(noteVol, now + 0.35);
    gain.gain.setValueAtTime(noteVol, now + duration - 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(pomoSynthGainNode);

    osc.start(now);
    osc.stop(now + duration);
  } catch(e){}
}

function toggleAmbientSound(type) {
  const rainBtn = document.getElementById('btnRainSound');
  const neyBtn = document.getElementById('btnNeySound');
  const windBtn = document.getElementById('btnWindSound');
  const activeEqHTML = '⏹️ <span class="eq-container"><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span></span>';

  if (pomoActiveSynthSound === type) {
    stopAmbientSound();
    if (rainBtn) rainBtn.innerHTML = '▶️ Oynat';
    if (neyBtn) neyBtn.innerHTML = '▶️ Oynat';
    if (windBtn) windBtn.innerHTML = '▶️ Oynat';
    return;
  }

  stopAmbientSound();

  if (rainBtn) rainBtn.innerHTML = '▶️ Oynat';
  if (neyBtn) neyBtn.innerHTML = '▶️ Oynat';
  if (windBtn) windBtn.innerHTML = '▶️ Oynat';

  if (!pomoAudioCtx) pomoAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

  pomoSynthGainNode = pomoAudioCtx.createGain();
  pomoSynthGainNode.gain.setValueAtTime(ambientVol * 0.35, pomoAudioCtx.currentTime);
  pomoSynthGainNode.connect(pomoAudioCtx.destination);

  if (type === 'rain') {
    const bufferSize = pomoAudioCtx.sampleRate * 2;
    const buffer = pomoAudioCtx.createBuffer(1, bufferSize, pomoAudioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.05;
      b6 = white * 0.115926;
    }

    const noise = pomoAudioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = pomoAudioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, pomoAudioCtx.currentTime);

    noise.connect(filter);
    filter.connect(pomoSynthGainNode);
    noise.start();

    pomoActiveSynthSound = 'rain';
    if (rainBtn) rainBtn.innerHTML = activeEqHTML;

    // Raindrop impulses generator (every 40ms - 100ms)
    soundIntervals.push(setInterval(() => {
      triggerRaindrop();
      if (Math.random() > 0.4) triggerRaindrop();
    }, 60));

  } else if (type === 'ney') {
    // Air Breath Noise
    const bufferSize = pomoAudioCtx.sampleRate * 2;
    const buffer = pomoAudioCtx.createBuffer(1, bufferSize, pomoAudioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }
    const noise = pomoAudioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const breathFilter = pomoAudioCtx.createBiquadFilter();
    breathFilter.type = 'bandpass';
    breathFilter.frequency.setValueAtTime(1100, pomoAudioCtx.currentTime);
    breathFilter.Q.setValueAtTime(6.0, pomoAudioCtx.currentTime);

    noise.connect(breathFilter);
    breathFilter.connect(pomoSynthGainNode);
    noise.start();

    pomoActiveSynthSound = 'ney';
    if (neyBtn) neyBtn.innerHTML = activeEqHTML;

    // Live Ney Melody Note Generator
    triggerNeyMelodyNote();
    soundIntervals.push(setInterval(() => {
      triggerNeyMelodyNote();
    }, 2800));

  } else if (type === 'wind') {
    const osc = pomoAudioCtx.createOscillator();
    const filter = pomoAudioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, pomoAudioCtx.currentTime);

    const lfoOsc = pomoAudioCtx.createOscillator();
    const lfoGain = pomoAudioCtx.createGain();
    lfoOsc.frequency.setValueAtTime(0.12, pomoAudioCtx.currentTime);
    lfoGain.gain.setValueAtTime(50, pomoAudioCtx.currentTime);
    lfoOsc.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfoOsc.start();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(130, pomoAudioCtx.currentTime);

    osc.connect(filter);
    filter.connect(pomoSynthGainNode);
    osc.start();

    pomoActiveSynthSound = 'wind';
    if (windBtn) windBtn.innerHTML = activeEqHTML;

    // Forest Bird Chirps Generator (every 1.8s - 3.2s)
    soundIntervals.push(setInterval(() => {
      triggerBirdChirp();
    }, 2400));
  }
}

function stopAmbientSound() {
  clearSoundIntervals();
  if (pomoAudioCtx) {
    try {
      pomoAudioCtx.close();
    } catch(e){}
    pomoAudioCtx = null;
  }
  pomoSynthGainNode = null;
  pomoActiveSynthSound = null;
}

/* OYUNLAŞTIRMA BADGES GRID RENDER */
function getCalculatedBadges() {
  const sabahPrayerCount = Object.keys(S.prayers || {}).filter(day => S.prayers[day]?.sabah).length;
  const totalZikirCount = Object.values(S.zikirCardCounts || {}).reduce((a, b) => a + (Number(b) || 0), 0)
    + Object.values(S.zikirDone || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const completedTaskCount = (S.tasks || []).filter(t => t.done).length;
  const totalPagesRead = (S.books || []).reduce((acc, b) => acc + (Number(b.readPages || b.pages || 0) || 0), 0);
  const streakCount = Number(S.streakDays || 0);

  return [
    { id: 'early_bird', title: '🥉 Erkenci Kuş', desc: '7 Gün Sabah Görevi veya Namaz Takibi', icon: '🌅', target: 7, current: sabahPrayerCount, unlocked: sabahPrayerCount >= 7 },
    { id: 'zikir_master', title: '🥈 Zikir Ehli', desc: '1.000 Zikir ve Tesbihat Tamamlandı', icon: '📿', target: 1000, current: totalZikirCount, unlocked: totalZikirCount >= 1000 },
    { id: 'task_hero', title: '🥇 Görev Üstadı', desc: '50 Görev Başarıyla Tamamlandı', icon: '📋', target: 50, current: completedTaskCount, unlocked: completedTaskCount >= 50 },
    { id: 'book_reader', title: '📚 Bilge Okur', desc: '100 Sayfa Kitap Okuma Takibi', icon: '📖', target: 100, current: totalPagesRead, unlocked: totalPagesRead >= 100 },
    { id: 'streak_champ', title: '👑 Mikat Şampiyonu', desc: '30 Günlük Kesintisiz Seri Başarısı', icon: '🔥', target: 30, current: streakCount, unlocked: streakCount >= 30 }
  ];
}

function renderBadgesGrid() {
  const container = document.getElementById('badgesGrid');
  if (!container) return;

  const badges = getCalculatedBadges();

  container.innerHTML = badges.map(b => {
    const pct = b.target > 0 ? Math.min(100, Math.round((b.current / b.target) * 100)) : 0;
    return `
      <div class="dcard" style="padding:14px; display:flex; flex-direction:column; justify-content:space-between; ${b.unlocked ? 'border:1px solid var(--gold); background:rgba(255,193,7,0.06);' : 'opacity:0.65;'}">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
          <div style="font-size:1.8rem; background:var(--sf2); width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center;">${b.unlocked ? b.icon : '🔒'}</div>
          <div>
            <div style="font-size:0.88rem; font-weight:800; color:${b.unlocked ? 'var(--gold)' : 'var(--tx)'}">${b.title}</div>
            <div style="font-size:0.68rem; color:var(--tx3);">${b.unlocked ? '✅ Kilit Açıldı' : '🔒 Kilitli Rozet'}</div>
          </div>
        </div>
        <div style="font-size:0.72rem; color:var(--tx2); margin-bottom:8px;">${b.desc}</div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:var(--tx3); margin-bottom:3px;">
            <span>İlerleme: ${b.current}/${b.target}</span>
            <span>%${pct}</span>
          </div>
          <div style="height:4px; background:var(--bd); border-radius:2px; overflow:hidden;">
            <div style="width:${pct}%; height:100%; background:${b.unlocked ? 'var(--gold)' : 'var(--tx2)'}; border-radius:2px;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
