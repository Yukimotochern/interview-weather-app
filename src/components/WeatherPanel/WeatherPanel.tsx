import React from 'react'
import { Statistic, Result, Descriptions } from 'antd'
import { useAppSelector } from '../../redux/hooks'
import { SmileOutlined } from '@ant-design/icons'
import styles from './WeatherPanel.module.css'
import moment from 'moment'
import { Loading } from '../loading/Loading'

export default function WeatherPanel() {
  const weatherState = useAppSelector((s) => s.weather)
  const weather = useAppSelector((s) => s.weather.display)
  switch (weatherState.status) {
    case 'idle':
      return (
        <Result
          className={styles.result}
          icon={<SmileOutlined />}
          title="What a beautiful day! Let's check the weather~"
        />
      )
    case 'success':
      if (weather) {
        return (
          <>
            <Statistic
              title={`${weather.city || 'Unknown City'}, ${
                weather.country || 'Unknown Country'
              }`}
              value={weather.condition}
            />
            <Descriptions
              column={1}
              size='small'
              className={styles['weather-des']}
            >
              <Descriptions.Item label='Description'>
                {weather.description}
              </Descriptions.Item>
              <Descriptions.Item label='Temperature'>
                {weather.temperature
                  ? `${weather.temperature.min}°C ~ ${weather.temperature.max}°C`
                  : 'Temperature result unreceived.'}
              </Descriptions.Item>
              <Descriptions.Item label='Humidity'>
                {weather.humidity}%
              </Descriptions.Item>
              <Descriptions.Item label='Time'>
                {moment(weather.time).format('YYYY-MM-DD h:mm a')}
              </Descriptions.Item>
            </Descriptions>
          </>
        )
      } else {
        return (
          <Result
            className={styles.result}
            status='warning'
            title='Something went wrong. Please check your internet connection'
          />
        )
      }
    case 'loading':
      return (
        <div style={{ height: 155.71 }}>
          <Loading />
        </div>
      )
    case 'invalid':
      return (
        <Result
          className={styles.result}
          status='info'
          title='City Not Found'
        />
      )
    default:
      return (
        <Result
          className={styles.result}
          status='warning'
          title='Something went wrong. Please check your internet connection'
        />
      )
  }
}
