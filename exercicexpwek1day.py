class Pets():
    def __init__(self, animals):
        self.animals = animals

    def walk(self):
        for animal in self.animals:
            print(animal.walk())


class Cat():
    is_lazy = True

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def walk(self):
        return f'{self.name} is just walking around'


class Bengal(Cat):
    def sing(self, sounds):
        return f'{sounds}'


class Chartreux(Cat):
    def sing(self, sounds):
        return f'{sounds}'


class Siamese(Cat):
    def sing(self, sounds):
        return f'{sounds}'


bengal_cat    = Bengal("Leo", 3)
chartreux_cat = Chartreux("Mimi", 5)
siamese_cat   = Siamese("Neli", 2)

all_cats  = [bengal_cat, chartreux_cat, siamese_cat]
sara_pets = Pets(all_cats)
sara_pets.walk()


#exercice 2
class Dog:
    def __init__(self, name, age, weight):
        self.name = name
        self.age = age
        self.weight = weight

    def bark(self):
        return f"{self.name} aboie"

    def run_speed(self):
        return self.weight / self.age * 10

    def fight(self, other_dog):
        my_score = self.run_speed() * self.weight
        other_score = other_dog.run_speed() * other_dog.weight
        if my_score > other_score:
            return f"{self.name} a gagné le combat contre {other_dog.name} !"
        elif other_score > my_score:
            return f"{other_dog.name} a gagné le combat contre {self.name} !"
        else:
            return f"{self.name} et {other_dog.name} font match nul !"


dog1 = Dog("Rex", 3, 30)
dog2 = Dog("Bella", 5, 20)
dog3 = Dog("Max", 2, 25)

print(dog1.bark())
print(dog2.run_speed())
print(dog1.fight(dog2))
print(dog2.fight(dog3))


#exercice 3

class Person:
    def __init__(self, first_name, age):
        self.first_name = first_name
        self.age = age
        self.last_name = ""

    def is_18(self):
        return self.age >= 18


class Family:
    def __init__(self, last_name):
        self.last_name = last_name
        self.members = []

    def born(self, first_name, age):
        new_person = Person(first_name, age)
        new_person.last_name = self.last_name
        self.members.append(new_person)

    def check_majority(self, first_name):
        for member in self.members:
            if member.first_name == first_name:
                if member.is_18():
                    print("You are over 18, your parents Jane and John accept that you will go out with your friends")
                else:
                    print("Sorry, you are not allowed to go out with your friends.")
                return
        print(f"{first_name} n'est pas membre de cette famille.")

    def family_presentation(self):
        print(f"Famille : {self.last_name}")
        for member in self.members:
            print(f"  - {member.first_name}, {member.age} ans")


family = Family("Dupont")
family.born("Alice", 20)
family.born("Tom", 15)
family.born("Claire", 18)

family.check_majority("Alice")
family.check_majority("Tom")
family.check_majority("Claire")

print()
family.family_presentation()