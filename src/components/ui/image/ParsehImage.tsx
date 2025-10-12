import Image, { StaticImageData } from 'next/image'

interface ParsehImageProps {
  imgSrc: string | StaticImageData
  imgAlt: string
  height?: string
  width?: string
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
}

const ParsehImage: React.FC<ParsehImageProps> = ({
  imgSrc,
  imgAlt,
  height = 'auto',
  width = 'auto',
  className = '',
  objectFit = 'contain',
  priority = false,
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height,
        width,
      }}
    >
      <Image
        src={imgSrc}
        alt={imgAlt}
        fill={height !== 'auto' || width !== 'auto'}
        style={{
          objectFit,
        }}
        priority={priority}
      />
    </div>
  )
}

export default ParsehImage

