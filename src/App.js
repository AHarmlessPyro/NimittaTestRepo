import React, { Component } from 'react';
import SideNav from './sideNav';
import './App.css';


const DELTA = 500;
const pageOrderLandscape = [["panel-1", "panel-2"], ["page-1"], ["page-2"]];
const pageOrderPortrait = [["panel-1"], ["panel-2"], ["page-1"], ["page-2"]];
const templateImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAD8UlEQVR4nO3UMQ0AIADAMLzhXwUOMAAW+MiSHv13bew1D0DB+B0A8MqwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMi4Ct4WTFhksUgAAAABJRU5ErkJggg=="
const IMG_ROOT = './img/';

const images = importAll(require.context('./img/', false, /\.(png|jpe?g|svg)$/));

const L2PMap = { 0: 0, 1: 2, 2: 3 };
const P2LMap = { 0: 0, 1: 0, 2: 1, 3: 2 };

const RADIUS = 7;
const GRID_GAP = 4

var lastDetection = 0;
var currentDisplay = 0;

function importAll(r) {
  console.log(r.keys());
  let results = {};
  let count = 0;
  r.keys().forEach((key) => {
    let imageKey = key;
    let textKey = key.toString().replace(/\.(png|jpe?g|svg)$/, ".txt");
    results[count.toString()] = { image: imageKey, text: textKey };
    count++;
  })
  return results;
}

function orientation() {
  if (window.innerHeight > window.innerWidth) {
    return 'portrait';
  } return 'landscape';

}

function getText() {
  fetch(IMG_ROOT + `${currentDisplay}.txt`)
    .then((res) => { console.log(res); res.text() })
    .then((res) => { console.log(res) })
}

function timeOutFunction() {
  currentDisplay = Math.floor(Math.random() * Object.keys(images).length);
  document.getElementsByClassName("imgActual")[0].src = IMG_ROOT + `${images[currentDisplay].image}`;
  window.setTimeout(timeOutFunction, 5000);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfClicks: 0,
      apiResponse: "",
      currentPage: 0
    };
  }

  forceReRender(timeStamp = lastDetection) {
    this.reRender({
      deltaY: 0, timeStamp: timeStamp, preventDefault: function () {
        return undefined;
      }
    }, true);
  }

  reRender(event, force = false) {
    event.preventDefault();
    if ((event.timeStamp - lastDetection > DELTA) || force) {

      let pageOrder = [];
      let currOrientation = orientation();

      if (currOrientation === 'portrait') {
        pageOrder = pageOrderPortrait;
      } else {
        pageOrder = pageOrderLandscape;
      }

      let baseHeight = this.state.currentPage * 100;

      pageOrder.forEach((page, index) => {
        page.forEach(
          (item) => {
            console.log(index);
            let element = document.getElementsByClassName(item)[0];
            element.style.transform = `translateY(${index * 100 - baseHeight}vh)`;
            element.dataset.top = index * 100 - baseHeight;
          }
        );
      })

      lastDetection = event.timeStamp;
      //this.forceUpdate();
      return true;
    } return false;
  }

  callAPI() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "name": "John" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    // fetch("http://localhost:9000/testAPI", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
  };

  // handleClick() {
  //   this.setState({ numOfClicks: this.state.numOfClicks + 1 });
  // };

  pageChangeOnClick(event, index) {
    debugger;
    this.setState({ currentPage: index });
    this.forceUpdate();
    Array.from(document.getElementsByTagName("circle")).forEach((item) => {
      item.classList.remove('buttonSelectedColor');
      item.classList.add('buttonNotSelectedColor');
    })
    event.target.classList.remove('buttonNotSelectedColor');
    event.target.classList.add('buttonSelectedColor');

  }

  componentWillMount() {
    this.callAPI();

    window.setTimeout(timeOutFunction, 10);
    window.addEventListener('wheel', (e) => {
      if (e.deltaY > 0) {
        let pageOrder = orientation() === 'portrait' ? pageOrderPortrait : pageOrderLandscape;
        this.setState({ currentPage: Math.min((this.state.currentPage + 1), pageOrder.length - 1) });
      } else if (e.deltaY < 0) {
        this.setState({ currentPage: Math.max((this.state.currentPage - 1), 0) });
      }
      this.reRender(e, false);
      this.forceUpdate();
    });

    window.addEventListener('resize', (e) => {
      if (orientation() === 'portrait') {
        this.setState({ currentPage: L2PMap[this.state.currentPage] });
      } else {
        this.setState({ currentPage: P2LMap[this.state.currentPage] });
      }
      this.forceReRender(e.timeStamp);
      this.forceUpdate();
    });
  }

  componentDidMount() {
    //debugger;
    let currOrientation = orientation();
    let pageOrder = [];
    if (currOrientation === 'portrait') {
      pageOrder = pageOrderPortrait;
    } else {
      pageOrder = pageOrderLandscape;
    }
    let startHeight = 0;
    pageOrder.forEach((item) => {
      item.forEach((page) => {
        let element = document.getElementsByClassName(page)[0];
        element.dataset.top = startHeight;
        element.style.transform = `translateY(${startHeight}vh)`
      })
      startHeight += 100;
    })
  }

  componentDidUpdate() {
    this.forceReRender();
  }

  render() {
    return (
      <div className="App" >
        <div style={{ zIndex: 1000, position: "fixed", right: "1%", top: "50%" }}>
          <SideNav
            listOfItems={orientation() === 'portrait' ? pageOrderPortrait : pageOrderLandscape}
            elementWidth={"2.5%"}
            circleRadius={RADIUS}
            circleGap={GRID_GAP}
            callBackFunction={this.pageChangeOnClick.bind(this)}
            itemClicked={this.state.currentPage}></SideNav>
        </div>
        <div className="page page-0">
          <div className="fullPage fullPage-Slide panel-1" id="1" >
            <div className="imageFrame" style={{}}>
              <img className="imgActual" src={templateImage}>
              </img>
            </div>
            <div style={{ position: "relative", transform: "rotateZ(-12.5deg)", backgroundColor: "blue", width: "33.34%", height: "11.11%", top: "10%", left: "38.5%", borderRadius: "1em", borderStyle: "dotted" }}>
              {<p>{images[currentDisplay].text}</p>}
            </div>
          </div>
          <div className="fullPage fullPage-Slide panel-2" id="2" onClick={this.handleClick}>
            <div style={{ position: "relative", backgroundColor: "blue", width: "35%", height: "15%", top: "20%", left: "65%", borderColor: "black" }}>
            </div>
          </div>
        </div>
        <div className="page page-1">
          <div className="fullPage fullPage-Panel" id="3" onClick={this.handleClick}>
            <div className="introNimitta">
              <div className="imageFrame" style={{ marginTop: "5%", top: "0%" }}>
                <img src="../../img/1.png" style={{ width: "100%", height: "100%", borderRadius: "1rem" }}></img>
              </div>
            </div>

          </div>
        </div>
        <div className="page page-2">
          <div className="fullPage fullPage-Panel" id="4" onClick={this.handleClick}>

          </div>
        </div>
      </div >
    )
  }
} export default App;