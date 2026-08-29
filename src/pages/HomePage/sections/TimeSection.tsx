const TIME_MARKERS = ['06:00', '12:00', '18:00', '00:00'] as const

export function TimeSection() {
  return (
    <section className="time-section" id="time" aria-labelledby="time-title">
      <div className="time-section__grid">
        <h2 id="time-title">
          GIỜ NÀO CŨNG CÓ THỂ
          <br />
          <span>BẮT ĐẦU.</span>
        </h2>
        <p className="time-section__copy">Cần tập trung, cứ đến Contrast.</p>
      </div>
      <ol className="time-ruler" aria-label="Nhịp một ngày tại Contrast">
        {TIME_MARKERS.map((time, index) => (
          <li className={index === TIME_MARKERS.length - 1 ? 'is-active' : undefined} key={time}>
            {time}
          </li>
        ))}
      </ol>
      <p className="verified-note">Giờ mở cửa xem theo từng cơ sở.</p>
    </section>
  )
}
