let display = document.getElementById('display');
        let currentInput = '0';
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function appendToDisplay(value) {
            if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }

            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                // Prevent multiple decimal points
                if (value === '.' && currentInput.includes('.')) {
                    return;
                }
                
                // Prevent multiple operators in a row
                if (['+', '-', '*', '/'].includes(value)) {
                    const lastChar = currentInput.slice(-1);
                    if (['+', '-', '*', '/'].includes(lastChar)) {
                        currentInput = currentInput.slice(0, -1) + value;
                    } else {
                        currentInput += value;
                    }
                } else {
                    currentInput += value;
                }
            }
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function calculate() {
            try {
                // Replace × with * for evaluation
                let expression = currentInput.replace(/×/g, '*');
                
                // Evaluate the expression
                let result = eval(expression);
                
                // Handle division by zero and other errors
                if (!isFinite(result)) {
                    currentInput = 'Error';
                } else {
                    // Round to avoid floating point precision issues
                    currentInput = parseFloat(result.toFixed(10)).toString();
                }
                
                shouldResetDisplay = true;
            } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9' || key === '.') {
                appendToDisplay(key);
            } else if (key === '+' || key === '-') {
                appendToDisplay(key);
            } else if (key === '*') {
                appendToDisplay('*');
            } else if (key === '/') {
                event.preventDefault();
                appendToDisplay('/');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace') {
                event.preventDefault();
                deleteLast();
            }
        });