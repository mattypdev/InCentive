// eslint-disable-next-line @next/next/no-img-element
export default function FlameIcon({ streak = 0, size = 24, className = '' }) {
  const src = streak >= 7 ? '/flame-7.png' : streak >= 3 ? '/flame-3.png' : '/flame-1.png'
  const alt = streak >= 7 ? 'large flame' : streak >= 3 ? 'medium flame' : 'small flame'
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block', flexShrink: 0 }}
    />
  )
}
