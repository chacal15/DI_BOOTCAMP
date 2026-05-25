"""
Module : choix.py
Définit les choix possibles et les règles de victoire du jeu
Pierre-Feuille-Ciseaux.
"""

CHOIX_VALIDES = ["pierre", "feuille", "ciseaux"]

DEFAITE = {
    "pierre":  "feuille",   
    "feuille": "ciseaux",   
    "ciseaux": "pierre",    
}

EXPLICATIONS = {
    ("pierre",  "ciseaux"): "La pierre écrase les ciseaux.",
    ("feuille", "pierre"):  "La feuille enveloppe la pierre.",
    ("ciseaux", "feuille"): "Les ciseaux coupent la feuille.",
}


def est_valide(choix: str) -> bool:
    """Retourne True si le choix fait partie des options valides."""
    return choix.lower() in CHOIX_VALIDES


def normaliser(choix: str) -> str:
    """Retourne le choix en minuscules."""
    return choix.lower()


def obtenir_explication(gagnant: str, perdant: str) -> str:
    """Retourne la phrase expliquant pourquoi gagnant bat perdant."""
    return EXPLICATIONS.get((gagnant, perdant), "")
