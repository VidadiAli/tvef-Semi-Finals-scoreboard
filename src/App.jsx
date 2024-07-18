import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import video from './v.ogg'
import { resultOfSf } from './JsFiles/MainJsFiles';

function App() {

  const [allCountries, setAllCountries] = useState([]);
  const [finalists, setFinalists] = useState([]);
  const [videoPlay, setVideoPlay] = useState('')
  const [loading, setLoading] = useState('');

  const callData = async () => {
    setLoading('')
    const arrayOfParticipants = (await axios.get('https://api-esc.onrender.com/country')).data;
    setAllCountries(arrayOfParticipants);

    //const arrayOfFinalists = (await axios.get('https://us-central1-api-tvef-vote.cloudfunctions.net/app/resultEd9')).data;
    const arrayOfFinalists = resultOfSf;
    setFinalists(arrayOfFinalists.sf2);
    
    setLoading('loading-end');
  }

  let finalistCount = 0;
  let countryPuans = 0, arrayOfCountryPuans = [], arrayOfCountry = [];
  allCountries.forEach((f) => {
    if (f.result) {
      finalistCount++;
      finalists.forEach((e) => {
        if (f.countryName === e.getingCountry) {
          countryPuans += e.puan
        }
      })
      arrayOfCountryPuans.push(countryPuans);
      arrayOfCountry.push(f.countryName);
      countryPuans = 0;
    }
  });


  let amount = 0, mainIndex = 0, n = arrayOfCountryPuans.length;
  for (let j = 0; j < arrayOfCountryPuans.length; j++) {
    for (let i = 0; i < n; i++) {
      if (arrayOfCountryPuans[i] > amount) {
        mainIndex = i;
        amount = arrayOfCountryPuans[i];
      }
    }

    let changeElement1 = arrayOfCountryPuans[n - 1]
    arrayOfCountryPuans[n - 1] = arrayOfCountryPuans[mainIndex]
    arrayOfCountryPuans[mainIndex] = changeElement1;


    let changeElement2 = arrayOfCountry[n - 1]
    arrayOfCountry[n - 1] = arrayOfCountry[mainIndex]
    arrayOfCountry[mainIndex] = changeElement2;

    n--;
    mainIndex = 0
    amount = 0
  };


  const idOfFinalist = [finalistCount - 8, finalistCount - 9, finalistCount - 2, finalistCount - 6, finalistCount - 1, finalistCount - 3, finalistCount - 0, finalistCount - 4, finalistCount - 7, finalistCount - 5];
  let countOfId = 0;

  const finalistArea = document.getElementsByClassName('finalist')[0];
  const box = document.getElementsByClassName('box');
  const add = () => {
    allCountries.forEach((e) => {
      if (e.countryName === arrayOfCountry[idOfFinalist[countOfId] - 1]) {
        const finalistDizayn = document.createElement('div');
        finalistArea.append(finalistDizayn);
        finalistDizayn.className = 'finalist-dizayn';

        setTimeout(() => {
          finalistDizayn.remove()
        }, 1500)

        setTimeout(() => {
          for (let i = 0; i < box.length; i++) {
            if (box[i].children[0].src === e.flag) {
              box[i].style.opacity = '.3';
            }
          }
        }, 1800)

        setTimeout(() => {
          const finalistBox = document.createElement('div');
          const flag = document.createElement('img');
          flag.setAttribute('src', e.flag);
          const nameOfCountry = document.createElement('span');
          nameOfCountry.textContent = e.countryName;

          finalistBox.append(flag, nameOfCountry);
          finalistArea.append(finalistBox);
        }, 1500)

      }
    })

    countOfId++;
  }

  useEffect(() => {
    callData();
  }, [])



  const btnVideo = () => {
    setVideoPlay(video)
  }


  return (
    <>
      {
        window.innerWidth < 900 ? <div>This program is only suitable for computers</div> : <>
          <div className={`main-back`}>
            {[...Array(18)].map((_, i) => (
              <div className="back-child" key={i}></div>
            ))}
          </div>
          <section className='back'>
            <div className={`loading ${loading}`}>
              <button>Loading ...</button>
            </div>
            <div className='main'>
              <div className='all'>
                {
                  allCountries && allCountries.map((e) => {
                    if (e.result) {
                      return <div key={e.id} className='box'>
                        <img src={e.flag} alt="" />
                        <span>{e.countryName}</span>
                      </div>
                    }
                  })
                }
              </div>
              <div className='finalist'></div>
            </div>

            <button className='button' onClick={add}>Add</button>
            <button className='btn-video' onClick={btnVideo} >video</button>
            <video src={videoPlay} autoPlay controls></video>
          </section>
        </>
      }
    </>
  )
}

export default App
