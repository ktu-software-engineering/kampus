// Playwright E2E testleri buraya yazılacak
// Kritik 5 senaryo:
// 1. Kayıt akışı (.edu.tr doğrulama)
// 2. Yorum yazma ve gönderme
// 3. Arama ve filtreleme sonuçları
// 4. Şikayet akışı
// 5. Admin paneli içerik yönetimi

import { test, expect } from "@playwright/test";

test("ana sayfa açılıyor", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/KampusKarne/);
});
