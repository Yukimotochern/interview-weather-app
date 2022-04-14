import React from 'react'
import { Spin } from 'antd'
import styles from './Loading.module.css'

export const Loading = () => (
  <div className={styles['spin']}>
    <Spin size='large' />
  </div>
)
