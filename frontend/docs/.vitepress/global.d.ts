export {};

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
    grecaptcha: any;
    adsenseLoaded: boolean;
  }
}
