
#  Exercice 1 

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


bengal_obj    = Bengal("Luna", 3)
chartreux_obj = Chartreux("Milo", 5)
siamese_obj   = Siamese("Bella", 2)

all_cats = [bengal_obj, chartreux_obj, siamese_obj]

sara_pets = Pets(all_cats)


sara_pets.walk()



#  Exercice 2

class Dog:
    def __init__(self, name, age, weight):
        self.name   = name
        self.age    = age
        self.weight = weight

    def bark(self):
        return f'{self.name} barks'

    def run_speed(self):
        return self.weight / self.age * 10

    def fight(self, other_dog):
        my_score    = self.run_speed()    * self.weight
        other_score = other_dog.run_speed() * other_dog.weight

        if my_score > other_score:
            return f'{self.name} won the fight!'
        elif other_score > my_score:
            return f'{other_dog.name} won the fight!'
        else:
            return "It's a draw!"

dog1 = Dog("Rex",   3, 30)
dog2 = Dog("Buddy", 5, 20)
dog3 = Dog("Max",   2, 25)




#  Exercice 3 

import random


class PetDog(Dog):
    def __init__(self, name, age, weight):
        super().__init__(name, age, weight)
        self.trained = False

    def train(self):
        print(self.bark())
        self.trained = True

    def play(self, *args):
        
        names = [a.name if isinstance(a, Dog) else a for a in args]
        all_names = [self.name] + names
        print(f'{", ".join(all_names)} all play together')

    def do_a_trick(self):
        if self.trained:
            tricks = [
                "does a barrel roll",
                "stands on his back legs",
                "shakes your hand",
                "plays dead"
            ]
            print(f'{self.name} {random.choice(tricks)}')




#  Exercice 4 


class Person:
    def __init__(self, first_name, age):
        self.first_name = first_name
        self.age        = age
        self.last_name  = ""

    def is_18(self):
        return self.age >= 18


class Family:
    def __init__(self, last_name):
        self.last_name = last_name
        self.members   = []

    def born(self, first_name, age):
        new_person           = Person(first_name, age)
        new_person.last_name = self.last_name
        self.members.append(new_person)

    def check_majority(self, first_name):
        for member in self.members:
            if member.first_name == first_name:
                if member.is_18():
                    print("You are over 18, your parents Jane and John "
                          "accept that you will go out with your friends")
                else:
                    print("Sorry, you are not allowed to go out with your friends.")
                return
        print(f"No member named {first_name} found.")

    def family_presentation(self):
        print(f"Family name: {self.last_name}")
        for member in self.members:
            print(f"  {member.first_name}, age {member.age}")
