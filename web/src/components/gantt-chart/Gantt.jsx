import React, { Component } from 'react'

import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import './Gantt.css'
import './material.css'
import './style.scss'
import PropTypes from 'prop-types'
import { changeDateFormat } from '../../utils/utils'

export default class Gantt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: this.props.filter,
      dateFilter: this.props.dateFilter,
      nameFilter: this.props.nameFilter,
      categoryFilter: this.props.categoryFilter,
      assigneeFilter: this.props.assigneeFilter,
    }
  }

  componentDidMount() {
    const { tasks } = this.props

    /* Full List of Extensions */
    gantt.plugins({
      click_drag: true,
      drag_timeline: true,
      tooltip: true,
      overlay: true,
      auto_scheduling: true,
      fullscreen: true,
      keyboard_navigation: true,
      multiselect: true,
      undo: true,
      marker: true,
    })

    /* date height */
    gantt.config.min_column_width = 44
    gantt.config.scale_height = 120
    gantt.config.drag_progress = true
    gantt.config.work_time = true

    /* config layout */
    gantt.config.layout = {
      css: 'material',
      rows: [
        {
          cols: [
            { view: 'grid', scrollX: 'scrollHor', scrollY: 'scrollVer' },

            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },

            { view: 'scrollbar', id: 'scrollVer' },
          ],
        },
        { view: 'scrollbar', scroll: 'x', id: 'scrollHor' },
      ],
    }
    gantt.templates.scale_cell_class = (date) => {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return 'weekend'
      }
      return ''
    }
    gantt.attachEvent('onBeforeLightbox', () => false)

    // custom link style
    gantt.templates.link_class = (link) => {
      const types = gantt.config.links
      switch (link.type) {
        case types.finish_to_start:
          return 'finish_to_start'
        case types.start_to_finish:
          return 'start_to_finish'
        case types.start_to_start:
          return 'start_to_start'

        case types.finish_to_finish:
          return 'finish_to_finish'
        default:
          return ''
      }
    }
    const daysStyle = (date) => {
      if (date === new Date()) {
        return 'today-mark'
      }
      return ''
    }
    // you can use gantt.isWorkTime(date)
    // when gantt.config.work_time config is enabled
    // In this sample it's not so we just check week days

    // if (date.getDay() === 0 || date.getDay() === 6) {
    //   return 'weekend'
    // }

    gantt.templates.scale_row_class = (scale) => {
      switch (scale.unit) {
        case 'day':
          return 'day_scale'

        case 'month':
          return 'month_scale'

        default:
          return 'week_scale'
      }
    }
    /* remove timeline text */
    gantt.templates.task_text = () => ''
    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%F' },
      { unit: 'week', step: 1, format: '%W', css: '' },
      { unit: 'day', step: 1, format: '%d', css: daysStyle },
    ]

    gantt.attachEvent('onGanttReady', () => {
      const tooltips = gantt.ext.tooltips
      tooltips.tooltip.setViewport(gantt.$task_data)
    })
    // gantt.config.tooltip_offset_x = 30
    // gantt.config.tooltip_offset_y = 40
    const dateToStr = gantt.date.date_to_str('%F %j, %Y')
    const today = new Date()
    gantt.addMarker({
      start_date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ),
      css: 'today',
      // text: '今日',
      title: `Today: ${dateToStr(today)}`,
    })
    gantt.config.columns = [
      {
        name: 'task',
        label: 'タスクリスト',
        tree: true,
        width: 200,
        template(item) {
          return `
           <span
               class="task-column"
              >
               <p  class="task-detail"> ${item.is_jobfair ? `<b>JF名:</b> ${item.text}` : item.text}</p>
           </span>
          `
        },
      },
      {
        name: 'avatars',
        label: '担当者',
        align: 'center',
        width: 150,
        //     template(obj) {
        //       return `${obj.avatars.map((item)=>
        //         <span class="avatar">
        //     <img  src="https://picsum.photos/70">
        // </span>
        //         )}`
        //     },
        template(item) {
          return `
            <div class="ant-avatar-group">
              ${item.avatars ? item.avatars.map((ele) => `
                  <div class="avt_hover">${ele}</div>
                  <div class="ant-avatar ant-avatar-circle ant-avatar-image">
                    <img src=../../api/avatar/${ele} class="avatar" />
                  </div>
                `) : ''}
            </div>
          `
        },
      },
    ]

    function allParentsCheck(id, nameFilter) {
      let showTask = false
      gantt.eachParent((task) => {
        if (gantt.getTask(task.id).text.toLowerCase().indexOf(nameFilter.toLowerCase()) >= 0) showTask = true
      }, id)
      return showTask
    }

    const formatMonthScale = gantt.date.date_to_str('%l')

    /**
     * @param {number} id
     * @returns {boolean}
     */
    const isFilterSatisfied = (id) => {
      const item = gantt.getTask(id)

      if (
        (item.status === this.state.filter || this.state.filter === '全て')
        && (changeDateFormat(item.start_date) === this.state.dateFilter
          || this.state.dateFilter === '')
        && (item.text?.toLowerCase().includes(this.state.nameFilter.toLowerCase())
          || allParentsCheck(id, this.state.nameFilter)
          || this.state.nameFilter === '')
        && (item.category?.includes(this.state.categoryFilter)
          || this.state.categoryFilter === ''
          || this.state.categoryFilter === undefined)
        && (item.assignee?.includes(this.state.assigneeFilter)
          || this.state.assigneeFilter === ''
          || this.state.assigneeFilter === undefined)
      ) {
        return true
      }
      return false
    }

    /**
     * @param {number} id
     * @returns {boolean}
     */
    const filterWithChildren = (id) => {
      let match = false

      if (isFilterSatisfied(id)) {
        match = true
      }

      if (gantt.hasChild(id)) {
        gantt.eachTask((childItem) => {
          if (filterWithChildren(childItem.id)) {
            match = true
          }
        }, id)
      }

      return match
    }

    // filters
    // eslint-disable-next-line no-unused-vars
    gantt.attachEvent('onBeforeTaskDisplay', (id, item) => filterWithChildren(id))

    gantt.attachEvent('onDataRender', () => {
      // eslint-disable-next-line react/prop-types
      this.props.setIsHaveSatisfiedTask(Boolean(gantt.getVisibleTaskCount()))
    })

    gantt.templates.tooltip_text = (start, end, item) => `${
      !item.is_jobfair ? '<b>タスク:</b>' : '<b>JF名:</b>'
    } ${item.text}<br/><b>開始日:</b> ${gantt.templates.tooltip_date_format(
      start,
    )}<br/><b>終了日:</b> ${gantt.templates.tooltip_date_format(end)} ${
      item.assignee
        ? `<br/><b>担当者:</b> ${item.assignee.join(', ')}<br/>`
        : ''
    }
      ${item.category ? `<b>カテゴリ:</b> ${item.category.join(', ')}` : ''}`
    gantt.templates.month_scale_date = (date) => formatMonthScale(date)
    gantt.config.autofit = false
    gantt.config.bar_height = 30
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const formatFirstOfMonth = firstOfMonth.toString('yyyy-MM-dd')
    const formatLastOfMonth = lastOfMonth.toString('yyyy-MM-dd')
    gantt.start_date = formatFirstOfMonth
    gantt.end_date = formatLastOfMonth
    setTimeout(scrollToToday, 500)
    gantt.i18n.setLocale('jp')
    gantt.config.show_progress = false
    gantt.attachEvent('onBeforeTaskDrag', () => false)
    gantt.init(this.ganttContainer)
    gantt.parse(tasks)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.filter !== this.state.filter) {
      this.setState({ filter: nextProps.filter })
    }
    if (nextProps.dateFilter !== this.state.dateFilter) {
      this.setState({ dateFilter: nextProps.dateFilter })
    }
    if (nextProps.nameFilter !== this.state.nameFilter) {
      this.setState({ nameFilter: nextProps.nameFilter })
    }
    if (nextProps.categoryFilter !== this.state.categoryFilter) {
      this.setState({ categoryFilter: nextProps.categoryFilter })
    }
    if (nextProps.assigneeFilter !== this.state.assigneeFilter) {
      this.setState({ assigneeFilter: nextProps.assigneeFilter })
    }
  }

  componentDidUpdate() {
    gantt.refreshData()
  }

  render() {
    return (
      <>
        <div
          className="gantt-chart_G1-3"
          ref={(input) => {
            this.ganttContainer = input
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </>
    )
  }
}

Gantt.propTypes = {
  tasks: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  dateFilter: PropTypes.string.isRequired,
  nameFilter: PropTypes.string.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  assigneeFilter: PropTypes.string.isRequired,
}
export function scrollToToday() {
  const state = gantt.getState()
  const today = new Date()
  let position

  if (state.max_date.getTime() <= today.getTime()) {
    const endDate = gantt.date.add(state.max_date, -1, 'day')
    position = gantt.posFromDate(endDate)
    gantt.scrollTo(position, null)
  } else if (
    state.min_date.getTime() < today.getTime()
    && today.getTime() < state.max_date.getTime()
  ) {
    position = gantt.posFromDate(today)
    const offset = (gantt.$container.offsetWidth - gantt.config.grid_width) / 2
    gantt.scrollTo(position - offset, null)
  }
}
