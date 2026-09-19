print("============== TASK K ==============")
print("""Berilayotgan parametr tarkibida nechta unli harf bor ekanligini aniqlovchi function tuzing.
Masalan: countVowels("string") return 1
""")
vowels = ["a", "e", "i", "o", "u"]


def countVowels(word):
    count = 0
    for letter in word.lower():
        if letter in vowels:
            count += 1
    return count


word_k = "Stringa"
result_k = countVowels(word_k)
print(f"Natija: {word_k} so'zida {result_k} ta unli qatnashgan.")
print("\n")


print("============== TASK L ==============")
print("""So'zlarni ketma-ketligini buzmasdan har bir so'zni alohida teskarisiga o'girib beradigan function tuzing.
Masalan: reverseSentence("we like coding!") return "ew ekil !gnidoc
""")


def reverseSentence(sentence):
    array = sentence.split()  # str -> array
    reversed_array = [word[::-1]
                      for word in array]  # reverse each words via loop
    return " ".join(reversed_array)  # reversed array -> string


sentence = "We like coding!"
result_l = reverseSentence(sentence)
print(
    f"Natija: {sentence} ==> teskari natijasi ==>: {result_l} ")
print("\n")
