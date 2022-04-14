import React from 'react'
import { useAppSelector } from '../../redux/hooks'
import { List, Typography, Button } from 'antd'
import moment from 'moment'
import styles from './SearchHistoryList.module.css'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import {
  getWeather,
  WeatherHistory,
  weatherSlice,
} from '../../redux/weather/weatherSlice'
import { useDispatch } from 'react-redux'

export default function SearchHistoryList() {
  const weatherList = useAppSelector((s) => s.weather.history)
  const dispatch = useDispatch()

  const onReSearch = (item: WeatherHistory) => {
    if (item.city) {
      dispatch(getWeather({ lat: item.lat, lon: item.lon }))
    }
  }
  const onDeleteHistory = (ind: number) => {
    dispatch(weatherSlice.actions.deleteHistory(ind))
  }

  return (
    <>
      <Typography.Title level={4} className={styles['history-title']}>
        Search History
      </Typography.Title>
      {
        <List
          itemLayout='horizontal'
          size='small'
          className={styles['list-item']}
          dataSource={weatherList}
          renderItem={(item, ind) => (
            <List.Item
              actions={[
                <Button
                  shape='circle'
                  icon={<SearchOutlined />}
                  onClick={() => onReSearch(item)}
                />,
                <Button
                  shape='circle'
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => onDeleteHistory(ind)}
                />,
              ]}
            >
              <List.Item.Meta
                title={`${ind + 1}. ${item.city}, ${item.country}`}
              />
              <div>{moment(item.time).format('h:mm:ss a')}</div>
            </List.Item>
          )}
        />
      }
    </>
  )
}
