/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import './style.scss'

const MarkdownPreview = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false },
)
function MarkDownView(props) {
  return (
    <div className="m-4">
      <MarkdownPreview className="mark_down_preview" source={props.source} style={props.style} linkTarget="_blank" />
    </div>
  )
}
MarkDownView.propTypes = {
  source: PropTypes.string.isRequired,
  style: PropTypes.elementType,
}
MarkDownView.defaultProps = {
  style: {},
}
export default MarkDownView
