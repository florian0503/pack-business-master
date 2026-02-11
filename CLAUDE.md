# CLAUDE.md — Guide pour Claude Code

## Projet

Pack Business — application Symfony 8.0 (skeleton minimal).

## Structure

```
src/            → Code source PHP (namespace App\)
config/         → Configuration Symfony (YAML)
public/         → Point d'entree web (index.php)
tests/          → Tests PHPUnit (namespace App\Tests\)
var/            → Cache et logs (gitignore)
vendor/         → Dependances (gitignore)
```

## Commandes

```bash
composer install    # Installer les dependances
composer start      # Demarrer le serveur local (port 8000)
composer lint       # Verifier le formatage
composer fix        # Corriger le formatage
composer analyse    # Analyse statique PHPStan
composer quality    # lint + analyse
```

## Conventions

- Style de code : @Symfony (PHP CS Fixer)
- Analyse statique : PHPStan level 6
- PSR-4 autoloading : App\ → src/
- Tests : App\Tests\ → tests/

## Regles

- Toujours respecter le style @Symfony (lancer `composer fix` apres modification)
- Le code doit passer PHPStan level 6 sans erreur
- Ne pas commiter les fichiers .env.local ou des secrets
- Preferer les types stricts et les return types sur toutes les methodes
