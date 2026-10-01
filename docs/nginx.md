# Configuration Nginx

## Rôle du proxy

Nginx s’exécute sur le serveur, en dehors de Docker. Il reçoit les requêtes pour
`portfolio.webdesignord.fr` et `www.portfolio.webdesignord.fr` et les transmet au
conteneur via `http://127.0.0.1:3030`.

Le fichier du dépôt est [`../deploy/nginx/portfolio.conf`](../deploy/nginx/portfolio.conf).
Le fichier utilisé par le serveur est `/etc/nginx/conf.d/portfolio.conf`.

`server_name` sélectionne les deux domaines. `proxy_http_version 1.1` définit la
version HTTP vers l’application. Les en-têtes `Host`, `X-Real-IP`,
`X-Forwarded-For` et `X-Forwarded-Proto` transmettent le domaine demandé,
l’adresse du client et le protocole d’origine.

```nginx
server {
    server_name portfolio.webdesignord.fr www.portfolio.webdesignord.fr;

    location / {
        proxy_pass http://127.0.0.1:3030;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    listen [::]:443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/portfolio.webdesignord.fr/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/portfolio.webdesignord.fr/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.portfolio.webdesignord.fr) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = portfolio.webdesignord.fr) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name portfolio.webdesignord.fr www.portfolio.webdesignord.fr;
    return 404; # managed by Certbot
}
```

## Première installation en HTTP

Le modèle versionné écoute sur le port 80 en IPv4 et IPv6. Lors d’une première
installation, avant la création du certificat :

```bash
sudo install -o root -g root -m 644 /opt/apps/portfolio/deploy/nginx/portfolio.conf /etc/nginx/conf.d/portfolio.conf
sudo nginx -t && sudo systemctl reload nginx
```

Le dossier système appartient à `root`. Le compte `manuel` dispose de droits
sudo limités pour cette commande d’installation, `nginx -t` et le rechargement.
Certbot demande des droits administrateur supplémentaires.

## Configuration après activation de HTTPS

Certbot a ajouté sur le serveur un bloc TLS sur le port 443, les chemins du
certificat et une redirection HTTP vers HTTPS. Voir [certbot.md](certbot.md).

Le modèle du dépôt est encore en HTTP : **ne pas le réinstaller sur le serveur
HTTPS en l’état**. Cela remplacerait les blocs ajoutés par Certbot. Après une
modification de la configuration active, reporter sa version HTTPS dans le dépôt :

```bash
cp /etc/nginx/conf.d/portfolio.conf /opt/apps/portfolio/deploy/nginx/portfolio.conf
```

Relire le diff avant de committer. Les chemins des certificats peuvent être
versionnés ; les certificats et clés privées restent dans `/etc/letsencrypt`.
Une configuration HTTPS suppose que ces fichiers existent déjà sur l’hôte.

Pour chaque modification ultérieure, vérifier `sudo nginx -t` avant de recharger
Nginx. Un déploiement du code seul ne nécessite pas de modifier ce proxy.
