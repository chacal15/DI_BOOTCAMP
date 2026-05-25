
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from joueur import JoueurHumain, JoueurOrdinateur
from jeu import Jeu



def choisir_mode() -> str:
    """Demande le mode de jeu : humain vs humain ou humain vs ordinateur."""
    print("\n  Modes disponibles :")
    print("    1 → Joueur vs Joueur")
    print("    2 → Joueur vs Ordinateur")

    while True:
        choix = input("  Votre choix (1 ou 2) : ").strip()
        if choix in ("1", "2"):
            return choix
        print("    Veuillez entrer 1 ou 2.")


def choisir_manches() -> int:
    """Demande le nombre de victoires nécessaires pour gagner la session."""
    while True:
        try:
            nb = int(input("  Victoires nécessaires pour gagner (ex. 3) : "))
            if nb >= 1:
                return nb
            print("    Entrez un nombre supérieur ou égal à 1.")
        except ValueError:
            print("    Veuillez entrer un nombre entier.")



def main():
    print("\n" + "★" * 42)
    print("      PIERRE — FEUILLE — CISEAUX")
    print("★" * 42)

    continuer = True
    while continuer:

        
        mode = choisir_mode()
        manches = choisir_manches()

        if mode == "1":
            nom1 = input("\n  Nom du Joueur 1 [Alice] : ").strip() or "Alice"
            nom2 = input("  Nom du Joueur 2 [Bob]   : ").strip() or "Bob"
            j1 = JoueurHumain(nom1)
            j2 = JoueurHumain(nom2)
        else:
            nom1 = input("\n  Votre nom [Joueur] : ").strip() or "Joueur"
            j1 = JoueurHumain(nom1)
            j2 = JoueurOrdinateur("Ordinateur")

        session = Jeu(j1, j2, manches_a_gagner=manches)
        vainqueur = session.jouer_session()

        print("\n" + "=" * 42)
        print(f"    {vainqueur.nom} remporte la session !")
        print("=" * 42)

        # Rejouer ?
        while True:
            reponse = input("\n  Nouvelle session ? (o/n) : ").strip().lower()
            if reponse in ("o", "n"):
                break
            print("    Veuillez répondre par 'o' ou 'n'.")

        continuer = (reponse == "o")

    print("\n  Merci d'avoir joué ! À bientôt \n")


if __name__ == "__main__":
    main()
