/// <reference types="react-scripts" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_TIMEOUT: string
      REACT_APP_OPEN_WEATHER_KEY: string
    }
  }
}

export {}
