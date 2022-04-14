import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { JSONSchemaType } from 'ajv'
import axios from 'axios'
import ajv from '../../util/ajv'
import { getLocationAction } from '../location/locationSlice'

export interface WeatherHistory {
  city?: string
  country?: string
  condition?: string
  description?: string
  temperature?: {
    max?: number
    min?: number
  }
  humidity?: number
  time?: number
  lat: number
  lon: number
}

export interface WeatherState {
  display?: WeatherHistory
  history: WeatherHistory[]
  status: 'loading' | 'idle' | 'success' | 'error' | 'invalid'
}

interface WeatherQuery {
  lat: number
  lon: number
}

interface WeatherResponse {
  weather: {
    description: string
    main: string
  }[]
  main: {
    temp_min: number
    temp_max: number
    humidity: number
  }
  name: string // city name
  sys: {
    country: string
  }
  dt: number
}
const weatherSchema: JSONSchemaType<WeatherResponse> = {
  type: 'object',
  properties: {
    weather: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          main: { type: 'string' },
        },
        additionalProperties: true,
        required: ['description', 'main'],
      },
    },
    main: {
      type: 'object',
      properties: {
        temp_max: { type: 'number' },
        temp_min: { type: 'number' },
        humidity: { type: 'number' },
      },
      additionalProperties: true,
      required: ['temp_max', 'temp_min', 'humidity'],
    },
    name: { type: 'string' },
    sys: {
      type: 'object',
      properties: {
        country: { type: 'string' },
      },
      additionalProperties: true,
      required: ['country'],
    },
    dt: { type: 'number' },
  },
  additionalProperties: true,
  required: ['main', 'name', 'sys', 'weather'],
}
const weatherValidator = ajv.compile(weatherSchema)

const initialState: WeatherState = {
  history: [],
  status: 'idle',
}

export const getWeather = createAsyncThunk(
  'weather/getWeather',
  async ({ lat, lon }: WeatherQuery, thunkApi) => {
    const { rejectWithValue } = thunkApi
    const { data: weather } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`
    )
    if (weatherValidator(weather)) {
      return { ...weather, lat, lon }
    } else {
      rejectWithValue('Invalid Response')
    }
  }
)

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    deleteHistory(state, action: PayloadAction<number>) {
      state.history.splice(action.payload, 1)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocationAction.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getLocationAction.rejected, (state, action) => {
        if (action.payload === 'Not Found') {
          state.status = 'invalid'
        } else {
          state.status = 'error'
        }
      })
      .addCase(getWeather.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        const { payload } = action
        const record = {
          city: payload?.name,
          country: payload?.sys.country,
          condition: payload?.weather[0].main,
          description: payload?.weather[0].description,
          temperature: {
            max: payload?.main.temp_max,
            min: payload?.main.temp_min,
          },
          humidity: payload?.main.humidity,
          time: payload ? payload.dt * 1000 : 0,
          lat: payload?.lat || 0,
          lon: payload?.lon || 0,
        }
        state.display = record
        state.history.unshift(record)
        state.status = 'success'
      })
      .addCase(getWeather.rejected, (state, action) => {
        if (action.error.code === '400') {
          state.status = 'invalid'
        } else {
          state.status = 'error'
        }
      })
  },
})
