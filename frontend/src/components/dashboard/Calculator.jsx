import { useState } from 'react'

const Calculator = () => {
  const [display, setDisplay] = useState('')
  const [history, setHistory] = useState([])

  const handleClick = (value) => {
    if (value === '=') {
      try {
        const result = eval(display)
        setHistory([...history, `${display} = ${result}`])
        setDisplay(result.toString())
      } catch (error) {
        setDisplay('Error')
      }
    } else if (value === 'C') {
      setDisplay('')
    } else if (value === '←') {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay(display + value)
    }
  }

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C', '←'
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        <div className="calculator-display">
          <input type="text" value={display} readOnly />
        </div>
        <div className="calculator-buttons">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => handleClick(btn)}
              className={`calc-button ${
                ['/', '*', '-', '+', '='].includes(btn) ? 'operator' :
                ['C', '←'].includes(btn) ? 'function' : 'number'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
      <div className="calculation-history">
        <h3>History</h3>
        <ul>
          {history.map((calc, index) => (
            <li key={index}>{calc}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Calculator
