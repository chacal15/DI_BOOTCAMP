

import random


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
    return choix.lower() in CHOIX_VALIDES


def normaliser(choix: str) -> str:
    return choix.lower()


def obtenir_explication(gagnant: str, perdant: str) -> str:
    return EXPLICATIONS.get((gagnant, perdant), "")



class Joueur:
    """Classe de base représentant un joueur générique."""

    def __init__(self, nom: str):
        self.nom = nom
        self.score = 0

    def choisir(self) -> str:
        raise NotImplementedError("La méthode choisir() doit être implémentée.")

    def ajouter_point(self):
        self.score += 1

    def __str__(self):
        return f"{self.nom} (score : {self.score})"


class JoueurHumain(Joueur):
    """Joueur humain : saisit son choix au clavier."""

    def choisir(self) -> str:
        options = ", ".join(CHOIX_VALIDES)
        while True:
            saisie = input(f"  {self.nom}, votre choix ({options}) : ").strip()
            if est_valide(saisie):
                return normaliser(saisie)
            print(f"    Choix invalide. Options : {options}.")


class JoueurOrdinateur(Joueur):
    """Joueur ordinateur : choisit aléatoirement."""

    def choisir(self) -> str:
        choix = random.choice(CHOIX_VALIDES)
        print(f"  {self.nom} choisit : {choix}")
        return choix



class Jeu:
    """Orchestre une session complète de Pierre-Feuille-Ciseaux."""

    def __init__(self, joueur1, joueur2, manches_a_gagner: int = 3):
        self.joueur1 = joueur1
        self.joueur2 = joueur2
        self.manches_a_gagner = manches_a_gagner
        self.nuls = 0

    def resoudre_manche(self, choix1: str, choix2: str):
        """Retourne le joueur gagnant, ou None si égalité."""
        if choix1 == choix2:
            return None
        if DEFAITE[choix1] == choix2:
            return self.joueur2
        return self.joueur1

    def afficher_resultat_manche(self, choix1: str, choix2: str, gagnant):
        print(f"\n  {self.joueur1.nom} → {choix1}")
        print(f"  {self.joueur2.nom} → {choix2}")

        if gagnant is None:
            print("  Égalité !")
        else:
            gagnant_choix  = choix1 if gagnant == self.joueur1 else choix2
            perdant_choix  = choix2 if gagnant == self.joueur1 else choix1
            explication = obtenir_explication(gagnant_choix, perdant_choix)
            print(f"    {gagnant.nom} remporte la manche ! {explication}")

    def afficher_scores(self):
        print(
            f"\n  Scores → "
            f"{self.joueur1.nom} : {self.joueur1.score}  |  "
            f"{self.joueur2.nom} : {self.joueur2.score}  |  "
            f"Nuls : {self.nuls}"
        )

    def jouer_session(self):
        """Lance des manches jusqu'à ce qu'un joueur atteigne manches_a_gagner victoires."""
        print(f"\n  Première équipe à {self.manches_a_gagner} victoires gagne !\n")

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

        return self.joueur1 if self.joueur1.score > self.joueur2.score else self.joueur2



def choisir_mode() -> str:
    print("\n  Modes disponibles :")
    print("    1 → Joueur vs Joueur")
    print("    2 → Joueur vs Ordinateur")
    while True:
        choix = input("  Votre choix (1 ou 2) : ").strip()
        if choix in ("1", "2"):
            return choix
        print("    Veuillez entrer 1 ou 2.")


def choisir_manches() -> int:
    while True:
        try:
            nb = int(input("  Victoires nécessaires pour gagner (ex. 3) : "))
            if nb >= 1:
                return nb
            print("    Entrez un nombre >= 1.")
        except ValueError:
            print("    Veuillez entrer un nombre entier.")


def main():
    print("\n" + "★" * 42)
    print("      PIERRE — FEUILLE — CISEAUX")
    print("★" * 42)

    continuer = True
    while continuer:
        mode    = choisir_mode()
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

        session   = Jeu(j1, j2, manches_a_gagner=manches)
        vainqueur = session.jouer_session()

        print("\n" + "=" * 42)
        print(f"  🎉  {vainqueur.nom} remporte la session !")
        print("=" * 42)

        while True:
            reponse = input("\n  Nouvelle session ? (o/n) : ").strip().lower()
            if reponse in ("o", "n"):
                break
            print("  ⚠  Veuillez répondre par 'o' ou 'n'.")

        continuer = (reponse == "o")

    print("\n  Merci d'avoir joué ! À bientôt 👋\n")


if __name__ == "__main__":
    main()