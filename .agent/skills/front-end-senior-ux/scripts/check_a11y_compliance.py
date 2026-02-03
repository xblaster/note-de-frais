# [Black Box Logic]
import os
import re

def check_accessibility(file_path):
    issues = []
    with open(file_path, 'r') as f:
        content = f.read()
        # Vérification des images sans alt
        if re.search(r'<img(?!.*?alt=).*?>', content):
            issues.append("Erreur : Balise <img> détectée sans attribut 'alt'.")
        # Vérification des boutons sans contenu ou aria-label
        if re.search(r'<Button(?!.*?aria-label=).*?>\s*<[A-Z].*?/>\s*</Button>', content):
            issues.append("Avertissement : Bouton iconographique détecté sans 'aria-label'.")
        # Vérification de l'utilisation de Shadcn Tooltip sur les éléments complexes
        if "Tooltip" not in content and "hover:" in content:
            issues.append("Conseil : Pensez à ajouter un Tooltip pour les actions au survol.")
    return issues

# Exécution simulée