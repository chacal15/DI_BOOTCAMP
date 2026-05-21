#Defi1


mot = input("Entrez un mot :")

indices ={}

for i, lettre in enumerate(mot):
    if lettre in indices:
        
        indices[lettre].append(i)
    else:
        
        indices[lettre] = [i]



#Defi2

items_purchase = {
    "Water": "$1",
    "Bread": "$3",
    "TV": "$1,000",
    "Fertilizer": "$20"
}

wallet = "$300"

argent = int(wallet.replace("$", "").replace(",", ""))

basket = []

for article in items_purchase:
    prix = items_purchase[article]
    prix = int(prix.replace("$", "").replace(",", ""))

    if prix <= argent:
        basket.append(article)

if basket == []:
    print("Nothing")
else:
    basket.sort()
    print(basket)
