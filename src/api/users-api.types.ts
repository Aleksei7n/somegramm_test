export type GetProfileSuccess = UserProfile & {
  email: string
  avatar: {
    url: string
  }
}

export type UploadAvatarSuccess = {
  statusCode: number
}

export type UploadAvatarResponse422 = {
  statusCode: number
  message: string
  errors: [
    {
      property: string
      constraints: {
        isAvatarMimetype: string
      }
    },
  ]
}

export type UploadAvatarResponse = UploadAvatarSuccess & UploadAvatarResponse422

export type UserProfile = {
  userName: string
  firstName: string
  lastName: string
  dateOfBirth: string
  about: string
  city: string
  country: string
}