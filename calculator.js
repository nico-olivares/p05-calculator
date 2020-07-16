//Global variables
let heldValue = null;
let heldOperation = null;
let nextValue = null;
let decimal = false;

//Functions

//handle the digit input
function digitHandler() {
	if (nextValue == null) {
		nextValue = 0;
	}
	if (decimal && $(this).text() == ".") {
		return;
	}

	if ($(this).text() == ".") {
		decimal = true;
	}

	nextValue = nextValue + $(this).text();

	updateDisplay();
}

//update the display
function showValue(location, value) {
	if (value == null) {
		$(location).text("");
	} else {
		$(location).text(Number(value));
	}
}

//will update the whole display
function updateDisplay() {
	showValue(".next-value", nextValue);
	showValue(".held-value", heldValue);
}

//clear all will reset all variables
function clearAllHandler() {
	heldValue = null;
	heldOperation = null;
	nextValue = null;
	$(".next-operation").text("");
	updateDisplay();
}

//clear entry will clear only the nextValue variable
function clearEntryHandler() {
	nextValue = null;
	updateDisplay();
}

function addHandler() {
	setHeldOperation(add);
	$(".next-operation").text("+");
	updateDisplay();
}

function subtractHandler() {
	setHeldOperation(subtract);
	$(".next-operation").text("-");
	updateDisplay();
}

function multiplyHandler() {
	setHeldOperation(multiply);
	$(".next-operation").text("x");
	updateDisplay();
}

function divideHandler() {
	setHeldOperation(divide);
	$(".next-operation").text("/");
	updateDisplay();
}

function equalsHandler() {
	setHeldOperation(null);
	$(".next-operation").text("");
	updateDisplay();
}

function add(a, b) {
	return Number(a) + Number(b);
}

function subtract(a, b) {
	return Number(a) - Number(b);
}

function multiply(a, b) {
	return Number(a) * Number(b);
}

function divide(a, b) {
	return Number(a) / Number(b);
}

function setHeldOperation(operation) {
	if (heldOperation != null) {
		heldValue = heldOperation(heldValue, nextValue);
	} else if (nextValue != null) {
		heldValue = nextValue;
	}
	nextValue = null;
	decimal = false;
	heldOperation = operation;
}

//click handelers
$(".digits button").click(digitHandler);
$(".add").click(addHandler);
$("subtract").click(subtractHandler);
$(".multiply").click(multiplyHandler);
$(".divide").click(divideHandler);
$(".equals").click(equalsHandler);
$(".clear-all").click(clearAllHandler);
$(".clear-entry").click(clearEntryHandler);
