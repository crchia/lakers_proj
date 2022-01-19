import './App.css';
import data from './all.json'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2'
import { useEffect, useState } from 'react';
import Filter from './Filter';
import Debrief from './Debrief';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);

function App() {
  const [seasonType, setSeasonType] = useState('All')
  const [playType, setPlayType] = useState('All')
  const [filtered, setFiltered] = useState(data)

  const seasonTypes = [
    'All',
    'Reg Season',
    'Playoffs'
  ]
  
  const playTypes = [
    'All',
    'Drive (All)',
    'Drive (R)',
    'Drive (L)',
    'Post-up (All)',
    'Post-up (R)',
    'Post-up (L)'
  ]

  // set the data to be displayed in the scatter chart
  useEffect(() => {
    // filter season
    let temp = data;
    if (seasonType === 'Reg Season') temp = temp.filter(play => play.SeasonType.startsWith('r'))
    else if (seasonType === 'Playoffs') temp = temp.filter(play => play.SeasonType.startsWith('p'))
    // filter play type
    if (playType.startsWith('Drive')) {
      temp = temp.filter(play => play.type === 'drive')
      if (playType === 'Drive (R)') temp = temp.filter(play => play.direction === 'right')
      else if (playType === 'Drive (L)') temp = temp.filter(play => play.direction === 'left')
    } else if (playType.startsWith('Post')) {
      temp = temp.filter(play => play.type === 'post')
      if (playType === 'Post-up (R)') temp = temp.filter(play => play.region.includes('right'))
      else if (playType === 'Post-up (L)') temp = temp.filter(play => play.region.includes('left'))
    }
    setFiltered(temp)
  }, [seasonType, playType])

  const ppp = () => {
    let pts = 0
    filtered.forEach(play => pts += play.ptsScored)
    return filtered.length > 0 ? pts / filtered.length : 0
  }

  const bins = getBins(filtered)

  return (
    <div className='main'>
      <h2>Jon Smith (Totally not Anthony Davis) Creation (2019-2020)</h2>
      <div className='grow-horiz'>
        <div className='grow-vert'>
          <h3 style={{marginBottom: 0}}>Season Type</h3>
          <ul>
            {seasonTypes.map(type => 
              <Filter text={type} set={setSeasonType} cur={seasonType}/>
            )}
          </ul>
          <h3 style={{marginBottom: 0}}>Play Type</h3>
          <ul>
            {playTypes.map(type => 
              <Filter text={type} set={setPlayType} cur={playType}/>
            )}
          </ul>
          <h3>Pts/play ({filtered.length} plays)</h3>
          <div className='ppp' style={{background: getColor(ppp())}}>{ppp().toFixed(2)}</div>
        </div>
        <div className='chart'>
          <Scatter
            width={750}
            height={428}
            data={{
              datasets: bins.map(bin => {
                const obj = {
                  label: null,
                  data: [bin],
                  backgroundColor: getColor(bin.pts / bin.n),
                  pointRadius: 5 + bin.n / 2.2,
                  pointHoverRadius: 10 + bin.n / 2.2
                }
                return obj
              })
            }}
            options={{
              scales: {
                x: {
                  max: 25,
                  min: -25,
                  grid: {
                    display: false,
                    drawBorder: false
                  },
                  ticks: {
                    display: false
                  }
                },
                y: {
                  max: -20,
                  min: -47.5,
                  grid: {
                    display: false,
                    drawBorder: false
                  },
                  ticks: {
                    display: false
                  }
                },
                legend: {display: false}
              },
              plugins: {
                tooltip: {
                  usePointStyle: true,
                  boxPadding: 2,
                  callbacks: {
                    label: (context) => {
                      let retArr = []
                      retArr.push('pts/play: ' + (bins[context.datasetIndex].pts / bins[context.datasetIndex].n).toFixed(2))
                      retArr.push('plays: ' + bins[context.datasetIndex].n)
                      return retArr
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </div>
      <Debrief/>
    </div>
  );
}

// get the color of a particular bin based on pts/play
const getColor = (val) => {
  let r = 0
  let g = 0
  let b = 0
  if (val >= 1) {
    r = 255
    g = 155 - (val - 1) * 255 / 0.5
    b = g
  } else {
    b = 255
    g = 255
    r = (val - 0.6) * 255 / 0.4 - 20
  }
  return `rgba(${r}, ${g}, ${b}, 1)`
}


// place data points into bins based on location
const getBins = (data) => {
  const binSize = 4;
  const bins = []
  for (let x = -25; x < 25; x += binSize) {
    for (let y = -50; y < -20; y += binSize) {
      // get the plays that fall into this loc bin
      const plays = data.filter(play => 
        play.endLocY >= x && play.endLocY <= x + binSize &&
        play.endLocX >= y && play.endLocX <= y + binSize)
      // initialize the bin
      const bin = {
        n: plays.length,
        pts: 0,
        x: 0,
        y: 0
      }
      // calculate values for this bin
      plays.forEach(play => {
        bin.pts += play.ptsScored
        bin.x += play.endLocY
        bin.y += play.endLocX
      })
      if (bin.n) {
        bin.x /= bin.n
        bin.y /= bin.n
      }
      bins.push(bin)
    }
  }
  return bins
}

export default App;
