type ContrastLogoVariant = 'lockup' | 'wordmark-light' | 'wordmark-dark'

const LOGO_SRC: Record<ContrastLogoVariant, string> = {
  lockup: '/logo/contrast-logo-lockup.svg',
  'wordmark-light': '/logo/contrast-wordmark-light.svg',
  'wordmark-dark': '/logo/contrast-wordmark-dark.svg',
}

// Must track each asset's viewBox ratio, otherwise the reserved space is the
// wrong shape until the SVG loads.
const LOGO_SIZE: Record<ContrastLogoVariant, { width: number; height: number }> = {
  lockup: { width: 170, height: 170 },
  'wordmark-light': { width: 170, height: 22 },
  'wordmark-dark': { width: 170, height: 22 },
}

type ContrastLogoProps = {
  variant?: ContrastLogoVariant
  className?: string
  alt?: string
}

export function ContrastLogo({
  variant = 'lockup',
  className,
  alt = 'Contrast Coffee',
}: ContrastLogoProps) {
  return (
    <img
      src={LOGO_SRC[variant]}
      alt={alt}
      className={className}
      width={LOGO_SIZE[variant].width}
      height={LOGO_SIZE[variant].height}
      decoding="async"
      draggable={false}
    />
  )
}
