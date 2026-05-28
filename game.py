import random


class Game:
    ITEMS = ["pierre", "feuille", "ciseaux"]

    WINS_AGAINST = {
        "pierre": "ciseaux",
        "ciseaux": "feuille",
        "feuille": "pierre",
    }

    def get_user_item(self):
        """Demande à l'utilisateur de choisir pierre/feuille/ciseaux."""
        while True:
            choix = input("Votre choix (pierre / feuille / ciseaux) : ").strip().lower()
            if choix in self.ITEMS:
                return choix
            print(f"   Choix invalide. Veuillez entrer 'pierre', 'feuille' ou 'ciseaux'.")

    def get_computer_item(self):
        """Sélectionne aléatoirement un élément pour l'ordinateur."""
        return random.choice(self.ITEMS)

    def get_game_result(self, user_item, computer_item):
        """
        Détermine le résultat du match.
        Retourne 'victoire', 'match nul' ou 'défaite'.
        """
        if user_item == computer_item:
            return "match nul"
        elif self.WINS_AGAINST[user_item] == computer_item:
            return "victoire"
        else:
            return "défaite"

    def play(self):
        """
        Joue une partie complète.
        Retourne le résultat sous forme de chaîne : 'victoire', 'match nul' ou 'défaite'.
        """
        user_item = self.get_user_item()
        computer_item = self.get_computer_item()
        result = self.get_game_result(user_item, computer_item)

        
        print(f"\n  Vous avez choisi     : {user_item}")
        print(f"  L'ordinateur a choisi : {computer_item}")

        if result == "victoire":
            print("   Vous avez gagné !\n")
        elif result == "match nul":
            print("  Match nul !\n")
        else:
            print("  Vous avez perdu.\n")

        return result