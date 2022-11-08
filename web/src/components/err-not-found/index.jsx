/* eslint-disable no-restricted-globals */
import React from 'react'
import router from 'next/router'
import { RollbackOutlined } from '@ant-design/icons'

export default function ErrorNotFound() {
  return (
    <div className="flex items-center justify-center" style={{ height: '75vh' }}>
      <div className="flex items-center gap-x-8">
        <div
          // className='bg-red-500'
          style={{
            width: '200px',
            height: '200px',
          }}
        >
          <img src="/images/logo404.png" alt="logo" width="300" height="300" />
        </div>
        <div
          className="p-14 rounded-3xl"
          style={{
            backgroundColor: '#e3f6f5',
          }}
        >
          <h1>指定されたページは存在しません。</h1>
          <p className="mb-5">
            大変申し訳ございませんが、
            <br />
            お探しのページは移動もしくは削除された可能性があります。
            <br />
            アドレスを確認してください。
          </p>
          <div className="flex items-center gap-x-2">
            <RollbackOutlined style={{ fontSize: '18px' }} />
            <button
              className="text-blue-700"
              type="button"
              onClick={() => router.push('/top-page')}
            >
              ホームページへ戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
