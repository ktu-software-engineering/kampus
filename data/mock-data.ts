export const CATEGORIES = [
  { emoji: "🎓", label: "Üniversite Ara", desc: "Türkiye genelinde keşfet" },
  { emoji: "👨‍🏫", label: "Hoca Ara", desc: "Akademisyenleri değerlendir" },
  { emoji: "🗺️", label: "Şehre Göre", desc: "Yakınındaki kampüsleri gör" },
];

export const RECENT_REVIEWS = [
  {
    id: 1,
    professor: "Prof. Dr. Ahmet Yılmaz",
    university: "Boğaziçi Üniversitesi",
    city: "İstanbul",
    rating: 4.9,
    review:
      "Dersleri son derece anlaşılır anlatıyor. Öğrenciye verdiği değer ve ilgi gerçekten takdire şayan.",
    department: "Bilgisayar Mühendisliği",
    time: "2 saat önce",
  },
  {
    id: 2,
    professor: "Doç. Dr. Zeynep Demir",
    university: "ODTÜ",
    city: "Ankara",
    rating: 4.7,
    review:
      "Araştırmaya yönlendirme konusunda çok destekleyici. Sınav soruları düşündürücü ve adil.",
    department: "Elektrik-Elektronik",
    time: "5 saat önce",
  },
  {
    id: 3,
    professor: "Prof. Dr. Mehmet Kaya",
    university: "İTÜ",
    city: "İstanbul",
    rating: 4.5,
    review:
      "Uygulamaya dayalı öğretim anlayışı mükemmel. Sanayi tecrübesini derse yansıtıyor.",
    department: "Endüstri Mühendisliği",
    time: "1 gün önce",
  },
];

export const TRENDING_PROFESSORS = [
  { name: "Prof. Dr. Ahmet Yılmaz", field: "Bilgisayar Müh.", university: "Boğaziçi", rating: 4.9, trend: "+14%" },
  { name: "Doç. Dr. Zeynep Demir", field: "Elektrik-Elektronik", university: "ODTÜ", rating: 4.7, trend: "+9%" },
  { name: "Prof. Dr. Mehmet Kaya", field: "Endüstri Müh.", university: "İTÜ", rating: 4.5, trend: "+7%" },
  { name: "Dr. Ayşe Şahin", field: "İşletme", university: "Hacettepe", rating: 4.3, trend: "+5%" },
];
