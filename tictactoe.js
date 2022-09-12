function Square(props) {
  if (props.value == null) {
    return (   
      <div className="btn d-inline-block mb-2 me-2" onClick={props.onClick}>
      </div>
    )
  } else {
    return(
      <div className="btn pressed d-inline-block mb-2 me-2">
        {props.value == 'O' && <h2>{props.value}</h2>}
        {props.value == 'X' && <h2 className="c-orange">{props.value}</h2>}   
      </div>
    )
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  userSymbol = "X";
  botSymbol = "O";
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],    
    }
    this.restart = this.restart.bind(this);
  }
  
  //Осуществление хода игрока и передача хода боту
  handleClick(i) {  
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.userSymbol;
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
    });
    
    squares[this.botChoice(squares, false)[1]] = this.botSymbol;

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
    })
  }

  //Ход бота (по принципу алгоритма минимакс)
  botChoice(squares, isUser) {
    const availableMoves = squares.map((val, i) => val == null ? i : null).filter((i) => i != null); 
    
    if (calculateWinner(squares) != null || availableMoves.length == 0) {
      if (calculateWinner(squares) == this.userSymbol) {
        return [1, ''];
      } else if (calculateWinner(squares) == this.botSymbol) {
        return [-1, ''];
      } else {
        return [0, ''];
      }
    }

    let bestMove = '';
    let bestValue = isUser ? -10 : 10;
    let symbol = isUser ? this.userSymbol : this.botSymbol;
    
    for (let i = 0; i < availableMoves.length; ++i) {
      let newSquares = squares.slice();
      newSquares[availableMoves[i]] = symbol;
      let possibleValue = this.botChoice(newSquares, !isUser)[0];
      
      if ((isUser && possibleValue > bestValue) || (!isUser && possibleValue < bestValue)) {
        bestValue = possibleValue;
        bestMove = availableMoves[i];
      } 
    }

    return [bestValue, bestMove]
  }

  //Сброс текущей игры
  restart() {
    this.setState({
      history: [{
      squares: Array(9).fill(null)
      }], 
    })
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    const availableMoves = current.squares.map((val, i) => val == null ? i : null).filter((i) => i != null);

    let status;
    if (winner == 'X') {
      status = 'Ура! Победа за вами:)';
    } else if (winner == 'O') {
      status = 'Победа за ботом:(';
    } else if (availableMoves.length == 0) {
      status = 'Ничья!'
    }

    return (
      <div className="game row py-5 h-100 align-items-center">
        <div className="board col-12 col-lg-4 text-center mb-5">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="col-12 col-lg-8 text-center text-lg-start description">
          <h2 className="mb-5 c-grey ">Крестики-нолики</h2>
          {!status && 
            <p className="fs-24 m-0">Попробуйте обыграть компьютер в "Крестики-нолики"!</p>
          }
          {history.length == 1 && 
            <p className="c-grey">Нажмите на любую клетку поля, чтобы начать игру.</p>
          }
          {status && 
            <p className="c-yellow fs-24 m-0">{status}</p>
          }
          {status && 
            <p className="c-grey mb-5">Нажмите на кнопку “Заново”, чтобы начать игру сначала.</p>
          }
          {(winner || availableMoves.length == 0) && 
            <button className="btn" type="button" onClick={this.restart}>Заново</button>
          }
        </div>
      </div>
    )
  }
}

//Определение победителя
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root-tictactoe"));
root.render(<Game />);