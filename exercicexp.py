class Cat:
    def __init__(self, name, age):
        self.name = name
        self.age = age

cat1 = Cat("Mimi", 3)
cat2 = Cat("ble", 7)
cat3 = Cat("Luna", 5)

def find_oldest_cat(c1, c2, c3):
    return max([c1, c2, c3], key=lambda c: c.age)

oldest = find_oldest_cat(cat1, cat2, cat3)
print(f"Le chat le plus âgé est {oldest.name}, et a {oldest.age} ans.")


#exercice2

class Dog:
    def __init__(self, name, height):
        self.name = name
        self.height = height

    def bark(self):
        print(f"{self.name} fait ouaf !")

    def jump(self):
        print(f"{self.name} saute {self.height * 2} cm de haut !")

davids_dog = Dog("Rex", 50)
sarahs_dog = Dog("Bella", 35)

for dog in [davids_dog, sarahs_dog]:
    print(f"{dog.name} - {dog.height} cm")
    dog.bark()
    dog.jump()


if davids_dog.height > sarahs_dog.height:
    print(f"{davids_dog.name} est plus grand")
else:
    print(f"{sarahs_dog.name} est plus grand")
    
    
    #exercie3
    
class Song:
    def __init__(self, lyrics):
        self.lyrics = lyrics

    def sing_me_a_song(self):
        for line in self.lyrics:
            print(line)

stairway = Song(["There's a lady who's sure",
                 "all that glitters is gold",
                 "and she's buying a stairway to heaven"])

stairway.sing_me_a_song()


#exercice4

class Zoo:
    def __init__(self, name):
        self.name = name
        self.animals = []

    def add_animal(self, animal):
        if animal not in self.animals:
            self.animals.append(animal)

    def get_animals(self):
        print(self.animals)

    def sell_animal(self, animal):
        if animal in self.animals:
            self.animals.remove(animal)

    def get_groups(self):
        for animal in sorted(self.animals):
            print(f"{animal[0]}: {animal}")

zoo = Zoo("Brooklyn Safari")

zoo.add_animal("Giraffe")
zoo.add_animal("Bear")
zoo.add_animal("Baboon")
zoo.add_animal("Lion")

zoo.get_animals()   
