# Mise en place des certificats HTTPS

## Prérequis

Certbot et son plugin Nginx doivent être installés sur le serveur. Vérifier :

```bash
certbot --version
sudo certbot plugins
```

Les deux enregistrements DNS A doivent pointer vers l’adresse publique du serveur,
actuellement `176.181.65.226` :

- `portfolio.webdesignord.fr`
- `www.portfolio.webdesignord.fr`

Si des enregistrements AAAA existent, ils doivent aussi mener au serveur.
Les ports 80 et 443 doivent être accessibles depuis Internet, avec les éventuelles
redirections de la box et règles du pare-feu. Le plugin Nginx valide le domaine
par un challenge HTTP sur le port 80.

Installer d’abord la [configuration Nginx HTTP](nginx.md) et démarrer
l’application selon [deployment.md](deployment.md).

## Création et installation

Sauvegarder la configuration active puis demander un certificat pour les deux domaines :

```bash
sudo cp /etc/nginx/conf.d/portfolio.conf /etc/nginx/conf.d/portfolio.conf.bak
sudo certbot --nginx --redirect \
  -d portfolio.webdesignord.fr \
  -d www.portfolio.webdesignord.fr
sudo nginx -t
```

Suivre les invites de Certbot pour l’adresse de contact et les conditions du
service. Certbot installe le certificat dans Nginx et active la redirection HTTPS.
La sauvegarde `.bak` n’est pas chargée par l’inclusion habituelle `*.conf`.

Vérifier les deux domaines :

```bash
curl -I https://portfolio.webdesignord.fr
curl -I https://www.portfolio.webdesignord.fr
curl -I http://portfolio.webdesignord.fr
curl -I http://www.portfolio.webdesignord.fr
sudo certbot certificates
```

Les requêtes HTTPS doivent réussir et HTTP doit rediriger vers HTTPS.
Les fichiers attendus pour ce certificat sont :

- `/etc/letsencrypt/live/portfolio.webdesignord.fr/fullchain.pem`
- `/etc/letsencrypt/live/portfolio.webdesignord.fr/privkey.pem`

Vérifier le nom réel avec `certbot certificates` si une lignée de certificat
existait déjà. Reporter la configuration Nginx générée dans le dépôt selon
[nginx.md](nginx.md), sans copier les clés privées.

## Renouvellement automatique

Tester uniquement le certificat du portfolio :

```bash
sudo certbot renew --cert-name portfolio.webdesignord.fr --dry-run
```

Le serveur dispose actuellement du timer Snap `snap.certbot.renew.timer`.
Vérifier sa programmation :

```bash
systemctl list-timers --all | grep certbot
systemctl status snap.certbot.renew.timer
```

Sur une autre installation, le nom du timer peut différer. Ne pas ajouter un
second ordonnanceur si le renouvellement est déjà programmé.

## Diagnostic

`sudo certbot renew --dry-run` teste tous les certificats du serveur. Une erreur
sur `mini.webdesignord.fr` ne signifie donc pas que le portfolio échoue.
Lors du test précédent, ce domaine pointait vers `82.67.7.104` et la connexion
HTTP expirait : vérifier le DNS et l’accès au port 80 pour ce domaine séparément.

Pour les domaines du portfolio, vérifier DNS, pare-feu et redirection des ports,
puis consulter `/var/log/letsencrypt/letsencrypt.log` avec les droits administrateur.

Référence : [guide officiel Certbot](https://eff-certbot.readthedocs.io/en/stable/using.html).
