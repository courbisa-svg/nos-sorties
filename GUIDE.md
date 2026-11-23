# Mettre en place « Nos sorties » (environ 20 minutes, depuis un ordinateur)

## 1. Supabase : vos comptes et vos données partagées
1. Sur supabase.com, crée un projet `nos-sorties` (région West EU (Paris)).
2. Dans le menu de gauche, **SQL Editor** → **New query**. Colle tout le contenu de `supabase/schema.sql`, puis clique sur **Run**.
3. **Authentication** → **Sign In / Providers** → **Email** : désactive **Confirm email**, puis enregistre.
   (Seule l'adresse aymeric.julia.c@gmail.com a accès aux données. Le script s'en charge.)
4. **Project Settings** → **API** : garde sous la main la **Project URL** et la clé **anon public**.

## 2. GitHub : le dépôt qui compile l'APK
1. Sur github.com : **New repository**. Nom : `nos-sorties`, visibilité **Public** (nécessaire pour que l'appli lise la liste des événements). Ne coche rien d'autre, puis **Create repository**.
2. Sur la page du dépôt vide, clique sur **uploading an existing file**.
   Dézippe `nos-sorties.zip` sur ton ordinateur, ouvre le dossier, sélectionne **tout son contenu** (pas le dossier lui-même), glisse-le dans la page, puis clique sur **Commit changes**.
3. Ajoute le fichier de compilation, qui est caché sur la plupart des ordinateurs à cause du point dans son nom :
   **Add file** → **Create new file**, tape le nom `.github/workflows/build-apk.yml`, colle le contenu du fichier `build-apk.yml` (à la racine du zip), puis **Commit changes**.
4. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Ajoute ces deux secrets :
   - `SUPABASE_URL` : la Project URL de Supabase
   - `SUPABASE_ANON_KEY` : la clé anon public de Supabase
5. Onglet **Actions** : si GitHub le demande, active les workflows. Ouvre « Construire l'APK », clique sur **Run workflow**, puis attends environ 5 minutes que la coche verte apparaisse.

## 3. Installer l'appli sur vos deux téléphones
- Lien de téléchargement, qui pointe toujours vers la dernière version :
  `https://github.com/<ton-pseudo-github>/nos-sorties/releases/latest/download/NosSorties.apk`
- Ouvre ce lien sur chaque téléphone Android, télécharge le fichier et ouvre-le. Si Android le demande, autorise « Installer des applis inconnues » pour le navigateur.
- Premier lancement : **Première connexion ? Créer le compte**, avec l'adresse commune et un mot de passe (une seule fois). Sur l'autre téléphone, il suffit ensuite de **Se connecter**.

## Mettre à jour les événements
La liste vient du fichier `data/events.json` du dépôt. Pour la remplacer : ouvre `data` → **Add file** → **Upload files**, dépose le nouveau `events.json`, puis **Commit changes**. Les téléphones affichent la nouvelle liste à la prochaine ouverture, sans réinstaller l'appli.

## Nouvelle version de l'appli
À chaque modification de l'appli, GitHub recompile tout seul. Pour l'instant, chaque version est signée avec une clé différente : pour installer une nouvelle version, désinstalle d'abord l'ancienne. Vos favoris et vos lieux sont stockés en ligne, donc rien n'est perdu ; il faut juste se reconnecter.
