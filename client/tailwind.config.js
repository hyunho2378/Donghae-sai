/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    screens: {
      'xs':  '360px',
      'sm':  '640px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px'
    },
    extend: {
      fontFamily: {
        pretendard: ['"Pretendard Variable"', '"Pretendard"']
      },
      colors: {
        bg: {
          card: '#FAFAFA',
          mute: '#F5F5F5'
        },
        text: {
          pri: '#000000',
          strong: '#171719',
          sec: '#333333',
          meta: '#6B6B6E',
          ter: '#979799'
        },
        // 동해 블루 주색. 브랜드 가이드 확정값
        primary: {
          DEFAULT: '#4AB8CD',
          hover: '#3699AE',
          soft: '#E8F6F9'
        },
        // 무코 레드 강조색. 캐릭터 무코의 색. 필수 배지와 강조 포인트
        accent: {
          DEFAULT: '#FC5048',
          hover: '#E23B33',
          soft: '#FFECEA'
        },
        border: {
          sub: '#EAEAEA',
          def: '#DCDCDC'
        }
      },
      boxShadow: {
        // KAREUM_MIRROR 1-1. 카드 깊이용 옅은 그림자 한 종
        card: '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px'
      },
      spacing: {
        18: '72px'
      },
      maxWidth: {
        page: '1400px',
        wide: '1600px',
        text: '720px'
      }
    }
  },
  plugins: []
}
