.PHONY: install start stop lint fix analyse test quality cc

## —— Setup ————————————————————————————————————————
install: ## Installer les dépendances
	composer install

## —— Serveur ——————————————————————————————————————
start: ## Démarrer le serveur PHP intégré
	php -S localhost:8000 -t public/

## —— Qualité de code ——————————————————————————————
lint: ## Vérifier le formatage du code (dry-run)
	vendor/bin/php-cs-fixer fix --dry-run --diff

fix: ## Corriger automatiquement le formatage
	vendor/bin/php-cs-fixer fix

analyse: ## Lancer l'analyse statique PHPStan
	vendor/bin/phpstan analyse

test: ## Lancer les tests PHPUnit
	vendor/bin/phpunit

quality: lint analyse test ## Lancer tous les checks qualité

## —— Cache ————————————————————————————————————————
cc: ## Vider le cache Symfony
	php bin/console cache:clear

## —— Aide —————————————————————————————————————————
help: ## Afficher cette aide
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
