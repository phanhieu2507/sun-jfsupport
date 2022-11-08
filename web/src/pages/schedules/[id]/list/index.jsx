import React, { useEffect, useState } from 'react'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import './style.scss'
import { Tooltip } from 'antd'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ArrowDownOutlined } from '@ant-design/icons'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/effect-flip/effect-flip.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
import { useRouter } from 'next/router'
import { getScheduleList } from '../../../../api/schedule-detail'
import ScheduleDetailHeader from '../../../../components/schedule-detail-list'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const TemplateTaskCard = (task) => (
  <div className="task-link">
    <div
      className="task-hover task shadow-slate-400 px-4 py-4 w-full bg-white"
      style={{
        boxShadow: 'rgba(100, 100, 111, 0.3) 0px 1px 6px 2px',
      }}
    >
      <div className="flex row justify-between items-start">
        <a
          href={`/template-tasks/${task.id}`}
          className="inline-block font-bold cursor-text py-1 task-name col w-5/6 text-lg mb-0"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          {task.name}
        </a>
        <span
          className="inline-block text-sm cursor-text effort col whitespace-nowrap text-lg leading-9"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          {`${task.duration}日`}
        </span>
      </div>
      <div className="flex flex-wrap justify-between items-center">
        {task.categories.map((category) => (
          <Tooltip
            className="category rounded border-2 border-gray-400 px-4 py-2 my-2 whitespace-nowrap overflow-hidden text-ellipsis text-center w-5/12"
            title={category.category_name}
            color="#333"
            overlayInnerStyle={{
              color: '#fff',
            }}
          >
            {category.category_name}
          </Tooltip>
        ))}
      </div>
    </div>
  </div>
)

function ScheduleDetail() {
  const [milestones, setMilestones] = useState([])
  const router = useRouter()
  const [id, setID] = useState(0)
  const [currentURL, setCurrentURL] = useState('')
  const [isHalfViewport, setIsHalfViewport] = useState(false)

  const updatePredicate = () => {
    setIsHalfViewport(window.innerWidth > 1450)
  }
  useEffect(() => {
    setIsHalfViewport(window.innerWidth > 1450)
    window.addEventListener('resize', updatePredicate)
  }, [])
  useEffect(() => {
    setCurrentURL(window.location.href.toString())
    setID(router.query.id)
  }, [currentURL])

  const getScheduleDetail = async (scheduleId) => {
    try {
      const { data } = await getScheduleList(scheduleId)
      setMilestones(data)
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }

  useEffect(() => {
    getScheduleDetail(router.query.id)
  }, [])

  const getTaskById = (listTask, taskId) => listTask.find((task) => task.id === taskId)

  const toggleShowChildTask = (e, parentTaskId) => {
    const parentTask = document.querySelector(`.parent-task-${parentTaskId}`)

    if (e.currentTarget.style.transform === 'rotate(180deg)') {
      e.currentTarget.style.transform = ''
      parentTask.classList.remove('on-mounted')
      parentTask.classList.remove('my-4')
      setTimeout(() => {
        parentTask.classList.add('absolute')
      }, 500)
    } else {
      e.currentTarget.style.transform = 'rotate(180deg)'
      parentTask.classList.add('on-mounted')
      parentTask.classList.add('my-4')
      parentTask.classList.remove('absolute')
    }
  }

  return (
    <div className="app pb-4 w-full">
      {currentURL.includes('list') ? <ScheduleDetailHeader id={id} /> : null}
      <div>
        <Swiper
          spaceBetween={40}
          allowTouchMove={false}
          slidesPerView={isHalfViewport ? 4 : 2}
          navigation
          style={{ paddingRight: '45px', paddingLeft: '45px', height: '700px' }}
          id="swiper"
        >
          {milestones.map((milestone) => (
            <SwiperSlide
              className="px-6 py-4 mt-2 shadow-slate-100 bg-white overflow-y-scroll  overflow-x-hidden"
              style={{
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                height: '680px',
                'border-radius': '10px',
              }}
            >
              <div className="flex justify-between">
                <div className="font-bold text-2xl">{milestone.name}</div>
                <span className="items-center whitespace-nowrap text-lg">
                  {milestone?.duration ? milestone.duration : '1'}
                  {'日'}
                </span>
              </div>
              {milestone.tasks.map((task) => {
                if (task.is_parent) {
                  return (
                    <div
                      data-value={task.id}
                      className="shadow-slate-400 drop-shadow-2xl px-4 py-4 mt-8 rounded-sm bg-white"
                      style={{
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 1px 6px 4px',
                      }}
                    >
                      <div className="parent-task-title flex justify-between items-center mb-4">
                        <div className="break-words text-center cursor-text font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                          {task.name}
                        </div>
                        <span
                          className="inline-block text-sm cursor-text effort col text-lg leading-5"
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                        >
                          {milestone?.duration ? milestone.duration : '1'}
                          {'日'}
                        </span>
                      </div>
                      <div
                        className={`invisible absolute justify-between items-center parent-task-${task.id} opacity-0 h-0 my-4`}
                      >
                        <div className="text-base pb-4">子タスクリスト</div>
                        <ul className="ml-5">
                          {task.children.map((childId) => {
                            const childTask = getTaskById(
                              milestone.tasks,
                              childId,
                            )
                            return (
                              <li className="mb-3">
                                <div className="flex justify-between items-center">
                                  <Tooltip
                                    className="rounded w-5/6 whitespace-nowrap overflow-hidden text-ellipsis text-left"
                                    title={childTask.name}
                                    color="#333"
                                    overlayInnerStyle={{
                                      color: '#fff',
                                    }}
                                  >
                                    <a href={`/template-tasks/${task.id}`}>
                                      {childTask.name}
                                    </a>
                                  </Tooltip>
                                  <span
                                    className="text-sm cursor-text effort col"
                                    onClick={(e) => {
                                      e.preventDefault()
                                    }}
                                  >
                                    {`${childTask.duration}日`}
                                  </span>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      <div className="flex flex-wrap justify-between items-center">
                        {task.categories.map((category) => (
                          <Tooltip
                            className="category rounded border-2 border-gray-400 px-4 py-2 mt-2 whitespace-nowrap overflow-hidden text-ellipsis text-center w-5/12"
                            title={category.category_name}
                            color="#333"
                            overlayInnerStyle={{
                              color: '#fff',
                            }}
                          >
                            {category.category_name}
                          </Tooltip>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <ArrowDownOutlined
                          className="text-xl mt-2 -mr-2"
                          onClick={(e) => toggleShowChildTask(e, task.id)}
                        />
                      </div>
                    </div>
                  )
                }
                if (!task.is_child) {
                  return TemplateTaskCard(task)
                }
                return null
              })}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
ScheduleDetail.middleware = ['auth:superadmin', 'auth:member']
export default ScheduleDetail
