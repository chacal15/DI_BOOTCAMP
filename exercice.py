#defi 1

print("=" * 40) 
print(" Défi 1: Multiples")
print("=" * 40)

number= int(input("Entrez un nombre:"))
length = int(input("Entrez la longeur de la liste :")) 

multiples = [number * i for i in range(1, length +1)]
print(f"resultat {multiples}")


#defi2

print("\n" + "="* 40)
print("Défi 2 : Suprimer les doublons")
print("=" * 40)

word = input("Entrez une chaîne de caractére :" )

result = ""
for char in word:
    if not result or char != result[-1]:
        result += char
        
        print(f"résultat\"{result}\"")