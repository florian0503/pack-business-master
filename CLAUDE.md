# CLAUDE.md — Guide pour Claude Code

## Projet

Pack Business — application Symfony 8.0.

## Stack

- Symfony 8.0 (PHP >= 8.4)
- Twig (templates)
- CSS puis Tailwind CSS (a venir)
- PHP CS Fixer (@Symfony) + PHPStan level 6
- GitHub Actions CI/CD

## Structure

```
src/            → Code source PHP (namespace App\)
config/         → Configuration Symfony (YAML)
templates/      → Templates Twig
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

## Git Flow

- **main** → code stable / production
- **develop** → integration, developpement courant
- **feature/*** → branches creees depuis develop, merge dans develop une fois terminees
- Quand develop est stable → merge dans main
- Pipeline CI tourne sur toutes les branches

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
- JAMAIS de trace de Claude dans les commits (pas de Co-Authored-By, pas de mention)
- Push, commit, merge autorises librement
