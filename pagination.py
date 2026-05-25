
import math


class PageError(ValueError):
    """Levée quand un numéro de page est hors limites."""
    pass



class Pagination:
    """
    Simule un système de pagination basique.

    Attributs
    ---------
    items       : liste complète des éléments
    page_size   : nombre d'éléments par page
    current_idx : index (base 0) de la page courante
    total_pages : nombre total de pages
    """


    def __init__(self, items=None, page_size=10):
        """
        Paramètres optionnels :
            items     – liste d'éléments (None → liste vide)
            page_size – nombre d'éléments par page (défaut 10)
        """
        self.items       = items if items is not None else []
        self.page_size   = page_size
        self.current_idx = 0                                    # index base 0
        self.total_pages = math.ceil(len(self.items) / self.page_size) if self.items else 0


    def get_visible_items(self):
        """
        Retourne la tranche d'éléments correspondant à la page courante.
        Utilise le slicing : items[début : fin]
        """
        debut = self.current_idx * self.page_size
        fin   = debut + self.page_size
        return self.items[debut:fin]          # slicing — fin hors limites OK


    def go_to_page(self, page_num):
        """
        Accède à la page numéro page_num (indexation utilisateur : base 1).
        Lève PageError si page_num est hors limites.
        Ne retourne PAS self (pas de chaînage pour cette méthode).
        """
        page_num = int(page_num)                         # conversion de type

        if page_num < 1 or page_num > self.total_pages:
            raise PageError(
                f"Page {page_num} invalide. "
                f"Choisissez entre 1 et {self.total_pages}."
            )

        self.current_idx = page_num - 1                  # base 0 en interne

    def first_page(self):
        """Accède à la première page. Retourne self pour le chaînage."""
        self.current_idx = 0
        return self                                       # chaînage de méthodes

    def last_page(self):
        """Accède à la dernière page. Retourne self pour le chaînage."""
        self.current_idx = self.total_pages - 1
        return self

    def next_page(self):
        """
        Passe à la page suivante si ce n'est pas déjà la dernière.
        Retourne self pour le chaînage.
        """
        if self.current_idx < self.total_pages - 1:
            self.current_idx += 1
        return self

    def previous_page(self):
        """
        Revient à la page précédente si ce n'est pas déjà la première.
        Retourne self pour le chaînage.
        """
        if self.current_idx > 0:
            self.current_idx -= 1
        return self


    def __str__(self):
        """Retourne les éléments de la page courante, un par ligne."""
        return "\n".join(str(item) for item in self.get_visible_items())


    def __repr__(self):
        return (f"Pagination(page={self.current_idx + 1}/"
                f"{self.total_pages}, size={self.page_size})")


# 

if __name__ == "__main__":

    alphabetList = list("abcdefghijklmnopqrstuvwxyz")
    p = Pagination(alphabetList, 4)

    print("Test 1 – get_visible_items() page 1 :")
    print(p.get_visible_items())
    # ['a', 'b', 'c', 'd']

    print("\nTest 2 – next_page() puis get_visible_items() :")
    p.next_page()
    print(p.get_visible_items())
    # ['e', 'f', 'g', 'h']

    print("\nTest 3 – last_page() puis get_visible_items() :")
    p.last_page()
    print(p.get_visible_items())

    print("\nTest 4 – go_to_page(10) → ValueError :")
    try:
        p.go_to_page(10)
    except PageError as e:
        print(f"PageError attrapée : {e}")

    print("\nTest 5 – go_to_page(0) → ValueError :")
    try:
        p.go_to_page(0)
    except PageError as e:
        print(f"PageError attrapée : {e}")

    print("\nTest 6 – str(p) depuis la première page :")
    p.first_page()
    print(str(p))
    

    print("\nTest 7 (Bonus) – chaînage next_page x3 :")
    p.first_page()                              # retour page 1 → ['a','b','c','d']
    resultat = p.next_page().next_page().next_page().get_visible_items()
    print(resultat)
    # ['m', 'n', 'o', 'p']

    print("\nTest 8 (Bonus) – chaînage last → previous → previous :")
    resultat2 = p.last_page().previous_page().previous_page().get_visible_items()
    print(resultat2)
    # ['i', 'j', 'k', 'l']

    print("\nTest 9 – Pagination() vide :")
    vide = Pagination()
    print(vide.get_visible_items())
    # []