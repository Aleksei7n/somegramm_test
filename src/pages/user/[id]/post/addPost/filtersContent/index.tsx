import PhotoSlider from '@/components/photoSlider'
import s from './filtersContents.module.scss'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  images: string[]
}

export const FiltersContent = ({ images }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  console.log(images)
  return (
    <div className={s.container}>
      <PhotoSlider images={images} setCurrentSlide={setCurrentSlide} />
      <div className={s.filtersContainer}>
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
        <Image src={images[currentSlide]} width={108} height={108} alt="image filter" />
      </div>
    </div>
  )
}
