
def creer_plateau():
    """Crée et retourne un plateau vide 3x3 (liste de 9 cases)."""
    return [" " for _ in range(9)]


def afficher_plateau(plateau):
    """Affiche le plateau de jeu avec numérotation des cases libres."""
    print("\n")
    for i in range(3):
        ligne = []
        for j in range(3):
            index = i * 3 + j
            case = plateau[index] if plateau[index] != " " else str(index + 1)
            ligne.append(case)
        print(f"  {ligne[0]} | {ligne[1]} | {ligne[2]}")
        if i < 2:
            print("  ---------")
    print()



COMBINAISONS_GAGNANTES = [
    [0, 1, 2],  
    [3, 4, 5], 
    [6, 7, 8],  
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6],  
]


def verifier_gagnant(plateau, symbole):
    """Retourne True si le symbole donné a une combinaison gagnante."""
    for combinaison in COMBINAISONS_GAGNANTES:
        if all(plateau[i] == symbole for i in combinaison):
            return True
    return False


def plateau_plein(plateau):
    """Retourne True si toutes les cases sont occupées (match nul)."""
    return all(case != " " for case in plateau)


def jouer_coup(plateau, position, symbole):
    """
    Place le symbole sur la case demandée.
    Retourne True si le coup est valide, False sinon.
    """
    if plateau[position] == " ":
        plateau[position] = symbole
        return True
    return False



def demander_coup(plateau, nom_joueur):
    """
    Demande au joueur de choisir une case (1-9) en boucle
    jusqu'à ce que la saisie soit valide et la case libre.
    """
    while True:
        try:
            choix = int(input(f"  {nom_joueur}, choisissez une case (1-9) : "))
            if choix < 1 or choix > 9:
                print("    Veuillez entrer un nombre entre 1 et 9.")
                continue
            position = choix - 1
            if plateau[position] != " ":
                print("    Cette case est déjà occupée. Essayez une autre.")
                continue
            return position
        except ValueError:
            print("    Saisie invalide. Entrez un chiffre entre 1 et 9.")



def jouer_partie(nom_j1="Joueur 1", nom_j2="Joueur 2"):
    """Lance et gère une partie complète de Morpion."""
    plateau = creer_plateau()
    joueurs = [
        {"nom": nom_j1, "symbole": "X"},
        {"nom": nom_j2, "symbole": "O"},
    ]
    tour = 0  

    print("\n" + "=" * 40)
    print("       BIENVENUE AU MORPION !")
    print("=" * 40)
    print(f"  {nom_j1} → X     |     {nom_j2} → O")
    print("  (Les chiffres 1-9 indiquent les cases libres)")

    
    for _ in range(9):
        afficher_plateau(plateau)

        joueur_actif = joueurs[tour]
        position = demander_coup(plateau, joueur_actif["nom"])
        jouer_coup(plateau, position, joueur_actif["symbole"])

        if verifier_gagnant(plateau, joueur_actif["symbole"]):
            afficher_plateau(plateau)
            print(f"  🎉  Bravo {joueur_actif['nom']} ({joueur_actif['symbole']}) ! Vous avez gagné !\n")
            return joueur_actif["nom"]

        if plateau_plein(plateau):
            afficher_plateau(plateau)
            print("    Match nul ! Aucun gagnant cette fois.\n")
            return None

        tour = 1 - tour

    return None


def main():
    """Point d'entrée : gère les parties successives et les scores."""
    print("\n" + "★" * 40)
    print("          JEU DE MORPION")
    print("★" * 40)

    nom1 = input("\n  Nom du Joueur 1 (X) [défaut: Alice] : ").strip() or "Alice"
    nom2 = input("  Nom du Joueur 2 (O) [défaut: Bob]   : ").strip() or "Bob"

    scores = {nom1: 0, nom2: 0, "Nuls": 0}

    continuer = True
    while continuer:
        gagnant = jouer_partie(nom1, nom2)

        if gagnant:
            scores[gagnant] += 1
        else:
            scores["Nuls"] += 1

        print("  Scores :")
        print(f"      {nom1} : {scores[nom1]}  |  {nom2} : {scores[nom2]}  |  Nuls : {scores['Nuls']}")

        while True:
            reponse = input("\n  Rejouer ? (o/n) : ").strip().lower()
            if reponse in ("o", "n"):
                break
            print("  ⚠  Veuillez répondre par 'o' (oui) ou 'n' (non).")

        continuer = (reponse == "o")

    print("\n  Merci d'avoir joué ! À bientôt \n")


if __name__ == "__main__":
    main()
