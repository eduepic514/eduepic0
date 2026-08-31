export const SITE_CONFIG = {
  name: "EduEpic",
  domain: "https://www.eduepic.com",
  description:
    "EduEpic is a multilingual knowledge platform delivering high-quality articles on technology, education, lifestyle and business — available in 9 languages.",
  logo: "/logo.svg",
  twitterHandle: "@eduepic",
  socials: {
    facebook: "https://facebook.com/eduepic",
    twitter: "https://twitter.com/eduepic",
    instagram: "https://instagram.com/eduepic",
    linkedin: "https://linkedin.com/company/eduepic",
    youtube: "https://youtube.com/@eduepic",
  },
  gaId: "G-XXXXXXXXXX",
  gtmId: "GTM-XXXXXXX",
  adsenseId: "ca-pub-XXXXXXXXXXXXXXXX",
};

export const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL || "/api/v1";
