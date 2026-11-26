# Mise en place du collecteur Nos Sorties

Cette première version utilise des flux RSS Google News pour commencer la collecte automatique sans clé API ni IA. Elle sert de prototype de collecte, pas encore de couverture exhaustive ni de scraping de chaque agenda.

## 1. Créer la table
Exécuter le SQL de `migrations/20261126_automated_events.sql` dans Supabase SQL Editor.

## 2. Déployer la fonction
Avec Supabase CLI, depuis le dépôt:
```sh
supabase functions deploy event-collector
```
Ajouter les secrets de la fonction (ne jamais les mettre dans Git):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Planifier
Configurer Supabase Cron pour appeler l'Edge Function via POST toutes les 6 heures. Protéger l'appel avec un secret de déclenchement dédié avant mise en production.

## 4. Limites du prototype
- RSS Google News ne fournit pas nécessairement les dates précises des événements ni leur ville dans le titre/description.
- Le filtrage actuel par liste de villes est volontairement conservateur et devra être amélioré avec géocodage et sources officielles.
- Ajouter des sources RSS/API propres aux offices de tourisme, organisateurs, salles et rallyes après tests de disponibilité, règles d'utilisation et qualité des données.
- Ne pas présenter ces résultats comme vérifiés : une validation des dates et lieux est nécessaire.
- La fonction n'est pas encore reliée à l'écran de l'application. Cette intégration et la migration Supabase restent à réaliser.
