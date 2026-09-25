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
console.log(`${text} ==> ning teskari natijasi ==> ${result_l(text)}\n`)


console.log("============== TASK M ==============")
/*Array ichidagi har bir raqam uchun raqamning o'zi va uning kvadratidan tashkil topgan object hosil qilib qaytarsin.
Masalan: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, ...] */

interface squaredList {
    number: number;
    square: number
}
function getSquareNumbers(array: number[]): squaredList[] {

    const result: squaredList[] = [];
    for (const el of array) {
        result.push({ number: el, square: el * el });
    }
    return result;
};
const array: number[] = [1, 2, 3]
const result_m = getSquareNumbers(array)
console.log(array, " ==> kvadratlangan natija ==>", result_m)


console.log("============== TASK N ==============")
/* Stringni palindrom ekanligini aniqlab true yoki false qaytarsin.
Masalan: palindromCheck("dad") return true */


function palindromCheck(word: string): boolean {
    const reversed: string = word.split("").reverse().join("");
    const result: boolean = reversed.toLowerCase() === word.toLowerCase() ? true : false
    return result;
};

const word_n: string = "dad"
const result_n: boolean = palindromCheck(word_n)
console.log(`${word_n} so'zining polindromlik natijasi: ${result_n}`)

