import { createAsyncThunk } from '@reduxjs/toolkit'
import { JSONSchemaType } from 'ajv'
import axios from 'axios'
import ajv from '../../util/ajv'
import { getWeather } from '../weather/weatherSlice'

interface locationQuery {
  country: string
  city: string
}

interface LocationWithCoordinate {
  lat: number
  lon: number
}

const locationSchema: JSONSchemaType<LocationWithCoordinate[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      lat: { type: 'number' },
      lon: { type: 'number' },
    },
    required: ['lat', 'lon'],
    additionalProperties: true,
  },
}

const localValidator = ajv.compile(locationSchema)

export const getLocationAction = createAsyncThunk(
  'location/getLocation',
  async ({ city, country }: locationQuery, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi
    const { data: location } = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},,${country}&limit=1&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`
    )
    if (localValidator(location)) {
      if (location.length === 0) {
        return rejectWithValue('Not Found')
      }
      dispatch(getWeather({ lat: location[0].lat, lon: location[0].lon }))
    } else {
      return rejectWithValue('Invalid Response')
    }
  }
)
