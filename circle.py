import math


class Circle:
    """Représente un cercle défini par son rayon."""

    def __init__(self, radius: float):
        if radius <= 0:
            raise ValueError("Le rayon doit être un nombre strictement positif.")
        self._radius = radius

    @classmethod
    def from_diameter(cls, diameter: float) -> "Circle":
        """Constructeur alternatif : crée un cercle à partir de son diamètre."""
        return cls(diameter / 2)


    @property
    def radius(self) -> float:
        """Rayon du cercle."""
        return self._radius

    @property
    def diameter(self) -> float:
        """Diamètre du cercle."""
        return self._radius * 2

    @property
    def area(self) -> float:
        """Aire du cercle (π × r²)."""
        return math.pi * self._radius ** 2

    @property
    def circumference(self) -> float:
        """Périmètre du cercle (2 × π × r)."""
        return 2 * math.pi * self._radius

    # 

    def __repr__(self) -> str:
        return f"Circle(radius={self._radius})"

    def __str__(self) -> str:
        return (
            f"Cercle :\n"
            f"  Rayon        : {self._radius:.4f}\n"
            f"  Diamètre     : {self.diameter:.4f}\n"
            f"  Aire         : {self.area:.4f}\n"
            f"  Périmètre    : {self.circumference:.4f}"
        )

    

    def __add__(self, other: "Circle") -> "Circle":
        """Additionne deux cercles → nouveau cercle dont le rayon est la somme des rayons."""
        if not isinstance(other, Circle):
            return NotImplemented
        return Circle(self._radius + other._radius)

    

    def __eq__(self, other: object) -> bool:
        """Deux cercles sont égaux s'ils ont le même rayon."""
        if not isinstance(other, Circle):
            return NotImplemented
        return math.isclose(self._radius, other._radius)

    def __lt__(self, other: "Circle") -> bool:
        """Inférieur à — permet le tri avec sorted() / list.sort()."""
        if not isinstance(other, Circle):
            return NotImplemented
        return self._radius < other._radius

    def __gt__(self, other: "Circle") -> bool:
        """Supérieur à — détermine quel cercle est le plus grand."""
        if not isinstance(other, Circle):
            return NotImplemented
        return self._radius > other._radius

    def __le__(self, other: "Circle") -> bool:
        if not isinstance(other, Circle):
            return NotImplemented
        return self._radius <= other._radius

    def __ge__(self, other: "Circle") -> bool:
        if not isinstance(other, Circle):
            return NotImplemented
        return self._radius >= other._radius



if __name__ == "__main__":
    c1 = Circle(5)
    c2 = Circle.from_diameter(14)   # rayon = 7
    c3 = Circle(3)
    c4 = Circle(7)

    print("── Affichage ──────────────────────────")
    print(c1)
    print()
    print(c2)

    print("\n── Aires ──────────────────────────────")
    print(f"Aire de c1 (r=5)  : {c1.area:.4f}")
    print(f"Aire de c2 (r=7)  : {c2.area:.4f}")

    print("\n── Addition ───────────────────────────")
    c_sum = c1 + c2
    print(f"c1 + c2 = {c_sum}")

    print("\n── Comparaisons ───────────────────────")
    print(f"c1 (r=5) > c3 (r=3) : {c1 > c3}")   # True
    print(f"c3 (r=3) > c1 (r=5) : {c3 > c1}")   # False
    print(f"c2 (r=7) == c4 (r=7): {c2 == c4}")   # True
    print(f"c1 (r=5) == c2 (r=7): {c1 == c2}")   # False

    print("\n── Tri de cercles ─────────────────────")
    circles = [Circle(9), Circle(2), Circle(6), Circle(1), Circle(4)]
    print("Avant tri :", [repr(c) for c in circles])
    circles_sorted = sorted(circles)
    print("Après tri :", [repr(c) for c in circles_sorted])