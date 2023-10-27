let gomonkeys = document.querySelector('#gomonkeys');
let monkeys = document.querySelector('#monkeys');
let prompt = document.querySelector('#prompt');
let lengthInput = document.querySelector('#length');
let result = document.querySelector('#result');
const shakespeare = 5585636;
const typingSpeed = math.bignumber(0.5); //seconds per character
math.config({
    number: 'BigNumber',      // Default type of number:
    // 'number' (default), 'BigNumber', or 'Fraction'
    precision: 5028,            // Number of significant digits for BigNumbers
    epsilon: 1e-60
})
gomonkeys.addEventListener('click', function () {
    calculateMonkeys();
});

//Listen for changes to prompt
prompt.addEventListener('input', function () {
    if(prompt.value.length > 3500){
        addWarning(`Caution: This calculation may take up to ${Math.round(prompt.value.length/5000)} minutes. The numbers involved are bigger than a computer can easily calculate. It's gonna take those monkeys a LONG time.`)
    } else {
        addWarning("");
    }
});

function calculateMonkeys() {
    console.log("==================calculating monkeys")
    let total;
    let numMonkeys;
    let attemptsNeeded;
    let promptLength = math.bignumber(prompt.value.length);
    console.log("promptLength: " + promptLength)
    promptLength = math.bignumber(Number(promptLength));
    let minValue = math.multiply(math.subtract(promptLength, math.bignumber(1)), typingSpeed);
    //Check if prompt is empty
    if (prompt.value == "") {
        //Clear results
        result.innerHTML = "";
        addResult("Every monkey that ever existed has already written this text. Try typing something in the text box.")
        return;
    }
    //Check if monkeys are infinite
    if (monkeys.value == "infinite") {
        total = minValue
        clearResults();
        let numMonkeysPrinted = "infinite";
        addResult(`<p>It would take ${numMonkeysPrinted} monkeys</p><p class="time bold"> ${total} seconds</p> <p>to type "${prompt.value}".</p>`);

        addResult(`<p>Infinite monkeys will produce <a href="https://en.wikipedia.org/wiki/Infinite_monkey_theorem">any amount of text</a> at the speed they can type.</p><p> However, infinity is much, much bigger than very large numbers.</p> </p>Try changing to a very large number of monkeys to see the difference!</p>`);
        return;
    }
    numMonkeys = math.bignumber(monkeys.value);
    if(promptLength < 3500){
        console.log("using auto math")
        attemptsNeeded = autoMath(numMonkeys, promptLength);
    }
    else{
        console.log("using manual math")
        attemptsNeeded = manualMath(numMonkeys, promptLength);
    }
    console.log("attemptsNeeded: " + formatNumber(attemptsNeeded));

    //Calculate total time to type
    total = math.multiply(attemptsNeeded, typingSpeed);
   
    //Add initial time for success
    total = math.add(total, minValue);

    //Check how many got it right on the first try
    let firstTry = calculateFirstTry(numMonkeys, promptLength);

    let unit;
    let totalNumeric;
    //Convert number of monkeys to words
    let numMonkeysPrinted = monkeys.options[monkeys.selectedIndex].text;
    //convert to num
    if (total.toNumber() > Number.MAX_SAFE_INTEGER) {
        console.log("total too big");
        total = math.divide(total, 31536000);
        totalNumeric = total;
        total = formatNumber(total);
        unit = "years";
    } else {
        console.log("total fits");
        total = math.bignumber(formatNumber(total));
        total = total.toNumber();
        //Convert result to convenient format
        if (total < 60) {
            unit = "seconds";
        } else if (total < 3600) {
            total /= 60;
            unit = "minutes";
        } else if (total < 86400) {
            total /= 3600;
            unit = "hours";
        } else if (total < 31536000) {
            total /= 86400;
            unit = "days";
        } else {
            total /= 31536000;
            unit = "years";
        }
        totalNumeric = total;
        if(unit == "seconds" && total > 30){
            total = numberToWords.toWords(total);
        } else if(total > 3){
            total = numberToWords.toWords(total);
        } else {
            total = math.format(total, { precision: 3 })
        }
        console.log("total: " + total + " " + unit);
    }
    //Clear results
    result.innerHTML = "";
    //Remove plurals if number is one
    let monkeyPlural;
    if (numMonkeysPrinted == "one") {
        monkeyPlural = "monkey";
    } else {
        monkeyPlural = "monkeys";
    }
    if (total == "one" || total == 1) {
        unit = unit.substring(0, unit.length - 1);
    }

    //Add results
    addResult(`<p>It would take ${numMonkeysPrinted} ${monkeyPlural}</p><p class="time bold"> ${total} ${unit}</p> <p>to type "${prompt.value}" (on average).</p>`);
    //Check for first try monkeys
    if (firstTry.toNumber() > 0) {
        if(firstTry.toNumber() < Number.MAX_SAFE_INTEGER){
        addResult(`${numberToWords.toWords(Math.round(firstTry.toNumber()))} monkeys will get it right on their first try. Good job monkeys!`);
        } else {
            addResult(`${math.format(firstTry, { precision: 10 })} monkeys got it right on their first try. Good job monkeys!`);
        }
    }
    let bestComparison = numberComparison(totalNumeric, unit);
    if(bestComparison){
        addResult(`<p>That's about ${bestComparison}.</p>`);
    }
    //Comparisons for numbers of monkeys
    let monkeyComparisonText = monkeyComparison(numMonkeysPrinted);
    if(monkeyComparisonText){
        console.log("monkey comparison text: " + monkeyComparisonText)
        addResult(`<p>${monkeyComparisonText}.</p>`);
    }
    // let totalKeys = math.multiply(attemptsNeeded, numMonkeys);
    // //Check if total keys can be converted to JS number
    // if (totalKeys.toNumber() > Number.MAX_SAFE_INTEGER) {
    //     //Round to 2 decimal places
    //     totalKeysText = math.format(totalKeys, { precision: 10 });
    // } else {
    //     totalKeysText = numberToWords.toWords(totalKeys.toNumber());
    //     //Check if string has more than one comma
    //     if (totalKeysText.split(",").length > 2) {
    //         //Split string into array by commas
    //         totalKeysText = totalKeysText.split(",");
    //         //Use first two elements of array
    //         totalKeysText = totalKeysText[0] + "," + totalKeysText[1];
    //     }
    // }
    // addResult(`The ${monkeyPlural} will type around ${totalKeysText} keys total.`);
    // let attemptsNeededText;
    // if (numMonkeys.toNumber() != 1) {
    //     if (attemptsNeeded.toNumber() < 9007199254740991) {
    //         console.log("attempts needed is small enough to convert to words")
    //         attemptsNeededText = numberToWords.toWords(
    //             attemptsNeeded.toNumber()
    //             );
    //         //Check if string has more than one comma
    //         if (attemptsNeededText.split(",").length > 2) {
    //             //Split string into array by commas
    //             attemptsNeededText = attemptsNeededText.split(",");
    //             //Use first two elements of array
    //             attemptsNeededText = attemptsNeededText[0] + "," + attemptsNeededText[1];
    //         }
    //     } else {
    //         console.log("attempts needed is too big to convert to words")
    //         attemptsNeededText = math.format(attemptsNeeded, { precision: 10 });
    //     }

    //     addResult(`That's around ${attemptsNeededText} keys per monkey.`);
    // }
    
}
function addResult(text) {
    let results = document.createElement('p');
    results.innerHTML = text;
    result.appendChild(results);
}
function clearResults() {
    result.innerHTML = "";
}

function autoMath(numMonkeys, promptLength){
    let chanceOfSuccessOneMonkey = math.pow(
        math.divide(math.bignumber(1), math.bignumber(26)),
        promptLength
        );
    console.log("chanceOfSuccess: " + formatNumber(chanceOfSuccessOneMonkey));
    let oneMinusChanceOfSuccess = math.subtract(math.bignumber(1), chanceOfSuccessOneMonkey);
    console.log("oneMinusChanceOfSuccess: " + formatNumber(oneMinusChanceOfSuccess));
    let chanceOfFailure = math.pow(oneMinusChanceOfSuccess, numMonkeys);
    console.log("chanceOfFailure: " + formatNumber(chanceOfFailure));
    let chanceAllMonkeys = math.subtract(math.bignumber(1), chanceOfFailure);
    console.log("chanceAllMonkeys: " + formatNumber(chanceAllMonkeys));
    let attempts = math.divide(math.bignumber(1), chanceAllMonkeys);
    console.log("attempts: " + formatNumber(attempts));
    return attempts;
}

function manualMath(numMonkeys, promptLength){
    let chanceOneKey = math.divide(math.bignumber(1), math.bignumber(26));
    let monkeysLeft = numMonkeys;
    for(let i = 0; i < promptLength; i++){
        monkeysLeft = math.multiply(monkeysLeft, chanceOneKey);
        console.log("index: " + i + " monkeysLeft: " + formatNumber(monkeysLeft));
    }
    console.log("final monkeysLeft: " + formatNumber(monkeysLeft));
    let attempts = math.divide(math.bignumber(1), monkeysLeft);
    console.log("attempts: " + formatNumber(attempts));
    return attempts;
}

function addWarning(text){
    //Remove existing warning
    document.querySelector('.warning').innerHTML = "";
    let warning = document.createElement('p');
    warning.innerHTML = text;
    document.querySelector('.warning').appendChild(warning);
}

function calculateFirstTry(numMonkeys, promptLength){
    let chanceOfSuccessOneMonkey = math.pow(
        math.divide(math.bignumber(1), math.bignumber(26)),
        promptLength
        );
    let expectedSuccesses = math.multiply(numMonkeys, chanceOfSuccessOneMonkey);
    console.log("expectedSuccesses: " + formatNumber(expectedSuccesses));
    if(expectedSuccesses.toNumber() < 1){
        return math.bignumber(0);
    } else {
        return expectedSuccesses;
    }
}

function formatNumber(inputNumber){
    return math.format(inputNumber, { precision: 4 });
}

function numberComparison(number, unit){
    //Get the closest number in the comparison object
    let comparisonObject;
    if(unit == "seconds"){
        comparisonObject = timeComparisonSeconds;
    } else if(unit == "minutes"){
        comparisonObject = timeComparisonMinutes;
    }  else if(unit == "hours"){
        comparisonObject = timeComparisonHours;
    } else if(unit == "days"){
        comparisonObject = timeComparisonDays;
    } else if(unit == "years"){
        comparisonObject = timeComparisonYears;
    }
    //Get all comparison numbers which divide evenly into the number
    let closestNumber = [];
    number = math.bignumber(number);
    for(let key in comparisonObject){
        key = math.bignumber(key)
        let remainder = math.mod(number, key);
        let grace = math.divide(number, 5);
        console.log("number " + number + " key: " + key)
        console.log("remainder: " + remainder + " grace: " + grace)
        if(math.compare(grace, remainder) == 1 && math.compare(number, key) == 1 && math.compare(number, math.subtract(key, math.multiply(grace,key))) == 1){
            closestNumber.push([comparisonObject[key.toNumber()], math.round(math.divide(number,key))]);
        }
    }
    //Sort by closest number
    closestNumber.sort(function(a, b){
        return a[1] - b[1];
    });
    //Return the closest number
    console.log(closestNumber)
    if(closestNumber.length == 0){
        return;
    }
    console.log("closestNumber: " + closestNumber[0][0]);
    closestNumber[0][1] = formatNumber(closestNumber[0][1]);
    if(closestNumber[0][1] == 1){
        return closestNumber[0][0];
    }
    return `${Math.round(closestNumber[0][1])} times ${closestNumber[0][0]}`
}

function monkeyComparison(numMonkeys){
    console.log("gettinc monkey comparisons");
    console.log("numMonkeys: " + numMonkeys)
    if(numMonkeys == "one hundred thousand"){
        return `That's about the population of Gorillas on earth right now. You could make it happen!`;
    } else if (numMonkeys == "ten million"){
        return `That's about one monkey for every person in Portugal`;
    } else if (numMonkeys == "one googol"){
        return `That's about one monkey for every subatomic particle that exists in the observable universe`;
    } else if (numMonkeys == "one quintillion"){
        return `That's enough monkeys to cover the surface of the earth in a layer around 100 monkeys deep`
    } else if (numMonkeys == "one decillion"){
        return `If you had ten decillion Bonobos, they would weigh ten billion times more than the earth`
    }
}

let timeComparisonSeconds = {
    20: "the recommended time to wash your hands",
    390: "the average time to run a mile",
    120: "the average time to brush your teeth",
}
let timeComparisonMinutes = {

}

let timeComparisonDays = {
    267: "how long it would take to <a href='https://www.wired.com/story/how-long-would-it-take-to-bicycle-to-the-moon/'>cycle to the moon</a>",
}

let timeComparisonYears = {
    27: "the average lifespan of a macaque, so you'll have to replace them at some point",
    30: "as long as the average person has been alive",
    39: "the average lifespan of a Chimpanzee, so you'll have to replace them at some point",
    40: "the average lifespan of a Babboon, so you'll have to replace them at some point",
    195: "<a href='https://what-if.xkcd.com/11/'>how long you would have to stand outside with your mouth open before a bird pooped in it</a>",
    500: "as long as the Roman Empire lasted",
    300000: "as long as Homo Sapiens has existed",
    12000: "as long as humans have been farming",
    8000000: "as long as Chimpanzees have existed",
    150000000: "as long as Dinosaurs ruled the earth",
    230000000: "how long it takes our sun to orbit the Milky Way",
    3700000000: "how long life has existed on Earth",
    13700000000: "the age of the universe",
    10000000000000: "the expected lifespan of the universe, in the heat death model",
}
