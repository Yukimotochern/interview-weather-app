import React from 'react'
import styles from './Header.module.css'
import { PageHeader } from 'antd'

export default function Header({ title }: { title: string }) {
  return <PageHeader title={title} className={styles['tw-header']} />
}
