# Déploiement du portfolio

## Déploiement manuel

Depuis le dossier du projet sur le serveur, construire la branche courante puis
remplacer le conteneur par la nouvelle image :

```bash
cd /opt/apps/portfolio
docker compose build && docker compose up -d --wait
```

Pour livrer une autre branche, se placer sur celle-ci avec `git switch <branche>`
puis relancer la commande. La version livrée remplace celle des deux domaines.

`docker compose restart` seul ne prend pas en compte la nouvelle image.

## CI existante

Le workflow [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) se déclenche
sur les PR ciblant `main`. Il installe les dépendances puis vérifie le format,
ESLint, TypeScript et le build Next.js. Il ne déploie pas sur le serveur.
Il utilise actuellement Node.js 22.22.1, tandis que Docker utilise Node.js 24 :
aligner ces versions avant d’automatiser la livraison.

## Livraison automatique prévue

La CD sera ajoutée lorsque le projet sera suffisamment mature. Le flux cible est :

1. Une PR vers `main` passe les contrôles CI et reçoit les validations requises.
2. La fusion produit un `push` sur `main`, qui déclenche le workflow de livraison.
3. Le workflow vérifie le commit fusionné, construit une image Docker et la publie
   dans un registre, avec un tag immuable basé sur le SHA du commit.
4. Le serveur récupère cette image et remplace le service Compose.
5. Les contrôles de santé et HTTPS valident la livraison. En cas d’échec, la
   livraison signale l’erreur et restaure l’image précédente.

L’approbation d’une PR seule ne doit pas lancer la livraison : le déclencheur cible
est `push` filtré sur `main`. Protéger cette branche pour exiger une PR approuvée
et une CI réussie avant fusion, afin d’éviter les livraisons par push direct.

Avant d’activer ce flux, prévoir un registre, une configuration Compose utilisant
l’image publiée, les accès serveur et registre via les secrets GitHub, une
sérialisation des déploiements et la conservation de l’image précédente. Nginx et
Certbot restent provisionnés sur l’hôte. Ce workflow de CD est une cible de
conception ; il n’est pas encore implémenté.

Référence : [événements GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).
