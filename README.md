# Application Météo
Application qui affiche la météo actuelle et les prévisions sur 7 jours pour n'importe quelle ville du monde. Projet personnel réalisé en HTML, CSS et JavaScript, sans framework.
Voir le site : [https://samicds87.github.io/weather-app/](https://samicds87.github.io/weather-app/)
## Fonctionnalités
- Recherche de la météo d'une ville dans le monde entier
- Suggestions de villes en temps réel pendant la saisie, avec la région et le pays pour distinguer les homonymes
- Météo actuelle : température, ressenti, vitesse du vent, humidité et conditions
- Prévisions sur 7 jours avec températures minimales et maximales
- Thème visuel qui change selon la météo (clair par temps dégagé, gris quand le temps est maussade)
- Icônes adaptées aux conditions météo
- Bouton pour effacer la recherche et revenir à l'accueil
- Gestion des erreurs : ville introuvable, problème de connexion
- Interface responsive, utilisable sur mobile comme sur ordinateur
## Technologies
- HTML, CSS et JavaScript (vanilla, aucune dépendance)
- Open-Meteo : API de géocodage et de prévisions météo, gratuite et sans clé
## Points techniques
- Appels API enchaînés (géocodage, puis météo et prévisions) avec `async/await` et gestion d'erreurs
- Autocomplétion avec debounce, pour éviter une requête à chaque frappe
- Protection contre les réponses de l'API qui arrivent dans le désordre
- Interface pilotée par des classes CSS sur `body` (thème, état « résultat affiché »)
- Mise en page des prévisions avec CSS Grid et `display: contents`
## Lancer le projet en local
Le projet n'a pas de dépendances à installer. Il faut en revanche le servir via un serveur local, car ouvrir `index.html` directement (protocole `file://`) bloque les appels `fetch`.
Avec VS Code, l'extension **Live Server** suffit : clic droit sur `index.html`, puis « Open with Live Server ».
## Crédits
- Données météo : [Open-Meteo.com](https://open-meteo.com/)
- Icônes : [Flaticon](https://www.flaticon.com/)