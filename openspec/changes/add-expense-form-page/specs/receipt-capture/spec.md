## ADDED Requirements

### Requirement: Upload de fichier image
Le système SHALL permettre à l'utilisateur d'uploader un fichier image comme justificatif. Les formats acceptés SHALL être JPEG, PNG et WebP. La sélection SHALL être possible par clic sur une zone dédiée ou par drag & drop.

#### Scenario: Upload par sélection de fichier
- **WHEN** l'utilisateur clique sur la zone d'upload et sélectionne un fichier image valide
- **THEN** le système affiche une prévisualisation de l'image dans la zone d'upload

#### Scenario: Upload par drag & drop
- **WHEN** l'utilisateur glisse et dépose un fichier image valide sur la zone d'upload
- **THEN** le système affiche une prévisualisation de l'image dans la zone d'upload

#### Scenario: Fichier de type invalide
- **WHEN** l'utilisateur sélectionne un fichier qui n'est pas JPEG, PNG ou WebP
- **THEN** le système affiche un message d'erreur indiquant les formats acceptés et ne prévisualise pas le fichier

### Requirement: Capture photo via caméra
Le système SHALL proposer un bouton pour ouvrir la caméra du device via `getUserMedia`. L'utilisateur SHALL pouvoir prendre une photo qui sera utilisée comme justificatif.

#### Scenario: Ouverture de la caméra
- **WHEN** l'utilisateur clique sur le bouton "Prendre une photo"
- **THEN** le système demande l'accès à la caméra et affiche le flux vidéo en direct

#### Scenario: Capture d'une photo
- **WHEN** l'utilisateur clique sur le bouton de capture pendant que la caméra est active
- **THEN** le système prend un snapshot, ferme la caméra et affiche la photo capturée en prévisualisation

#### Scenario: Permission caméra refusée
- **WHEN** l'utilisateur refuse l'accès à la caméra
- **THEN** le système affiche un message invitant à utiliser l'upload de fichier comme alternative

### Requirement: Prévisualisation du justificatif
Le système SHALL afficher une prévisualisation de l'image sélectionnée (upload ou photo) avant la soumission du formulaire.

#### Scenario: Prévisualisation après upload
- **WHEN** une image est uploadée ou capturée
- **THEN** le système affiche un aperçu de l'image avec un bouton pour la supprimer/remplacer

#### Scenario: Suppression du justificatif
- **WHEN** l'utilisateur clique sur le bouton de suppression de l'image
- **THEN** le système retire la prévisualisation et réaffiche la zone d'upload initiale

### Requirement: Justificatif optionnel
Le justificatif (image) SHALL être optionnel. L'utilisateur SHALL pouvoir soumettre une dépense sans justificatif.

#### Scenario: Soumission sans justificatif
- **WHEN** l'utilisateur soumet le formulaire sans avoir ajouté de justificatif
- **THEN** le système crée la dépense avec `screenshotUrl` à null
