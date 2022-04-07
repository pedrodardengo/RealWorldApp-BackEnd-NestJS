export const USER_MESSAGES = {
  EMAIL_ALREADY_EXISTS: (email: string) => `The email ${email} is already in use`,
  USERNAME_ALREADY_EXISTS: (username: string) => `The username ${username} is already in use`,
  USER_NOT_FOUND: "User not found."
}

export const ARTICLE_MESSAGES = {
  ARTICLE_NOT_FOUND: (slug: string) => `The Article with slug ${slug} was not found`,
  TITLE_ALREADY_EXISTS: (title: string) => `The title ${title} provided for the article already exists`
}

export const AUTH_MESSAGES = {
  UNAUTHORIZED_CREDENTIALS: "Unauthorized: Email or password incorrect",
  NOT_THE_AUTHOR: "You need to be the author of this in order to perform this action"
}
