# Pack Business

Projet Symfony 8.0 — skeleton minimal.

## Prerequis

- PHP >= 8.4
- Composer 2
- Laragon (recommande) ou tout serveur local

## Installation

```bash
git clone https://github.com/VOTRE-USER/pack-business.git
cd pack-business
composer install
```

## Demarrage (Laragon)

Avec Laragon, le projet est automatiquement accessible via `http://pack-business.test` si le dossier est dans `C:\laragon\www\`.

Sinon, avec le serveur PHP integre :

```bash
composer start
# ou
php -S localhost:8000 -t public/
```

## Commandes qualite

```bash
composer lint      # Verifier le formatage (dry-run)
composer fix       # Corriger le formatage automatiquement
composer analyse   # Analyse statique PHPStan
composer quality   # Tout lancer d'un coup
```

Avec Make (Linux/Mac ou Git Bash) :

```bash
make lint
make fix
make analyse
make quality
```

## CI/CD

Un pipeline GitHub Actions (`.github/workflows/quality.yml`) tourne automatiquement sur chaque push et pull request pour verifier :

- Le formatage du code (PHP CS Fixer)
- L'analyse statique (PHPStan)
- Les tests (PHPUnit, quand disponible)
