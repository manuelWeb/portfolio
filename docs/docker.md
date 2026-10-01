# Configuration Docker

## Fichiers et construction

La configuration repose sur [`../Dockerfile`](../Dockerfile),
[`../docker-compose.yml`](../docker-compose.yml), [`../.dockerignore`](../.dockerignore)
et le mode `output: "standalone"` de [`../next.config.ts`](../next.config.ts).

Le Dockerfile utilise deux étapes basées sur Node.js 24 et Debian slim :

1. `build` active Corepack, installe les dépendances avec pnpm 10.6.3 et le lockfile
   figé, puis exécute `pnpm build`. Les scripts d’installation sont ignorés : Husky
   n’est pas nécessaire dans l’image.
2. `runtime` ne copie que le serveur standalone, les fichiers `.next/static` et
   `public`. Il démarre avec `node server.js` sous l’utilisateur `node`.

Le contexte exclut les dépendances locales, les builds précédents, Git, les
fichiers `.env*`, les journaux et le dossier `deploy`.

## Service Compose

| Paramètre                 | Rôle                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- |
| `app.build: .`            | Construit l’image depuis le projet courant.                                   |
| `127.0.0.1:3030:3000`     | Expose le port 3000 du conteneur uniquement sur le port local 3030 de l’hôte. |
| `restart: unless-stopped` | Redémarre le service, sauf après un arrêt volontaire.                         |
| `healthcheck`             | Attend une réponse HTTP réussie de `/` sur le port interne 3000.              |
| Journaux `json-file`      | Limite chaque fichier à 50 Mo et conserve au maximum 5 fichiers.              |

Le serveur écoute sur `0.0.0.0` dans le conteneur avec `PORT=3000`, en production.
La télémétrie Next.js est désactivée. Aucun volume applicatif n’est configuré :
le code provient de l’image, donc un changement demande une reconstruction.

Le contrôle de santé s’exécute toutes les 30 secondes, avec un délai maximal de
5 secondes, une période de démarrage de 30 secondes et 3 échecs autorisés.
Un état `unhealthy` ne déclenche pas à lui seul un redémarrage Docker.

Pour lancer une version et consulter les journaux, suivre le
[guide de déploiement](deployment.md). Le proxy de l’hôte est décrit dans
[nginx.md](nginx.md).
