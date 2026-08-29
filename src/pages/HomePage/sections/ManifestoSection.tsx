import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, Check, Circle, Flame, Play, SkipForward, Square, Timer } from 'lucide-react'
import { getAuthRouteDecision } from '@/features/auth/route'
import { supabase } from '@/lib/supabase'

type MusicTrack = { title: string; src: string }
type MockTask = { id: number; label: string; done: boolean }

const MUSIC_TRACKS: MusicTrack[] = []

function openWorkspace(setNotice: (notice: string) => void) {
  void supabase.auth.getUser().then(({ data, error }) => {
    if (error) {
      setNotice('KHÔNG KIỂM TRA ĐƯỢC PHIÊN ĐĂNG NHẬP')
      return
    }

    const decision = getAuthRouteDecision('/workspace', Boolean(data.user))
    window.location.assign(decision === 'allow' ? '/workspace' : decision)
  })
}

const CHECKIN_LEVELS = Array.from({ length: 70 }, (_, index) => {
  const week = Math.floor(index / 7)
  const day = index % 7
  return (week * 2 + day * 3 + (week % 4)) % 5
})

const INITIAL_TASKS: MockTask[] = [
  { id: 1, label: 'Mở outline buổi học', done: true },
  { id: 2, label: 'Đọc phần tài liệu chính', done: false },
  { id: 3, label: 'Viết phần mở đầu', done: false },
]

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sectionVisibleRef = useRef(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [musicNotice, setMusicNotice] = useState('')
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [authNotice, setAuthNotice] = useState('')
  const currentTrack = MUSIC_TRACKS[trackIndex]
  const completedTasks = tasks.filter((task) => task.done).length

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (typeof IntersectionObserver === 'undefined') {
      sectionVisibleRef.current = true
      section.querySelectorAll<HTMLElement>('[data-visible]').forEach((element) => {
        element.dataset.visible = 'true'
      })
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        sectionVisibleRef.current = isVisible
        if (isVisible) {
          setHasEntered(true)
          return
        }

        audioRef.current?.pause()
        setIsPlaying(false)
      },
      { threshold: 0.4 },
    )

    observer.observe(section)

    const audio = audioRef.current
    return () => {
      observer.disconnect()
      audio?.pause()
    }
  }, [])

  const toggleTask = (id: number) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!sectionVisibleRef.current) {
      setMusicNotice('CUỘN ĐẾN KHU NÀY ĐỂ NGHE')
      return
    }
    if (!audio || !currentTrack) {
      setMusicNotice('CHỜ FILE NHẠC')
      return
    }

    setMusicNotice('')
    if (isPlaying) {
      audio.pause()
      return
    }

    void audio.play().catch(() => {
      setIsPlaying(false)
      setMusicNotice('KHÔNG THỂ PHÁT FILE NÀY')
    })
  }

  const nextTrack = () => {
    if (MUSIC_TRACKS.length < 2) {
      setMusicNotice('THÊM FILE ĐỂ CHUYỂN BÀI')
      return
    }

    audioRef.current?.pause()
    setTrackIndex((current) => (current + 1) % MUSIC_TRACKS.length)
    setIsPlaying(false)
    setMusicNotice('')
  }

  const handleTrackEnded = () => {
    if (MUSIC_TRACKS.length < 2) {
      setIsPlaying(false)
      return
    }
    setTrackIndex((current) => (current + 1) % MUSIC_TRACKS.length)
  }

  const musicStatus = isPlaying
    ? 'ĐANG PHÁT'
    : musicNotice || (currentTrack ? 'SẴN SÀNG' : 'CHỜ FILE NHẠC')

  const setTileDelay = (delay: string): CSSProperties => ({ '--tile-delay': delay }) as CSSProperties

  return (
    <section ref={sectionRef} className="manifesto section-dark" id="contrast" aria-labelledby="manifesto-title">
      <h2 className="manifesto__title" id="manifesto-title">
        NGOÀI KIA ỒN.
        <br />
        <span>Ở ĐÂY VÀO VIỆC.</span>
      </h2>
      <div className="manifesto__workbench" data-visible={hasEntered} role="group" aria-label="Bản xem trước workspace">
        <article className="manifesto-tile manifesto-tile--streak" style={setTileDelay('0ms')}>
          <div className="manifesto-tile__topline">
            <span>MOCK / CHUỖI</span>
            <span>HÔM NAY</span>
          </div>
          <div className="manifesto-streak__core">
            <div className="manifesto-streak__badge">
              <Flame size={24} strokeWidth={1.7} aria-hidden="true" />
              <strong>04</strong>
            </div>
            <span>NGÀY LIÊN TIẾP</span>
          </div>
        </article>

        <button
          className="manifesto-tile manifesto-tile--contrast"
          type="button"
          onClick={() => openWorkspace(setAuthNotice)}
          aria-label="Tới ngay Contrast. Workspace yêu cầu đăng nhập."
          style={setTileDelay('70ms')}
        >
          <span className="manifesto-contrast__face" aria-hidden="true">
            Ngoài kia
            <br />
            xô bồ quá
          </span>
          <span className="manifesto-contrast__reveal" aria-hidden="true">
            Tới ngay Contrast <ArrowUpRight size={20} strokeWidth={1.8} />
          </span>
        </button>

        <article className="manifesto-tile manifesto-tile--checkin" style={setTileDelay('140ms')}>
          <div className="manifesto-tile__topline">
            <span>MOCK / CHECK-IN</span>
            <span>NHỊP</span>
          </div>
          <div className="manifesto-checkin" role="img" aria-label="Lịch check-in minh hoạ theo phong cách GitHub">
            <div className="manifesto-checkin__days" aria-hidden="true">
              <span>T2</span>
              <span>T4</span>
              <span>T6</span>
            </div>
            <div className="manifesto-checkin__grid" aria-hidden="true">
              {CHECKIN_LEVELS.map((level, index) => (
                <span className={`manifesto-checkin__cell manifesto-checkin__cell--${level}`} key={`${level}-${index}`} />
              ))}
            </div>
          </div>
        </article>

        <article
          className={`manifesto-tile manifesto-tile--music${isPlaying ? ' is-playing' : ''}`}
          style={setTileDelay('210ms')}
        >
          <div className="manifesto-tile__topline">
            <span>MOCK / MUSIC</span>
            <span>{isPlaying ? 'PLAYING' : 'READY'}</span>
          </div>
          <div className="manifesto-record" aria-hidden="true">
            <div className="manifesto-record__label">C</div>
          </div>
          <div className="manifesto-music__bottom">
            <div className="manifesto-music__track">
              <span>{currentTrack?.title ?? 'FOCUS TAPE / CHỜ NHẠC'}</span>
              <span aria-live="polite">{musicStatus}</span>
            </div>
            <div className="manifesto-music__controls">
              <button
                type="button"
                className="manifesto-music__button"
                onClick={toggleMusic}
                aria-label={isPlaying ? 'Dừng nhạc' : 'Phát nhạc'}
              >
                {isPlaying ? <Square size={16} fill="currentColor" strokeWidth={1.8} /> : <Play size={16} fill="currentColor" strokeWidth={1.8} />}
              </button>
              <button
                type="button"
                className="manifesto-music__button"
                onClick={nextTrack}
                disabled={MUSIC_TRACKS.length < 2}
                aria-label="Bài tiếp theo"
              >
                <SkipForward size={16} fill="currentColor" strokeWidth={1.7} />
              </button>
            </div>
          </div>
          <audio
            ref={audioRef}
            className="manifesto-audio"
            src={currentTrack?.src}
            onEnded={handleTrackEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </article>

        <article className="manifesto-tile manifesto-tile--tasks" style={setTileDelay('280ms')}>
          <div className="manifesto-tile__topline">
            <span>MOCK / TO-DO</span>
            <span>
              {completedTasks}/{tasks.length} XONG
            </span>
          </div>
          <ul className="manifesto-task-list">
            {tasks.map((task) => (
              <li className={task.done ? 'is-done' : ''} key={task.id}>
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`${task.done ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}: ${task.label}`}
                >
                  {task.done ? <Check size={15} strokeWidth={2} aria-hidden="true" /> : <Circle size={15} strokeWidth={1.5} aria-hidden="true" />}
                </button>
                <span>{task.label}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="manifesto-tile manifesto-tile--pomodoro" style={setTileDelay('350ms')}>
          <div className="manifesto-tile__topline">
            <span>MOCK / POMODORO</span>
            <span>FOCUS</span>
          </div>
          <div className="manifesto-pomodoro__core">
            <div className="manifesto-pomodoro__face">
              <Timer size={22} strokeWidth={1.6} aria-hidden="true" />
              <strong>25:00</strong>
              <span>GIỮ MỘT NHỊP</span>
            </div>
          </div>
          <span className="manifesto-pomodoro__note">MỘT ROUND. MỘT VIỆC.</span>
        </article>
      </div>

      <div className="manifesto__cta" data-visible={hasEntered}>
        <div className="manifesto__cta-copy">
          <p>Đăng nhập trước. Sau đó vào workspace để giữ nhịp làm việc.</p>
          {authNotice ? <span className="manifesto__auth-notice" role="status">{authNotice}</span> : null}
        </div>
        <button className="button button--red" type="button" onClick={() => openWorkspace(setAuthNotice)}>
          <span>VÀO WORKSPACE</span>
          <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
