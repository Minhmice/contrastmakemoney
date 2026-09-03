import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Circle, Flame, Play, SkipForward, Square, Timer } from 'lucide-react'

type MusicTrack = { title: string; src: string }

const MUSIC_TRACKS: MusicTrack[] = [
  { title: 'Michael Jackson - Billie Jean', src: '/songs/06 - Michael Jackson - Billie Jean.flac' },
  { title: 'TeuYungBoy - Phòng Số 12', src: '/songs/07 - TeuYungBoy - Phòng Số 12.flac' },
]

function openWorkspace() {
  window.location.assign('/workspace')
}

const CHECKIN_LEVELS = Array.from({ length: 70 }, (_, index) => {
  const week = Math.floor(index / 7)
  const day = index % 7
  return (week * 2 + day * 3 + (week % 4)) % 5
})

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sectionVisibleRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [musicNotice, setMusicNotice] = useState('')
  const currentTrack = MUSIC_TRACKS[trackIndex]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (typeof IntersectionObserver === 'undefined') {
      sectionVisibleRef.current = true
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionVisibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting) {
          audioRef.current?.pause()
          setIsPlaying(false)
        }
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

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!sectionVisibleRef.current) {
      setMusicNotice('Cuộn đến khu này để nghe')
      return
    }
    if (!audio || !currentTrack) {
      setMusicNotice('Chưa có file nhạc')
      return
    }
    setMusicNotice('')
    if (isPlaying) {
      audio.pause()
      return
    }
    void audio.play().catch(() => {
      setIsPlaying(false)
      setMusicNotice('Không thể phát file này')
    })
  }

  const nextTrack = () => {
    audioRef.current?.pause()
    setTrackIndex((current) => (current + 1) % MUSIC_TRACKS.length)
    setIsPlaying(false)
    setMusicNotice('')
  }

  const musicStatus = isPlaying ? 'Đang phát' : musicNotice || 'Sẵn sàng'

  return (
    <section ref={sectionRef} className="manifesto section-dark" id="contrast" aria-labelledby="manifesto-title">
      <header className="manifesto__intro">
        <h2 className="manifesto__title" id="manifesto-title">NGỒI XUỐNG.<br />LÀM TIẾP.</h2>
        <p>Bản xem trước Contrast Workspace. Mở nhạc, gom việc, giữ nhịp cho buổi học này.</p>
      </header>

      <div className="manifesto__workbench" role="group" aria-label="Bản xem trước workspace">
        <article className="manifesto-tile manifesto-tile--streak">
          <div className="manifesto-tile__topline"><span>Chuỗi học</span><span>Minh hoạ</span></div>
          <div className="manifesto-streak__core">
            <div className="manifesto-streak__badge"><Flame size={24} strokeWidth={1.7} aria-hidden="true" /><strong>04</strong></div>
            <span>Ngày liên tiếp</span>
          </div>
        </article>

        <button className="manifesto-tile manifesto-tile--contrast" type="button" onClick={openWorkspace} aria-label="Tới Contrast Workspace">
          <span className="manifesto-contrast__face" aria-hidden="true">Ngoài kia<br />xô bồ quá</span>
          <span className="manifesto-contrast__reveal">Tới Contrast <ArrowUpRight size={20} strokeWidth={1.8} aria-hidden="true" /></span>
        </button>

        <article className="manifesto-tile manifesto-tile--checkin">
          <div className="manifesto-tile__topline"><span>Nhịp học</span><span>10 tuần</span></div>
          <div className="manifesto-checkin" role="img" aria-label="Lịch check-in minh hoạ trong 10 tuần">
            <div className="manifesto-checkin__days" aria-hidden="true"><span>T2</span><span>T4</span><span>T6</span></div>
            <div className="manifesto-checkin__grid" aria-hidden="true">
              {CHECKIN_LEVELS.map((level, index) => <span className={`manifesto-checkin__cell manifesto-checkin__cell--${level}`} key={`${level}-${index}`} />)}
            </div>
          </div>
        </article>

        <article className={`manifesto-tile manifesto-tile--music${isPlaying ? ' is-playing' : ''}`}>
          <div className="manifesto-tile__topline"><span>Nhạc tập trung</span><span>{isPlaying ? 'Đang phát' : 'Sẵn sàng'}</span></div>
          <div className="manifesto-turntable" aria-hidden="true"><div className="manifesto-record"><div className="manifesto-record__label">C</div></div></div>
          <div className="manifesto-music__bottom">
            <div className="manifesto-music__track"><span>{currentTrack.title}</span><span aria-live="polite">{musicStatus}</span></div>
            <div className="manifesto-music__controls">
              <button type="button" className="manifesto-music__button" onClick={toggleMusic} aria-label={isPlaying ? 'Dừng nhạc' : 'Phát nhạc'}>{isPlaying ? <Square size={16} fill="currentColor" strokeWidth={1.8} /> : <Play size={16} fill="currentColor" strokeWidth={1.8} />}</button>
              <button type="button" className="manifesto-music__button" onClick={nextTrack} aria-label="Bài tiếp theo"><SkipForward size={16} fill="currentColor" strokeWidth={1.7} /></button>
            </div>
          </div>
          <audio ref={audioRef} className="manifesto-audio" src={currentTrack.src} onEnded={nextTrack} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        </article>

        <article className="manifesto-tile manifesto-tile--tasks">
          <div className="manifesto-tile__topline"><span>Việc đang làm</span><span>Minh hoạ</span></div>
          <ul className="manifesto-task-list">
            <li className="is-done"><Check size={18} strokeWidth={2} aria-hidden="true" /><span>Mở outline buổi học</span></li>
            <li><Circle size={18} strokeWidth={1.6} aria-hidden="true" /><span>Đọc phần tài liệu chính</span></li>
            <li><Circle size={18} strokeWidth={1.6} aria-hidden="true" /><span>Viết phần mở đầu</span></li>
          </ul>
        </article>

        <article className="manifesto-tile manifesto-tile--pomodoro">
          <div className="manifesto-tile__topline"><span>Phiên tập trung</span><span>25 phút</span></div>
          <div className="manifesto-pomodoro__core"><div className="manifesto-pomodoro__face"><Timer size={22} strokeWidth={1.6} aria-hidden="true" /><strong>25:00</strong><span>Giữ một nhịp</span></div></div>
          <span className="manifesto-pomodoro__note">Một round. Một việc.</span>
        </article>
      </div>
    </section>
  )
}
