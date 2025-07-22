import { useState } from 'react'
import '../styles/StudentDashboard.css'

const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')

  const handleNumber = (num) => {
    setDisplay(display === '0' ? num : display + num)
  }

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ')
    setDisplay('0')
  }

  const handleEqual = () => {
    try {
      const result = eval(equation + display)
      setDisplay(result.toString())
      setEquation('')
    } catch (error) {
      setDisplay('Error')
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
  }

  return (
    <div className="calculator-widget">
      <h3>Calculator</h3>
      <div className="calculator">
        <div className="calculator-display">
          <div className="equation">{equation}</div>
          <div className="current">{display}</div>
        </div>
        <div className="calculator-buttons">
          <button onClick={handleClear}>C</button>
          <button onClick={() => handleNumber('7')}>7</button>
          <button onClick={() => handleNumber('8')}>8</button>
          <button onClick={() => handleNumber('9')}>9</button>
          <button onClick={() => handleOperator('+')}>+</button>
          <button onClick={() => handleNumber('4')}>4</button>
          <button onClick={() => handleNumber('5')}>5</button>
          <button onClick={() => handleNumber('6')}>6</button>
          <button onClick={() => handleOperator('-')}>-</button>
          <button onClick={() => handleNumber('1')}>1</button>
          <button onClick={() => handleNumber('2')}>2</button>
          <button onClick={() => handleNumber('3')}>3</button>
          <button onClick={() => handleOperator('*')}>×</button>
          <button onClick={() => handleNumber('0')}>0</button>
          <button onClick={() => handleNumber('.')}>.</button>
          <button onClick={handleEqual}>=</button>
          <button onClick={() => handleOperator('/')}>/</button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
