import { PlusSquareOutline } from '@honor-ui/inctagram-ui-kit'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import style from '@/pages/auth/logOut/logOut.module.scss'
import { ChangeEvent, useMemo, useState } from 'react'
import { useAddUserPostsMutation } from '@/api/post/posts-api'
import { useGetProfileQuery } from '@/api/user/users-api'
import { useGetCountriesListQuery } from '@/api/countries/countries-api'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { toast } from 'react-toastify'
import AddPhotoContent from './addPhotoContent'
import CroppingContent from './croppingContent'
import PublicationContent from './publicationContent'
import CloseContent from './closeContent'
import { Loader } from '@/components/loader'
import { MAX_POST_IMGE_SIZE_20MB } from '@/shared/const/sizes'
import { FiltersContent } from './filtersContent'

type Props = {
  setIsActiveCreate: (isActiveCreate: boolean) => void
}

const DialogAddUserPost = ({ setIsActiveCreate }: Props) => {
  const [
    sendPost,
    { isLoading: isCreateLoading, isSuccess: isCreateSuccess, isError: isCreateError },
  ] = useAddUserPostsMutation()
  const { data: profileInfo } = useGetProfileQuery()
  const { data, error, isLoading } = useGetCountriesListQuery()

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [errorUpload, setErrorUpload] = useState('')
  const [publicPost, setPublicPost] = useState(false)
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)

  const MAX_CHARS = 500

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }))
    }
    return []
  }, [data, isLoading, error])

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.currentTarget.files
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles)
      validateFiles(newFiles)
    }
  }

  const validateFiles = (uploadedFiles: File[]) => {
    const validFiles: File[] = []
    for (const file of uploadedFiles) {
      if (file.size > MAX_POST_IMGE_SIZE_20MB) {
        resetFile('The photo must be less than 20 Mb and have JPEG or PNG format')
        return
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        resetFile('Error! The format of the uploaded photo must be PNG or JPEG')
        return
      }
      validFiles.push(file)
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles])
    setImages(prevImages => [...prevImages, ...validFiles.map(file => URL.createObjectURL(file))])
    setErrorUpload('')
  }

  const resetFile = (errorMessage: string) => {
    setImages([])
    setErrorUpload(errorMessage)
  }

  const handlePublish = () => {
    if (files.length > 0) {
      sendPost({ files, description })
      resetPostState()
    }
  }

  const resetPostState = () => {
    setFiles([])
    setImages([])
    setPublicPost(false)
    setDescription('')
    setIsFirstModalOpen(false)
    setIsActiveCreate(false)
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    const updatedFiles = [...files]
    updatedImages.splice(index, 1)
    updatedFiles.splice(index, 1)
    setImages(updatedImages)
    setFiles(updatedFiles)
  }

  const handleCloseFirstModal = () => {
    setIsFirstModalOpen(false)
    setIsActiveCreate(false)
    setIsSecondModalOpen(false)
  }

  const handleReturnToFirstModal = () => {
    setIsSecondModalOpen(false)
  }

  const handleFirstModalOpenChange = (isFirstModalOpen: boolean) => {
    if (!isFirstModalOpen) {
      setIsSecondModalOpen(true)
      return
    }
    setIsFirstModalOpen(isFirstModalOpen)
    setIsActiveCreate(true)
  }

  const handleCustomBtnClickBack = () => {
    setIsSecondModalOpen(true)
  }

  if (isCreateLoading) return <Loader />
  if (isCreateSuccess && !toast.isActive('toast-id')) {
    toast.success('Successfully published', { toastId: 'toast-id' })
  }
  if (isCreateError) {
    toast.error('Publish failed')
  }
  return (
    <div>
      <Dialog open={isFirstModalOpen} onOpenChange={handleFirstModalOpenChange}>
        <DialogTrigger className={style.triggerButton}>
          <PlusSquareOutline /> Create
        </DialogTrigger>
        {images.length === 0 ? (
          <DialogContent title={'Add Photo'}>
            <AddPhotoContent errorUpload={errorUpload} handleUpload={handleUpload} />
          </DialogContent>
        ) : (
          !isFiltersModalOpen && (
            <DialogContent
              customTitle={'Cropping'}
              customBtn={'Next'}
              onCustomBtnClickGo={() => setIsFiltersModalOpen(true)}
              onCustomBtnClickBack={handleCustomBtnClickBack}
            >
              <CroppingContent
                handleUpload={handleUpload}
                images={images}
                removeImage={removeImage}
              />
            </DialogContent>
          )
        )}
        {isFiltersModalOpen && (
          <DialogContent
            customTitle={'Filters'}
            customBtn={'Next'}
            onCustomBtnClickGo={() => setPublicPost(true)}
            onCustomBtnClickBack={() => setIsFiltersModalOpen(false)}
          >
            <FiltersContent images={images} />
          </DialogContent>
        )}
        {publicPost && profileInfo && (
          <DialogContent
            customTitle={'Publication'}
            customBtn={'Publish'}
            onCustomBtnClickGo={handlePublish}
            onCustomBtnClickBack={() => setPublicPost(false)}
          >
            <PublicationContent
              MAX_CHARS={MAX_CHARS}
              description={description}
              images={images}
              optionsCountry={optionsCountry}
              profileInfo={profileInfo}
              setDescription={setDescription}
            />
          </DialogContent>
        )}
      </Dialog>
      <Dialog open={isSecondModalOpen} onOpenChange={setIsSecondModalOpen}>
        <DialogContent title={'Close'}>
          <CloseContent
            handleCloseFirstModal={handleCloseFirstModal}
            handleReturnToFirstModal={handleReturnToFirstModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DialogAddUserPost
