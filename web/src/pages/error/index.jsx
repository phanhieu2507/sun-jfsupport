import React from 'react'
import { Button } from 'antd'
import { useRouter } from 'next/router'

function NotFound() {
  const router = useRouter()
  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="m-auto text-center text-red-500">Oops!!! Some thing went wrong.</h1>
      <Button className="m-auto" onClick={() => router.push('/')}>
        Go home
      </Button>
    </div>
  )
}

export default NotFound
