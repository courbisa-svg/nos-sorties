# Nos sorties 06 · 83

Appli Android (Capacitor) pour repérer les sorties du week-end dans les Alpes-Maritimes et le Var, les événements automobiles, et garder une liste commune de lieux à faire.

- `www/` : l'appli (HTML/JS), `www/config.js` : réglages Supabase et adresse des événements.
- `data/events.json` : les événements, mis à jour chaque mardi.
- `supabase/schema.sql` : tables partagées (favoris, lieux) et accès réservé au compte commun.
- L'APK est compilée par GitHub Actions à chaque modification de l'appli et publiée dans **Releases** :
  `https://github.com/<compte>/nos-sorties/releases/latest/download/NosSorties.apk`


## Génération de l'APK de test

La branche `feature/automated-event-collector` produit un APK de test (artifact GitHub Actions) lors d'un déclenchement du workflow de compilation. Pour compiler, configurer dans les secrets du dépôt GitHub : `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `KEYSTORE_PASSWORD` (8 caractères minimum). `EVENTS_URL` est facultatif : s'il est renseigné, il remplace le JSON de démonstration par le flux événementiel configuré (par exemple l'URL GET de la fonction Supabase `event-collector` après déploiement). Ne jamais mettre de clé service-role dans les secrets destinés à l'application ou dans le code client.
