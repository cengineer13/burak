console.log("============== TASK K ==============")
/* Berilayotgan parametr tarkibida nechta unli harf bor ekanligini aniqlovchi function tuzing.
Masalan: countVowels("string") return 1 */

function countVowels(word: string): number {
    let count: number = 0;
    for (const letter of word.toLocaleLowerCase()) {
        if ("aeiou".includes(letter)) count += 1;
    }
    return count;
}
const word: string = "stringaa"
const result_k: number = countVowels(word)
console.log(`Berilgan ${word} so'zida ${result_k} ta unli qatnashgan!\n`)

console.log("============== TASK L ==============")
/* So'zlarni ketma-ketligini buzmasdan har bir so'zni alohida teskarisiga o'girib beradigan function tuzing.
Masalan: reverseSentence("we like coding!") return "ew ekil !gnidoc */

// Bu safar arrow funtion orqali hosil qildim
const result_l = (sentence: string): string => {
    let reversedText: string = "";
    const array: string[] = sentence.split(" ");
    for (const word of array) {
        reversedText += ` ${word.split("").reverse().join("")}`;
        // console.log(reversedText);
    }
    return reversedText;

}
const text: string = "We like codinG!";
console.log(`${text} ==> ning teskari natijasi ==> ${result_l(text)}`)