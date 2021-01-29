import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, debounceTime, map, buffer, filter } from "rxjs/operators";

function App() {
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState("reset");

  useEffect(() => {
    const oversubscribe$ = new Subject();
    interval(700)
      .pipe(takeUntil(oversubscribe$))
      .subscribe(() => {
        if (status === "start") {
          setTimer((val) => val + 1000);
        }
      });

    return () => oversubscribe$.next();
  }, [status]);

  const start = () => {
    setStatus("start");
  };

  const stop = () => {
    setStatus("stop");
    setTimer(0);
  };

  const reset = () => {
    setStatus("reset");
    setTimer(0);
    setStatus("start");
  };

  let mouse$ = fromEvent(document.getElementById("waitBtn"), "click");
  const buff$ = mouse$.pipe(debounceTime(300));

  const wait = (e) => {
    const click$ = mouse$.pipe(
      buffer(buff$),
      map((waitBtn) => {
        return waitBtn.length;
      }),
      filter((x) => x === 2)
    );

    click$.subscribe(() => {
      setStatus("wait");
    });
  };

  return (
    <div className="container">
      <div className="time"> {new Date(timer).toISOString().slice(11, 19)}</div>
      <div>
        <button className="btn" onClick={start}>
          start
        </button>
        <button className="btn " id="waitBtn" onClick={wait}>
          Wait
        </button>
        <button className="btn" onClick={stop}>
          stop
        </button>
        <button className="btn " onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;