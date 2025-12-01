export interface TwitterCallbackProps {
  callbackType: 'profileVerification' | 'submitSocialTweet' | 'submitSocialAuth',
  buttonText?: string
}