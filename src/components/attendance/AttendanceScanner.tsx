import { useEffect, useRef, useState } from 'react'
import { Camera, Check, Keyboard, QrCode, RotateCcw, X } from 'lucide-react'
import type { AttendanceRecord } from '@/features/attendance/types'
import { toDateKey } from '@/features/attendance/date'
import { hasAttendanceOnDate } from '@/features/attendance/storage'

type AttendanceScannerProps = {
  records: AttendanceRecord[]
  onCheckIn: (record: AttendanceRecord) => boolean
  onClose: () => void
}

export function AttendanceScanner({
  records,
  onCheckIn,
  onClose,
}: AttendanceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'camera' | 'manual' | 'success' | 'error'>(
    'idle',
  )

  useEffect(
    () => () => streamRef.current?.getTracks().forEach((track) => track.stop()),
    [],
  )

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('error')
      setMessage('Thiết bị không hỗ trợ camera. Nhập mã điểm danh để tiếp tục.')
      return
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current
        await videoRef.current.play()
      }
      setState('camera')
      setMessage(
        'Camera đã mở. QR scanner tự động sẽ kết nối sau khi mã first-party được cấu hình.',
      )
    } catch {
      setState('error')
      setMessage('Không thể mở camera. Kiểm tra quyền truy cập hoặc nhập mã thủ công.')
    }
  }

  function submitManual() {
    const code = manualCode.trim()
    if (!code) {
      setState('error')
      setMessage('Nhập mã điểm danh trước khi xác nhận.')
      return
    }
    const date = toDateKey()
    if (hasAttendanceOnDate(records, date)) {
      setState('error')
      setMessage('Bạn đã điểm danh hôm nay.')
      return
    }
    if (!onCheckIn({ date, location: code, scannedAt: new Date().toISOString() })) {
      setState('error')
      setMessage('Không thể lưu điểm danh. Thử lại.')
      return
    }
    setState('success')
    setMessage('Đã ghi nhận. Giữ nhịp cho ngày tiếp theo.')
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }

  return (
    <section
      className="scanner-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-title"
    >
      <div className="scanner-panel__header">
        <div>
          <p className="section-label">CONTRAST / CHECK IN</p>
          <h2 id="scanner-title">MỞ VIỆC.</h2>
        </div>
        <button
          type="button"
          className="scanner-close"
          onClick={onClose}
          aria-label="Đóng scanner"
        >
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="scanner-view">
        {state === 'success' ? (
          <div className="scanner-state scanner-state--success">
            <Check size={44} aria-hidden="true" />
            <strong>ĐÃ CÓ MẶT.</strong>
            <p>{message}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="scanner-video"
              muted
              playsInline
              aria-label="Khung camera quét mã QR"
            />
            <div className="scanner-reticle" aria-hidden="true" />
            <div className="scanner-hint">
              {state === 'camera' ? 'ĐƯA MÃ QR VÀO KHUNG' : 'MỞ CAMERA HOẶC NHẬP MÃ'}
            </div>
          </>
        )}
      </div>
      <p className="scanner-message" aria-live="polite">
        {message}
      </p>
      <div className="scanner-actions">
        {state !== 'camera' ? (
          <button type="button" className="button button--red" onClick={startCamera}>
            <Camera size={16} aria-hidden="true" /> MỞ CAMERA
          </button>
        ) : null}
        <button
          type="button"
          className="scanner-secondary"
          onClick={() => setState('manual')}
        >
          <Keyboard size={16} aria-hidden="true" /> NHẬP MÃ
        </button>
      </div>
      {state === 'manual' || state === 'error' ? (
        <div className="manual-entry">
          <label htmlFor="attendance-code">MÃ ĐIỂM DANH</label>
          <div>
            <input
              id="attendance-code"
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder="Nhập mã…"
              autoComplete="off"
            />
            <button type="button" className="button button--dark" onClick={submitManual}>
              XÁC NHẬN <QrCode size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="scanner-reset"
        onClick={() => {
          setState('idle')
          setMessage('')
        }}
      >
        <RotateCcw size={14} aria-hidden="true" /> ĐẶT LẠI
      </button>
    </section>
  )
}
