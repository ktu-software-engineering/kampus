// Auth yardımcı fonksiyonları
// - .edu.tr e-posta doğrulama
// - Mevcut kullanıcıyı getirme
// - Rol kontrolü

export function isEduEmail(email: string): boolean {
  return email.endsWith(".edu.tr");
}
