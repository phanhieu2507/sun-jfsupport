import React from 'react'
import ErrorNotFound from '../components/err-not-found'
import Otherlayout from '../layouts/OtherLayout'

function Custom404() {
  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <ErrorNotFound />
        </Otherlayout.Main>
      </Otherlayout>
    </>
  )
}

export default Custom404
