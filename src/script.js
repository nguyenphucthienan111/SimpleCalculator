class Calculator {
  constructor() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.history = [];

    this.initializeElements();
    this.setupEventListeners();
    this.initializeHistoryModal();
  }

  initializeElements() {
    this.currentDisplay = document.querySelector(".current");
    this.historyDisplay = document.querySelector(".history");
    this.numberButtons = document.querySelectorAll(".number");
    this.operatorButtons = document.querySelectorAll(".operator");
    this.equalsButton = document.querySelector(".equals");
    this.clearButton = document.querySelector(".clear");
    this.deleteButton = document.querySelector(".delete");
    this.decimalButton = document.querySelector(".decimal");
    this.historyBtn = document.querySelector(".history-btn");
    this.historyModal = document.querySelector(".history-modal");
    this.closeModal = document.querySelector(".close-modal");
    this.historyList = document.querySelector(".history-list");
    this.clearHistoryBtn = document.querySelector(".clear-history");
  }

  initializeHistoryModal() {
    this.historyBtn.addEventListener("click", () => {
      this.historyModal.style.display = "block";
      this.updateHistoryDisplay();
    });

    this.closeModal.addEventListener("click", () => {
      this.historyModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === this.historyModal) {
        this.historyModal.style.display = "none";
      }
    });

    this.clearHistoryBtn.addEventListener("click", () => {
      this.clearHistory();
    });
  }

  updateHistoryDisplay() {
    this.historyList.innerHTML = "";
    const history = this.loadHistory();

    if (history.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className = "history-item";
      emptyMessage.textContent = "No calculations yet";
      this.historyList.appendChild(emptyMessage);
      return;
    }

    history.forEach((calc) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
            <div class="history-expression">
                ${calc.expression}
            </div>
            <div class="history-timestamp">
                ${calc.timestamp}
            </div>
        `;
      this.historyList.appendChild(historyItem);
    });
  }

  clearHistory() {
    localStorage.removeItem("calculatorHistory");
    this.updateHistoryDisplay();
  }

  setupEventListeners() {
    this.numberButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.appendNumber(button.textContent)
      );
    });

    this.operatorButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.chooseOperation(button.textContent)
      );
    });

    this.equalsButton.addEventListener("click", () => this.compute());
    this.clearButton.addEventListener("click", () => this.clear());
    this.deleteButton.addEventListener("click", () => this.delete());
    this.decimalButton.addEventListener("click", () => this.appendDecimal());
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = number.toString();
      this.shouldResetScreen = false;
      this.updateDisplay();
      return;
    }

    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand += number.toString();
    }
    this.updateDisplay();
  }

  appendDecimal() {
    if (!this.currentOperand.includes(".")) {
      this.currentOperand += ".";
      this.updateDisplay();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        if (current === 0) {
          alert("Không thể chia cho 0");
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    const calculation = {
      expression: `${prev} ${this.operation} ${current} = ${computation}`,
      result: computation,
      timestamp: new Date().toLocaleString(),
    };

    const history = this.loadHistory();
    history.unshift(calculation);
    if (history.length > 10) {
      history.pop();
    }

    localStorage.setItem("calculatorHistory", JSON.stringify(history));

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;
    this.updateDisplay();
    this.updateHistoryDisplay();
  }

  loadHistory() {
    const savedHistory = localStorage.getItem("calculatorHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  }

  delete() {
    if (this.shouldResetScreen) {
      this.clear();
      return;
    }
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") this.currentOperand = "0";
    this.updateDisplay();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  updateDisplay() {
    this.currentDisplay.textContent = this.currentOperand;
    if (this.previousOperand && this.operation) {
      this.historyDisplay.textContent = `${this.previousOperand} ${this.operation}`;
    } else {
      this.historyDisplay.textContent = "";
    }
  }
}

const calculator = new Calculator();
