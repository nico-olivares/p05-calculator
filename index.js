//Global variables
let inputEntries = []; //keeps track of the rpn items (stack)
let storedNumber = 0; //number stored after an operation key is entered
let lastOperation = ""; //remembers the operation that will be executed when the second number is finished entering
let lastNumberParts = []; //keeps track of each digit entered
let currentNumber = 0; //number to be displayed as it gets written
let currentNumberActive = true;
let fromEnter = false; //flag is on when last operation was enter in rpn mode
let decimal = false;
let decimalCounter = 0;
let rpnMode = false;
let positive = true;

//Functions

//division
function divide(a, b) {
	return a / b;
}

//multiplication
function multiply(a, b) {
	return a * b;
}

//subtraction
function subtract(a, b) {
	return a - b;
}

//addition
function add(a, b) {
	return a + b;
}

//square root
function squareRoot(a) {
	if (a >= 0) {
		return Math.sqrt(a);
	} else {
		return 0;
	}
}

//square
function xSquare(a) {
	return a * a;
}

//negative
function negative(a) {
	return -a;
}

// *************************************

//clear all
function clear() {
	inputEntries.length = 0;
	lastNumberParts.length = 0;
	storedNumber = 0;
	currentNumber = 0;
	positive = true;
	decimal = false;
	currentNumberActive = false;
	printer();
}

//printer
function printer() {
	$(".displayRow1").text(printText(inputEntries[2]));
	$(".displayRow2").text(printText(inputEntries[1]));
	$(".displayRow3").text(printText(inputEntries[0]));
	$(".displayRow4").text(printText(currentNumber));
}

//print text (helper function)
function printText(n) {
	if (n == NaN || n == undefined) {
		return "";
	} else {
		return numeral(n).format("0,0.[000000000]");
	}
}

//getNumber
function getNumber() {
	if (decimal && $(this).text() == ".") {
		return;
	}
	if (rpnMode && !currentNumberActive) {
		if (!fromEnter) {
			inputEntries.unshift(currentNumber);
		}
		currentNumber = 0;
	}
	fromEnter = false;
	if (!currentNumberActive) {
		currentNumber = 0;
		currentNumberActive = true;
	}
	if (currentNumberActive) {
		let point = false; //point just pressed this time
		let polarity = 1;
		if ($(this).text() == ".") {
			decimal = true;
			decimalCounter = 10;
			point = true;
		}
		if (positive) {
			polarity = 1;
		} else {
			polarity = -1;
		}
		if (decimal && !point) {
			lastNumberParts.unshift(
				(parseFloat($(this).text()) / decimalCounter) * polarity
			);
			currentNumber = currentNumber + lastNumberParts[0];
			decimalCounter = decimalCounter * 10;
		} else if (!decimal && !point) {
			lastNumberParts.unshift(parseFloat($(this).text()) * polarity);
			currentNumber = currentNumber * 10 + lastNumberParts[0];
		}
		printer();
	}
}

//delete last digit entered
function deleteLast() {
	if (currentNumberActive && lastNumberParts.length > 0) {
		if (
			(lastNumberParts[0] < 1 && lastNumberParts[0] > 0) ||
			(lastNumberParts[0] > -1 && lastNumberParts[0] < 0)
		) {
			decimal = true;
		} else {
			decimal = false;
		}
		if (decimal) {
			currentNumber = currentNumber - lastNumberParts[0];
		} else {
			currentNumber = (currentNumber - lastNumberParts[0]) / 10;
		}
		lastNumberParts.shift();
		printer();
	}
}

//changes the polarity of the current number
function plusMinus() {
	if (positive) {
		positive = false;
	} else {
		positive = true;
	}
	currentNumber = negative(currentNumber);
	for (let i = 0; i < lastNumberParts.length; i++) {
		lastNumberParts[i] = negative(lastNumberParts[i]);
	}
	printer();
}

//In RPN mode it switches the current number with the previous one
function switchXY() {
	if (rpnMode) {
		const temp = currentNumber;
		currentNumberActive = false;
		if (inputEntries.length > 0) {
			currentNumber = inputEntries[0];
		} else {
			currentNumber = 0;
		}
		inputEntries.splice(0, 1, temp);
		printer();
	}
}

//shows or hides the RPN example
function toggleExample() {
	const rpn = $(".rpnInfo");
	if (rpn.css("display") == "none") {
		rpn.css("display", "block");
	} else {
		rpn.css("display", "none");
	}
}

//RPN Toggle will set RPN to on or off
function rpnToggle() {
	if (rpnMode) {
		rpnMode = false;
		$(".RPN").css("background-color", "rgb(241, 217, 241)");
		$(".bottom button:first-child").css("display", "none");
		$(".clear").css("grid-column", "2 / span 2");
		$(".enter").removeClass($(".enterPic"));
		$(".enter").text("=");
	} else {
		rpnMode = true;
		$(".RPN").css("background-color", "rgb(223, 52, 223)");
		$(".bottom button:first-child").css("display", "block");
		$(".clear").css("grid-column", "3 / span 1");
		$(".enter").text("");
		$(".enter").append(
			$('<img class="enterPic" src="enter-text.png" alt="enter" />')
		);
	}
	clear();
}

//will sort the kind of calculator to use
function typeOfCalculator() {
	positive = true;
	decimal = false;
	currentNumberActive = false;
	if (rpnMode) {
		rpnCalculator($(this));
	} else {
		regularCalculator($(this));
	}
}

//regular calculator
function regularCalculator(operationPassed) {
	if (operationPassed.val() == "x2" || operationPassed.val() == "root") {
		switch (operationPassed.val()) {
			case "x2":
				currentNumber = xSquare(currentNumber);
				break;
			case "root":
				currentNumber = squareRoot(currentNumber);
				break;
		}
		lastOperation = "";
	} else {
		switch (lastOperation) {
			case "/":
				currentNumber = divide(storedNumber, currentNumber);
				break;
			case "*":
				currentNumber = multiply(storedNumber, currentNumber);
				break;
			case "-":
				currentNumber = subtract(storedNumber, currentNumber);
				break;
			case "+":
				currentNumber = add(storedNumber, currentNumber);
				break;

			case "enter":
				break;
		}
		lastOperation = operationPassed.val();
	}
	storedNumber = currentNumber;
	lastNumberParts.length = 0;
	printer();
}

//RPN calculator brains
function rpnCalculator(operationPassed) {
	if (operationPassed.val() == "x2" || operationPassed.val() == "root") {
		switch (operationPassed.val()) {
			case "x2":
				currentNumber = xSquare(currentNumber);
				break;
			case "root":
				currentNumber = squareRoot(currentNumber);
				break;
		}
	} else {
		let a = 0;
		const b = currentNumber;
		if (inputEntries.length > 0) {
			a = inputEntries[0];
		}
		switch (operationPassed.val()) {
			case "enter":
				inputEntries.unshift(currentNumber);
				currentNumberActive = 0;
				fromEnter = true;
				lastNumberParts.length = 0;
				break;
			case "/":
				currentNumber = divide(a, b);
				inputEntries.shift();
				break;
			case "*":
				currentNumber = multiply(a, b);
				inputEntries.shift();
				break;
			case "-":
				currentNumber = subtract(a, b);
				inputEntries.shift();
				break;
			case "+":
				currentNumber = add(a, b);
				inputEntries.shift();
				break;
		}
	}
	printer();
}

//listeners and callers

$(".digits button").click(getNumber);
$(".delete").click(deleteLast);
$(".plusMinus").click(plusMinus);
$(".operations > button, .enter, .square, .root").click(typeOfCalculator);
$(".clear").click(clear);
$(".RPN").click(rpnToggle);
$(".switch").click(switchXY);
$(".rpnDef").click(toggleExample);
$(".close").click(toggleExample);
