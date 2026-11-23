Tur 1 bulguları ve kararlar:
- OYUN-SONU-01 (medium, kabul): Sabit `insets.top + 150` kaldırıldı. HUD View'e onLayout eklenip ölçülen alt kenar (hudBottom) state'e yazılacak; toast top = max(insets.top + 64, hudBottom + 8), ölçüm yoksa yedek insets.top + 150. Kabul ölçütü 3, tüm çiplerin aynı anda göründüğü en kötü durumu (geçici test bayrağıyla) kapsayacak şekilde güncellendi.
