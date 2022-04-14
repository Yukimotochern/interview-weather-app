import React from 'react'
import Header from '../components/Header/Header'
import { Content } from 'antd/lib/layout/layout'
import WeatherSearchBar from '../components/WeatherSearchBar/WeatherSearchBar'
import WeatherPanel from '../components/WeatherPanel/WeatherPanel'
import SearchHistoryList from '../components/SearchHistroy/SearchHistoryList'
import styles from './SearchWeatherPage.module.css'

export default function SearchWeatherPage() {
  return (
    <div className='container'>
      <Header title="Today's Weather" />
      <Content className={styles['main-content']}>
        <WeatherSearchBar />
        <WeatherPanel />
        <SearchHistoryList />
      </Content>
    </div>
  )
}
