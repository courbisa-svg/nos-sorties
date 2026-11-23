# Nos sorties 06 · 83

Appli Android (Capacitor) pour repérer les sorties du week-end dans les Alpes-Maritimes et le Var, les événements automobiles, et garder une liste commune de lieux à faire.

- `www/` : l'appli (HTML/JS), `www/config.js` : réglages Supabase et adresse des événements.
- `data/events.json` : les événements, mis à jour chaque mardi.
- `supabase/schema.sql` : tables partagées (favoris, lieux) et accès réservé au compte commun.
- L'APK est compilée par GitHub Actions à chaque modification de l'appli et publiée dans **Releases** :
  `https://github.com/<compte>/nos-sorties/releases/latest/download/NosSorties.apk`
