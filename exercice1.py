#exercice1

keys = ['Ten', 'Twenty', 'Thirty']
values = [10, 20, 30]

dictionnaire = dict(zip(keys, values))
print(dictionnaire)
# {'Ten': 10, 'Twenty': 20, 'Thirty': 30}


#exercice2

family = {"rick": 43, 'beth': 13, 'morty': 5, 'summer': 8}

def prix_billet(age):
    if age < 3:
        return 0
    elif age <= 12:
        return 10
    else:
        return 15

cout_total = 0

for membre, age in family.items():
    prix = prix_billet(age)
    cout_total += prix
    print(f"{membre} ({age} ans) : {prix} $")

print(f"\nCoût total : {cout_total} $")


#exercice 3


brand = {
    "name": "Zara",
    "creation_date": 1975,
    "creator_name": "Amancio Ortega Gaona",
    "type_of_clothes": "men, women, children, home",
    "international_competitors": ["Gap", "H&M", "Benetton"],
    "number_stores": 7000,
    "major_color": {"France": "blue", "Spain": "red", "US": ["pink", "green"]}
}

brand["number_stores"] = 2
print(brand["type_of_clothes"])

brand["country_creation"] = "Spain"

if "international_competitors" in brand:
    brand["international_competitors"].append("Desigual")

brand.pop("creation_date")

print(brand["international_competitors"][-1])
print(brand["major_color"]["US"])
print(len(brand))
print(brand.keys())

more_on_zara = {"creation_date": 1975, "number_stores": 7000}
brand.update(more_on_zara)

print(brand)

#xercice4

def describe_city(city, country="Unknown"):
    print(f"{city} is in {country}.")

describe_city("Reykjavik", "Iceland")
describe_city("Paris")


#exercice5

import random

def compare_with_random(number):
    random_number = random.randint(1, 100)
    
    if number == random_number:
        print("Success!")
    else:
        print(f"Fail! Your number: {number}, Random number: {random_number}")

compare_with_random(50)

#exercice6

def make_shirt(size, text):
    print(f"The size of the shirt is {size} and the text is {text}.")


make_shirt("large", "I love Python")

def make_shirt(size="large", text="I love Python"):
    print(f"The size of the shirt is {size} and the text is {text}.")


make_shirt()                          
make_shirt("medium")                  
make_shirt("small", "Custom message") 

make_shirt(size="small", text="Hello!")

#exercice7

import random

def get_random_temp():
    return random.randint(-10, 40)

def main():
    temp = get_random_temp()
    print("The temperature right now is", temp, "degrees Celsius.")

    if temp < 0:
        print("Brrr, it's freezing! Wear extra clothes today.")
    elif temp <= 16:
        print("It's quite cold! Don't forget your coat.")
    elif temp <= 23:
        print("Nice weather.")
    elif temp <= 32:
        print("It's a bit warm, stay hydrated.")
    else:
        print("It's really hot! Stay cool.")

main()

#exercice8


toppings = []

while True:
    topping = input("(quit pour arrêter) : ")

    if topping == "quit":
        break

    print("Adding", topping, "to your pizza.")
    toppings.append(topping)

prix = 10 + (len(toppings) * 2.5)

print("Ingrédients :", toppings)
print("Prix total :", prix, "$")