import { useMemo, useState } from 'react'
import {
  contacts,
  phoneCalls,
  navigationHistory,
  weatherCards,
  youtubeVideos,
  xPosts,
  instagramPosts,
  memoNotes,
  photoGrid,
  contactSummary,
  naverSearches,
  appGrid,
  kindOfData
} from './data/mockData'

type AppName =
  | 'home'
  | 'phone'
  | 'messages'
  | 'kakao'
  | 'camera'
  | 'photos'
  | 'youtube'
  | 'x'
  | 'memo'
  | 'instagram'
  | 'weather'
  | 'naver'

type ChatBubble = {
  id: string
  sender: 'me' | 'them'
  text: string | string[]
  time: string
  dateLabel?: string
  messageType?: 'normal' | 'call' | 'recalled' | 'system'
  readStatus?: 'read' | 'unread' | 'sending'
  direction?: 'outgoing' | 'incoming'
  status?: 'missed' | 'answered' | 'outgoing'
  callDuration?: string
  isSpacer?: boolean
}

const passcode = '0420'

const appConfigs = {
  phone: { label: '전화', icon: '📞' },
  messages: { label: '문자', icon: '💬' },
  kakao: { label: 'KakaoTalk', icon: '💬' },
  camera: { label: '카메라', icon: '📷' },
  photos: { label: '사진', icon: '🖼️' },
  youtube: { label: 'YouTube', icon: '▶️' },
  x: { label: 'X', icon: '𝕏' },
  memo: { label: '메모', icon: '📝' },
  instagram: { label: 'Instagram', icon: '📸' },
  weather: { label: '날씨', icon: '☀️' }
} as const

export default function App() {
  const [isLocked, setIsLocked] = useState(true)
  const [passcodeInput, setPasscodeInput] = useState('')
  const [error, setError] = useState('')
  const [activeApp, setActiveApp] = useState<AppName>('home')
  const [selectedContactId, setSelectedContactId] = useState('oo')
  const [currentAppMessage, setCurrentAppMessage] = useState('')

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedContactId) ?? contacts[0],
    [selectedContactId]
  )

  const handleDigit = (digit: string) => {
    if (passcodeInput.length >= 4) return
    const next = passcodeInput + digit
    setPasscodeInput(next)
    setError('')
    if (next.length === 4) {
      if (next === passcode) {
        setIsLocked(false)
        setPasscodeInput('')
        setError('')
      } else {
        setError('잘못된 비밀번호입니다.')
        setTimeout(() => setPasscodeInput(''), 500)
      }
    }
  }

  const handleDelete = () => {
    setPasscodeInput((prev) => prev.slice(0, -1))
    setError('')
  }

  const renderHomeScreen = () => (
    <div className="screen home-screen">
      <div className="status-bar">
        <span>9:41</span>
        <div className="status-icons">
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </div>
      </div>
      <div className="home-grid">
        {appGrid.map((app) => (
          <button
            key={app.id}
            className="app-icon"
            onClick={() => setActiveApp(app.id as AppName)}
          >
            <span className="app-emoji">{app.icon}</span>
            <span>{app.label}</span>
          </button>
        ))}
      </div>
      <div className="home-indicator" />
    </div>
  )

  const renderPhoneScreen = () => (
    <div className="screen app-screen phone-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>전화</span>
        <button>＋</button>
      </div>
      <div className="phone-tabs">
        <span className="active">최근</span>
        <span>연락처</span>
        <span>키패드</span>
      </div>
      <div className="phone-list">
        {phoneCalls.map((item) => (
          <div key={item.id} className="phone-item">
            <div className="person">
              <span className="avatar">{item.avatar}</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.time}</small>
              </div>
            </div>
            <div className={`call-state ${item.type}`}>
              {item.type === 'missed' ? '부재중' : '통화'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMessagesScreen = () => (
    <div className="screen app-screen message-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>문자</span>
        <button>✎</button>
      </div>
      <div className="sms-list">
        {contacts.map((contact) => (
          <div key={contact.id} className="sms-thread" onClick={() => setSelectedContactId(contact.id)}>
            <div className="avatar">{contact.avatar}</div>
            <div className="text">
              <strong>{contact.name}</strong>
              <small>{contact.messages[contact.messages.length - 1]?.text}</small>
            </div>
            <span>{contact.messages[contact.messages.length - 1]?.time}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderKakaoScreen = () => {
    const bubbleRows: ChatBubble[] = selectedContact.messages
    const rendered: React.ReactNode[] = []

    for (let index = 0; index < bubbleRows.length; index += 1) {
      const item = bubbleRows[index]
      const prev = bubbleRows[index - 1]

      if (item.dateLabel && (!prev || prev.dateLabel !== item.dateLabel)) {
        rendered.push(
          <div key={`${item.id}-date`} className="date-divider">
            {item.dateLabel}
          </div>
        )
      }

      const isMine = item.sender === 'me'
      const textContent = Array.isArray(item.text) ? item.text.join('\n') : item.text

      rendered.push(
        <div key={item.id} className={`chat-row ${isMine ? 'mine' : 'theirs'}`}>
          {!isMine && <div className="bubble-avatar">{selectedContact.avatar}</div>}
          <div className={`bubble-wrap ${item.messageType || 'normal'} ${isMine ? 'mine' : 'theirs'}`}>
            {item.messageType === 'call' && (
              <div className="call-card">
                <div className="call-left">📞</div>
                <div className="call-info">
                  <strong>{item.direction === 'outgoing' ? '통화' : '수신 통화'}</strong>
                  <small>{item.callDuration}</small>
                </div>
              </div>
            )}
            {item.messageType === 'recalled' && (
              <div className="recalled-bubble">삭제된 메시지입니다.</div>
            )}
            {item.messageType !== 'call' && item.messageType !== 'recalled' && (
              <div className="bubble-text">{textContent}</div>
            )}
            <div className="bubble-meta">
              <span>{item.time}</span>
              {isMine && item.readStatus === 'read' && <span>읽음</span>}
              {isMine && item.readStatus === 'unread' && <span>안읽음</span>}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="screen app-screen kakao-screen">
        <div className="nav-bar kakao-header">
          <button onClick={() => setActiveApp('home')}>⌂</button>
          <span>{selectedContact.name}</span>
          <button>⋯</button>
        </div>
        <div className="chat-body">{rendered}</div>
        <div className="chat-input-row">
          <input
            value={currentAppMessage}
            onChange={(e) => setCurrentAppMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
          />
          <button onClick={() => setCurrentAppMessage('')}>전송</button>
        </div>
      </div>
    )
  }

  const renderCameraScreen = () => (
    <div className="screen app-screen camera-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>카메라</span>
        <button>⚙️</button>
      </div>
      <div className="camera-capture" />
      <div className="camera-shutter">◉</div>
    </div>
  )

  const renderPhotosScreen = () => (
    <div className="screen app-screen photos-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>사진</span>
        <button>＋</button>
      </div>
      <div className="photo-grid">
        {photoGrid.map((src, idx) => (
          <div key={`${src}-${idx}`} className="photo-tile" />
        ))}
      </div>
    </div>
  )

  const renderYoutubeScreen = () => (
    <div className="screen app-screen youtube-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>YouTube</span>
        <button>⌕</button>
      </div>
      <div className="video-grid">
        {youtubeVideos.map((video) => (
          <div className="video-card" key={video.id}>
            <div className="video-thumb" />
            <strong>{video.title}</strong>
            <small>{video.meta}</small>
          </div>
        ))}
      </div>
    </div>
  )

  const renderXScreen = () => (
    <div className="screen app-screen x-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>X</span>
        <button>✎</button>
      </div>
      <div className="timeline">
        {xPosts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-head">
              <span className="avatar-x">{post.avatar}</span>
              <div>
                <strong>{post.name}</strong>
                <small>{post.handle}</small>
              </div>
            </div>
            <p>{post.text}</p>
            <div className="post-actions">
              <span>💬 {post.comments}</span>
              <span>🔁 {post.reposts}</span>
              <span>♡ {post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMemoScreen = () => (
    <div className="screen app-screen memo-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>메모</span>
        <button>✎</button>
      </div>
      <div className="memo-list">
        {memoNotes.map((note) => (
          <div key={note.id} className="memo-item">
            <strong>{note.title}</strong>
            <p>{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderInstagramScreen = () => (
    <div className="screen app-screen instagram-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>Instagram</span>
        <button>✉️</button>
      </div>
      <div className="stories">
        {instagramPosts.map((post) => (
          <div key={post.id} className="story-dot" />
        ))}
      </div>
      <div className="feed">
        {instagramPosts.map((post) => (
          <div key={`${post.id}-feed`} className="post-feed">
            <div className="feed-head">
              <span>{post.author}</span>
              <span>···</span>
            </div>
            <div className="feed-image" />
            <div className="feed-caption">{post.caption}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderWeatherScreen = () => (
    <div className="screen app-screen weather-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>날씨</span>
        <button>⇅</button>
      </div>
      <div className="weather-stack">
        {weatherCards.map((day) => (
          <div key={day.id} className="weather-card">
            <strong>{day.day}</strong>
            <div className="weather-emoji">{day.icon}</div>
            <span>{day.temp}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNaverScreen = () => (
    <div className="screen app-screen naver-screen">
      <div className="nav-bar">
        <button onClick={() => setActiveApp('home')}>⌂</button>
        <span>Naver</span>
        <button>⌕</button>
      </div>
      <div className="naver-box">
        <div className="naver-searchbar">검색어를 입력하세요</div>
        <ul className="search-history">
          {naverSearches.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'phone':
        return renderPhoneScreen()
      case 'messages':
        return renderMessagesScreen()
      case 'kakao':
        return renderKakaoScreen()
      case 'camera':
        return renderCameraScreen()
      case 'photos':
        return renderPhotosScreen()
      case 'youtube':
        return renderYoutubeScreen()
      case 'x':
        return renderXScreen()
      case 'memo':
        return renderMemoScreen()
      case 'instagram':
        return renderInstagramScreen()
      case 'weather':
        return renderWeatherScreen()
      case 'naver':
        return renderNaverScreen()
      default:
        return renderHomeScreen()
    }
  }

  return (
    <div className="page-shell">
      <div className="iphone-frame">
        <div className="camera-notch" />
        <div className="screen-area">
          {isLocked ? (
            <div className="screen lock-screen">
              <div className="wallpaper glow" />
              <div className="time-large">04:20</div>
              <div className="passcode-box">
                {[0, 1, 2, 3].map((index) => (
                  <span key={index} className={passcodeInput[index] ? 'filled' : ''} />
                ))}
              </div>
              {error && <div className="error-text">{error}</div>}
              <div className="keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((item, idx) => (
                  <button
                    key={`${item}-${idx}`}
                    className="keypad-btn"
                    disabled={item === ''}
                    onClick={() => {
                      if (item === '⌫') handleDelete()
                      else if (item) handleDigit(item)
                    }}
                  >
                    {item || ''}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            renderActiveApp()
          )}
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  )
}
