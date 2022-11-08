/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import './style.scss'
import PropTypes from 'prop-types'
import { SearchOutlined } from '@ant-design/icons'
import Autosuggest from 'react-autosuggest'
import { notification, Button } from 'antd'
import { useRouter } from 'next/router'

export default function SearchSugges({ listTask, id }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const router = useRouter()
  const getSuggestionValue = (suggestion) => suggestion.name
  const toHalfWidth = (v) => v.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>
  const onChange = (event, { newValue }) => {
    const values = toHalfWidth(newValue)
    setValue(values)
  }
  // eslint-disable-next-line no-shadow
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    return inputLength === 0
      ? []
      : listTask.filter((lang) => lang.name.toLowerCase().includes(inputValue))
  }
  // eslint-disable-next-line no-shadow
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }
  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }
  const openNotificationWithIcon = (type) => {
    notification[type]({
      closable: false,
      duration: 3,
      description: '該当結果が見つかりませんでした',
    })
  }
  function search() {
    let a = true
    listTask.forEach((element) => {
      if (value === element.name) {
        a = false
        router.push(`/tasks/${id}?name=${value}`)
      }
    })
    if (a === true) {
      openNotificationWithIcon('error')
    }
  }
  const inputProps = {
    placeholder: 'タスク名',
    value,
    onChange,
  }
  return (
    <div className="search-sugges flex items-center h-10">
      <Autosuggest
        style={{ border: 'none' }}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <Button
        size="large"
        className="flex justify-center items-center"
        type="primary"
        onClick={search}
        icon={<SearchOutlined />}
      >
        検索
      </Button>
    </div>
  )
}
SearchSugges.propTypes = {
  listTask: PropTypes.array.isRequired,
}
SearchSugges.propTypes = {
  id: PropTypes.number.isRequired,
}
