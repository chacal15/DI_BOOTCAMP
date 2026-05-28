from game import Game


def get_user_menu_choice():
    """
    Affiche le menu principal, valide le choix de l'utilisateur et le retourne.
    Les choix valides sont : '1' (jouer), '2' (scores), 'q' ou 'x' (quitter).
    """
    print("=" * 40)
    print("   PIERRE – FEUILLE – CISEAUX")
    print("=" * 40)
    print("  1 – Jouer une nouvelle partie")
    print("  2 – Afficher les scores")
    print("  q – Quitter")
    print("-" * 40)

    choix = input("Votre choix : ").strip().lower()

    if choix in ("1", "2", "q", "x"):
        return choix


    print("   Choix invalide. Veuillez entrer 1, 2 ou q.\n")
    return choix


def print_results(results):
    """
    Affiche le récapitulatif des parties jouées.
    Paramètre :
        results (dict) – format attendu : {'win': int, 'loss': int, 'draw': int}
    """
    total = results["win"] + results["loss"] + results["draw"]
    print("\n" + "=" * 40)
    print("       RÉCAPITULATIF DES PARTIES")
    print("=" * 40)
    print(f"  Parties jouées : {total}")
    print(f"   Victoires   : {results['win']}")
    print(f"   Défaites    : {results['loss']}")
    print(f"  Matchs nuls : {results['draw']}")
    print("=" * 40)
    print("  Merci d'avoir joué ! À bientôt ")
    print("=" * 40 + "\n")


def main():
    """Fonction principale : boucle de menu et gestion des parties."""
    results = {"win": 0, "loss": 0, "draw": 0}

    while True:
        choix = get_user_menu_choice()

        if choix == "1":
            
            game = Game()
            result = game.play()

            if result == "victoire":
                results["win"] += 1
            elif result == "défaite":
                results["loss"] += 1
            else:  
                results["draw"] += 1

        elif choix == "2":
            
            print_results(results)

        elif choix in ("q", "x"):
            
            print_results(results)
            break

       
if __name__ == "__main__":
    main()