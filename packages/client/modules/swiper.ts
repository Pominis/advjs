import type { UserModule } from '@advjs/client/types'

// import Swiper core and required modules
// import 'swiper/css/navigation'
import SwiperCore from 'swiper'
import { EffectCreative } from 'swiper/modules'

import { Swiper, SwiperSlide } from 'swiper/vue'
// Import Swiper Vue.js components
// Import Swiper styles in main
import 'swiper/css'

import 'swiper/css/effect-creative'

export const install: UserModule = ({ app }) => {
  SwiperCore.use([EffectCreative])
  app.component('VSwiper', Swiper)
  app.component('VSwiperSlide', SwiperSlide)
}
