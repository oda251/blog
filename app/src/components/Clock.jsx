import React, { useState, useEffect } from 'react';
const chime_path = '../../assets/chime.mp3';

function Clock({ additionalClass = '' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const audio = new Audio(chime_path);

    function tick() {
      setTime(new Date());
      if (time.getMinutes() === 0 && time.getSeconds() === 0) {
        audio.play();
      }
    }
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className={`clock text-2xl ${additionalClass}`}>
      <h2>
        {time.toLocaleTimeString('jp-JP', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })}
      </h2>
    </div>
  );
}

export default Clock;
