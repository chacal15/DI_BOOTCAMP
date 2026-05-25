"""
Module : jeu.py
Contient la classe Jeu qui orchestre les manches et le score global.
"""

from choix import DEFAITE, obtenir_explication


class Jeu:
    """
    Orchestre une session complète de Pierre-Feuille-Ciseaux.

    Attributs
    ---------
    joueur1, joueur2 : instances de Joueur (humain ou ordinateur)
    manches_a_gagner : nombre de victoires nécessaires pour gagner la session
    nuls             : compteur de manches nulles
    """

    def __init__(self, joueur1, joueur2, manches_a_gagner: int = 3):
        self.joueur1 = joueur1
        self.joueur2 = joueur2
        self.manches_a_gagner = manches_a_gagner
        self.nuls = 0


    def resoudre_manche(self, choix1: str, choix2: str):
        """
        Compare les deux choix et retourne le joueur gagnant
        ou None en cas d'égalité.
        """
        if choix1 == choix2:
            return None                          

        
        if DEFAITE[choix1] == choix2:
            return self.joueur2
        return self.joueur1


    def afficher_resultat_manche(self, choix1: str, choix2: str, gagnant):
        """Affiche le résultat et l'explication d'une manche."""
        print(f"\n  {self.joueur1.nom} → {choix1}")
        print(f"  {self.joueur2.nom} → {choix2}")

        if gagnant is None:
            print("    Égalité !")
        else:
            perdant_choix = choix1 if gagnant == self.joueur2 else choix2
            gagnant_choix = choix2 if gagnant == self.joueur2 else choix1
            explication = obtenir_explication(gagnant_choix, perdant_choix)
            print(f"   {gagnant.nom} remporte la manche ! {explication}")


    def afficher_scores(self):
        """Affiche le score actuel des deux joueurs."""
        print(
            f"\n  Scores → "
            f"{self.joueur1.nom} : {self.joueur1.score}  |  "
            f"{self.joueur2.nom} : {self.joueur2.score}  |  "
            f"Nuls : {self.nuls}"
        )


    def jouer_session(self):
        """
        Lance des manches successives jusqu'à ce qu'un joueur atteigne
        manches_a_gagner victoires. Retourne le joueur gagnant.
        """
        print(f"\n  Première équipe à {self.manches_a_gagner} victoires gagne la session !\n")

        while (self.joueur1.score < self.manches_a_gagner
               and self.joueur2.score < self.manches_a_gagner):

            manche = self.joueur1.score + self.joueur2.score + self.nuls + 1
            print(f"  ── Manche {manche} " + "─" * 20)

            choix1 = self.joueur1.choisir()
            choix2 = self.joueur2.choisir()

            gagnant = self.resoudre_manche(choix1, choix2)
            self.afficher_resultat_manche(choix1, choix2, gagnant)

            if gagnant is None:
                self.nuls += 1
            else:
                gagnant.ajouter_point()

            self.afficher_scores()

        if self.joueur1.score > self.joueur2.score:
            return self.joueur1
        return self.joueur2
