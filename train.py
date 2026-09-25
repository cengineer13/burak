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
print(f"Natija: {word_k} so'zida {result_k} ta unli qatnashgan.\n")
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


print("============== TASK M ==============")
print("""Array ichidagi har bir raqam uchun raqamning o'zi va uning kvadratidan tashkil topgan object 
hosil qilib qaytarsin.Masalan: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, ...]
""")


def getSquareNumbers(array):
    return [{"number": i, "square": i**2} for i in array]


array = [1, 2, 3]
result_m = getSquareNumbers(array)
print(f"{array} kvadratlari ==> {result_m}\n")

print("============== TASK N ==============")
print("""Stringni palindrom ekanligini aniqlab true yoki false qaytarsin.
Masalan: palindromCheck("dad") return true
""")


def palindromCheck(word):
    word = word.strip()
    reversed_word = word[::-1]
    return True if word.lower() == reversed_word.lower() else False


word = "alla"
result_n = palindromCheck(word)
print(f"{word} so'zi {'palindrom' if result_n else 'palindrom emas'}")
