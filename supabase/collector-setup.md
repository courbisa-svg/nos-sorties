# Mise en place du collecteur Nos Sorties

Cette version prototype collecte des articles RSS et expose une route GET JSON compatible avec le format que l'application consomme actuellement.

## 1. Créer la table
Exécuter le SQL de `supabase/migrations/20261126_automated_events.sql` dans Supabase SQL Editor.

## 2. Déployer la fonction
Depuis le dépôt, avec Supabase CLI:
```sh
supabase functions deploy event-collector --no-verify-jwt
```
Définir les secrets Edge Function (jamais dans Git):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `COLLECTOR_TOKEN` (secret utilisé uniquement pour les appels POST de collecte)

## 3. Utiliser le flux JSON
La fonction expose:
- `GET /functions/v1/event-collector`: retourne un JSON `{events, updatedAt}` destiné à l'application, avec les événements à date future/aujourd'hui et ayant une date connue.
- `POST /functions/v1/event-collector`: déclenche la collecte RSS, avec l'en-tête `x-collector-token` correspondant au secret `COLLECTOR_TOKEN`.

Le déploiement désactive la vérification JWT côté passerelle : le GET est public, et le POST reste protégé par `COLLECTOR_TOKEN` dans le code. Ne jamais exposer la clé service-role dans l'application. L'URL du GET peut être configurée comme `EVENTS_URL` dans la configuration Android, après déploiement et test.

## 4. Planifier la collecte
Configurer une tâche Supabase Cron (ou un service de planification gratuit) pour appeler le POST toutes les 6 heures, en envoyant `x-collector-token`. Le token doit être conservé dans les secrets du scheduler. Ne pas déclencher le POST sans token.

## 5. Contrôle après déploiement\n\nAprès un POST de collecte, vérifier le JSON de retour : `ok`, `processed`, `ignored` et `errors`. En cas d'échec d'une ou plusieurs sources, la fonction renvoie désormais un statut HTTP 502 avec le détail des erreurs, au lieu de signaler un succès HTTP trompeur. Les liens RSS Atom (liens en texte et attribut `href`) sont pris en charge; l'URL sert aussi de clé stable d'événement.\n\n## 6. Limites
- Sept requêtes RSS Google News ciblent désormais les agendas 06, 83, Monaco, rallyes, festivals/concerts, foires/marchés et événements sportifs. Ce sont des requêtes RSS de découverte, pas des sources officielles, et elles peuvent retourner des articles hors sujet.\n- RSS Google News ne fournit pas nécessairement les dates précises des événements ni leur ville dans le titre/description.
- Le filtrage actuel par liste de villes est rudimentaire et peut attribuer une mauvaise zone ou ignorer un événement.
- La collecte n'est pas exhaustive; compléter progressivement avec des sources officielles d'organisateurs, offices de tourisme, salles et rallyes.
- Les événements dont la date est inconnue sont exclus du flux public pour éviter les éléments incomplets. Le collecteur recherche une date explicite dans le titre ou la description (formats français courants) et n'utilise plus la date de publication de l'article comme date de l'événement, ce qui évite une source majeure de faux événements.
- Les résultats ne sont pas vérifiés auprès des organisateurs. Vérifier dates, lieux et liens avant publication.
- La migration SQL, le déploiement de la fonction, la planification automatique et le basculement de `EVENTS_URL` dans l'application restent à effectuer manuellement dans les comptes Supabase/GitHub concernés.
