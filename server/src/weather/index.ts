import axios, { AxiosError } from "axios";
import { envs } from "../config/envs";
import { logger } from "../shared/logger";

export interface WeatherData {
    temp: number;
    description: string;
}

const isWeatherData = (data: any): data is WeatherData => {
    return typeof data?.temp === "number" && typeof data?.description === "string";
};

interface IProps {
    lat: number;
    lon: number;
    lang: string;
}
export const getWeather = async ({ lat, lon, lang }: IProps): Promise<WeatherData> => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&lang=${lang}&appid=${envs.WEATHER_API_KEY}`;
        const { data } = await axios.get(url);
        const weatherData: WeatherData = {
            temp: data?.current?.temp,
            description: data?.current?.weather[0]?.description
        };
        if (!isWeatherData(weatherData)) {
            logger.error("Error while getting weather");
            logger.error(data);
            throw new Error("Error while getting weather");
        }
        return weatherData;
    } catch (err) {
        logger.error("Error while getting weather");
        const errStr = (err instanceof AxiosError && err?.response?.data) || err;
        logger.error(errStr);
        throw new Error(errStr);
    }
};
