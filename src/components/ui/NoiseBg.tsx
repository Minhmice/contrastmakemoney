type NoiseBgProps = {
  className?: string
}

export function NoiseBg({ className = '' }: NoiseBgProps) {
  return (
    <div
      className={`noise-bg is-ready${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  )
}
