import { useState } from 'react';
import './App.css';
import { answerList } from './utils/wordlist';
import { CSSTransition } from 'react-transition-group';
const GREEN = 2;
const YELLOW = 1;
const GREY = 0;
const WHITE = 3;
const rowLength = 5;
let gameNum: number = Math.round(Math.random() * answerList.length);
const FalseInitial = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
const delay = ["0s", "1s", "2s", "3s", "4s"]
function App() {
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Delete'];
  let empty: string[] = [];
  for (let i = 0; i < 30; i++) {
    empty.push(" ");
  }
  let anpty: string = '';
  let fake: number[] = [];
  for (let i = 0; i < 30; i++) {
    fake.push(WHITE);
  }
  let lettersColor: { [key: string]: string } = {};
  const letters = row1.concat(row2.concat(row3));
  for (let i = 0; i < letters.length; i++) {
    lettersColor[letters[i]] = 'transparent';
  }
  const [content, setContent] = useState(empty);
  const [cursor, setCursor] = useState(0);
  const [answer, setAnswer] = useState(anpty);
  const [position, setPosition] = useState(fake);
  const [rowNum, setRowNum] = useState(0);
  const [letterColor, setLetterColor] = useState(lettersColor);
  const [rotate, setRotate] = useState(FalseInitial);
  const colorJudge = (judgeNum: number) => {
    if (judgeNum === GREEN) return 'green';
    if (judgeNum === YELLOW) return 'yellow';
    if (judgeNum === GREY) return 'grey';
    return 'white';
  }
  const judge = () => {
    return cursor % 5 === 0 && cursor !== 0;
  }
  const rotateChange = async () => {
    let index = 0;
    let timer = setInterval(() => {
      setRotate(FalseInitial);
      rotate[rowNum * rowLength + index] = true;
      setRotate(rotate);
      console.log(rotate);
      index += 1;
      if (index === 5) {
        clearInterval(timer);
      }
    }, 1000);
  }
  const compare = (answer: string, solution: string) => {
    answer = answer.toLowerCase();
    solution = solution.toLowerCase();
    if (answer === solution) return 1;
    else {
      for (let i = 0; i < answerList.length; i++) {
        if (answerList[i] === answer) {
          return 0;
        }
      }
      return -1;
    }
  }
  const flush = () => {
    let temp: string[] = empty;
    setContent(temp);
    setCursor(0);
    setRowNum(0);
    setPosition(fake);
    setAnswer('');
    setLetterColor(lettersColor);
    gameNum = Math.round(Math.random() * answerList.length);
  }
  const handleKeyDown = (key: string) => {
    console.log(answerList[gameNum]);
    if ((key === 'q' || key === 'w' || key === 'e' || key === 'r' || key === 't' || key === 'y' || key === 'u' || key === 'i' || key === 'o' || key === 'p' || key === 'a' || key === 's' || key === 'd' || key === 'f' || key === 'g' || key === 'h' || key === 'j' || key === 'k' || key === 'l' || key === 'z' || key === 'x' || key === 'c' || key === 'v' || key === 'b' || key === 'n' || key === 'm') && !judge()) {
      let temp = content;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] === ' ') {
          temp[i] = key;
          setCursor(prev => prev + 1);
          break;
        }
      }
      setAnswer(prev => prev + key);
      setContent(temp);
    }
    if ((key === 'Backspace' || key === 'delete' || key === 'Delete') && cursor >= 1) {
      let temp = content;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] === ' ') {
          temp[i - 1] = ' ';
          setCursor(prev => prev - 1);
          break;
        }
        if (i === temp.length - 1) {
          temp[i] = ' ';
          setCursor(prev => prev - 1);
          break;
        }
      }
      let deal = answer;
      setAnswer(deal.substring(0, deal.length - 1));
      setContent(temp);
    }
    if (answer.length === 5 && key === 'Enter') {
      //单词输入无效的情况
      if (compare(answer, answerList[gameNum]) === -1) {
        alert('Invalid Word!');
        for (let i = 0; i < 5; i++) {
          handleKeyDown('Delete');
        }
        setAnswer(anpty);
      }
      //单词输入正确，匹配字母的情况
      if (compare(answer, answerList[gameNum]) === 0) {
        let guess = answer.split('');
        let ans = answerList[gameNum].split('');
        ans.forEach((element, index) => {
          if (element === guess[index]) {
            position[rowNum * rowLength + index] = GREEN;
            letterColor[element] = 'green';
          }
          else if (guess.includes(element) && (position[rowNum * rowLength + guess.findIndex((ele) => ele === element)] === GREY || position[rowNum * rowLength + guess.findIndex((ele) => ele === element)] === WHITE)) {
            position[rowNum * rowLength + guess.findIndex((ele) => ele === element)] = YELLOW;
            letterColor[element] = 'yellow';
          }
        });
        for (let i = 0; i < ans.length; i++) {
          if (position[rowNum * rowLength + i] !== GREEN && position[rowNum * rowLength + i] !== YELLOW) {
            position[rowNum * rowLength + i] = GREY;
          }
        }
        guess.forEach((element, index) => {
          if (letterColor[element] !== 'green' && letterColor[element] !== 'yellow') {
            letterColor[element] = 'grey';
          }
        });
        setRotate(FalseInitial);
        for (let i = 0; i < 5; i++) {
          rotate[rowNum * rowLength + i] = true;
        }
        setRotate(rotate);
        setPosition(position);
        setLetterColor(letterColor);
        setCursor(0);
        setAnswer(anpty);
        setRowNum(prev => prev + 1);
      }
      // 单词输入正确且匹配的情况
      if (compare(answer, answerList[gameNum]) === 1) {
        for (let i = rowNum * 5; i < rowNum * 5 + 5; i++) {
          position[i] = GREEN;

        }
        setRotate(FalseInitial);
        for (let i = 0; i < 5; i++) {
          rotate[rowNum * rowLength + i] = true;
        }
        setRotate(rotate);
        setPosition(position);
        setCursor(0);
        setTimeout("alert('Absolute Corrrrrrrrrrrrrrrect!')", 3000);
        setTimeout(() => { window.location.reload() }, 4000);
      }
    }
  }
  return (
    <div
      style={{ height: "100vh", backgroundColor: "rgb(135,206,235)" }}
      tabIndex={0}
      onKeyDown={(event) => handleKeyDown(event.key)}
    >
      <div>
        {
          (() => {
            let temp = [];
            for (let i = 0; i < 6; i++) {
              temp.push(
                <div className='gridRow'>
                  {content.slice(i * rowLength, (i + 1) * rowLength).map((value, index) => (
                    <div className={`letter ${rotate[i * rowLength + index] && "a"} ${colorJudge(position[i * rowLength + index])}`} key={index}>
                      <div className="front">{value}</div>
                      <div className="back">{value}</div>
                    </div>
                  ))}
                </div>
              )
            }
            return temp;
          })()
        }
      </div>
      <div className='butRow'>
        {
          row1.map((value, index) => (
            <button className='but' style={{ transitionDelay: '2.5s', margin: "3px", backgroundColor: `${letterColor[value]}` }} onClick={(e) => handleKeyDown(value)}>{value}</button>
          ))
        }
      </div>
      <div className='butRow'>
        {
          row2.map((value, index) => (
            <button className='but' style={{ transitionDelay: '2.5s', margin: "3px", backgroundColor: `${letterColor[value]}` }} onClick={(e) => handleKeyDown(value)}>{value}</button>
          ))
        }
      </div>
      <div className='butRow'>
        {
          row3.map((value, index) => (
            <button className='but' style={{ transitionDelay: '2.5s', margin: "3px", backgroundColor: `${letterColor[value]}` }} onClick={(e) => handleKeyDown(value)}>{value}</button>
          ))
        }
      </div>
    </div >
  );
}

export default App;
