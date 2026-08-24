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
        primary: {
          DEFAULT: '#60A5FA',
          hover: '#3B82F6',
          soft: '#EFF6FF'
        },
        border: {
          sub: '#EAEAEA',
          def: '#DCDCDC'
        }
      },
      boxShadow: {
        // KAREUM_MIRROR 1-1. 허용된 유일한 그림자 토큰이다. 임의 그림자 금지
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
