
import random
from choix import CHOIX_VALIDES, est_valide, normaliser


class Joueur:
    """
    Classe de base représentant un joueur générique.
    Gère le nom et le score ; la méthode choisir() est à surcharger.
    """

    def __init__(self, nom: str):
        self.nom = nom
        self.score = 0

    def choisir(self) -> str:
        """
        Retourne le choix du joueur parmi CHOIX_VALIDES.
        Méthode abstraite : doit être surchargée dans les sous-classes.
        """
        raise NotImplementedError("La méthode choisir() doit être implémentée.")

    def ajouter_point(self):
        """Incrémente le score du joueur de 1."""
        self.score += 1

    def __str__(self):
        return f"{self.nom} (score : {self.score})"


class JoueurHumain(Joueur):
    """
    Joueur humain : demande son choix au clavier en boucle
    jusqu'à ce que la saisie soit valide.
    """

    def choisir(self) -> str:
        options = ", ".join(CHOIX_VALIDES)
        while True:
            saisie = input(f"  {self.nom}, votre choix ({options}) : ").strip()
            if est_valide(saisie):
                return normaliser(saisie)
            print(f"  ⚠  Choix invalide. Veuillez entrer : {options}.")


class JoueurOrdinateur(Joueur):
    """
    Joueur ordinateur : sélectionne aléatoirement parmi les choix valides.
    """

    def choisir(self) -> str:
        choix = random.choice(CHOIX_VALIDES)
        print(f"  {self.nom} choisit : {choix}")
        return choix
