#Exercice1

print("Hello world\nHello world\nHello world\nHello world")


#Exercice2

resultat = (99 ** 3) * 8
print("resultat de 99**3) * 8 :", resultat)


#Exercice3

print(5<3) # False n'est pas inferieur à 3

print(3==3)# True 3 est égal à 3 

print(3=="3") #False un int et une str ne sont jamais égaux

#Exercice4

computer_brand = "lenovo" # remplacez par la marque de votre ordinateur
#Utilisation d'une f-string pour insérer la variable dans la phrase
print(f"I have a {computer_brand}computer.")

#Exercice 5

name="Alisson" 
age=20
shoe_size= 39

info= (f"Je m'appelle {name}, j'ai {age} ans "
        f"et je chausse du {shoe_size}.")
print(info)



#Exercice6


a = 15 # premier nombre
b = 7 # Deuxieme nombre 

#condiction : si a est strictement superieure à b, on affiche le message
if a > b:
    print("Hello world")
    
    
    
    #Exercice7
    
    
    nombre = int(input("Entrez un nombre :"))  # Saisie et conversion en entier
    
    #le modulo (%)renvoie le rest de la division entiére 
    #Si le reste de la division par 2 est 0, le nombre est pair
    if nombre % 2 ==0:
        print(f"{nombre} est un nombre pair.")
    else:
        print(f"{nombre} est un nombre impair.")
        
        
        #Exercice8
        
        mon_nom= "Paul"# le nom à l'utilisateur et on le met en miniscule pour la comparaison 
        nom_utilisateur = input ("Quel est votre nom?")
        
        #Comparaison insensible à la casse grâce à.lower()
        if nom_utilisateur.lower() == mon_nom.lower():
            print(f"Vraiment! Nous partageons le même prénom,{nom_utilisateur}!"f"Nous devons être deux âmes sœurs de la même famille!")
        else:
            print(f"Enchanté ,{nom_utilisateur}!Moi c'est {mon_nom}.")
            f"un prénom différent,mais on peut quand même être amis "
            
            
   
   #Exercice9
   # Saisie de la taille et conversion en nombre entier
taille = int(input("Entrez votre taille en centimètres : "))
 
# La taille minimale requise est de 145 cm
if taille > 145:
    print(f"Vous mesurez {taille} cm. Vous êtes assez grand(e) pour monter à bord ! ")
else:
    print(f"Vous mesurez {taille} cm. Vous devez encore grandir un peu "
          f"pour pouvoir monter à bord. ")
          