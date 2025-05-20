import React, {createContext, useState} from "react"
import MainWeatherComponent from "./feature/MainWeatherComponent/MainWeatherComponent"
import Search from "./feature/Search/Search";
import { FireRiskProvider } from "./context/FireContext";


export const WeatherContext = createContext(null);

function App() {
    const [weatherData, setWeatherData] = useState(null);
    return (<section className="">
        <WeatherContext.Provider value={{weatherData, setWeatherData}}>
             <FireRiskProvider>
                <MainWeatherComponent />
             </FireRiskProvider>
        </WeatherContext.Provider>
    </section>)
}

export default App
