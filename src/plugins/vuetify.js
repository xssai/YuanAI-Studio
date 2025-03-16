// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// Translations provided by Vuetify
import { pl, zhHans } from 'vuetify/locale'

import { VDateInput } from 'vuetify/labs/VDateInput' // beta
import { VFileUpload } from 'vuetify/labs/VFileUpload' // beta

export default createVuetify({
  locale: {
    locale: 'zhHans',
    fallback: 'sv',
    messages: { zhHans, pl },
  },
  components: {
    VDateInput,
    VFileUpload
  },
  theme: {
    themes: {
      light: {
        colors: {
          light_custom_blue_1: '#f5f8ff',
          light_custom_blue_2: '#0a6bbe',
          light_custom_white_2: '#ffffff',
          light_custom_black_1: '#d9d9d9',
          light_custom_black_2: '#FAFAFB',
          apply_custom_blue_1: '#f5f8ff',
          light_custom_card_1: '#FAFAFA',
          light_custom_card_2: '#f2f6ff'
        }
      },
      dark: {
        colors: {
          light_custom_blue_2: '#0a6bbe',
          apply_custom_blue_1: '#f5f8ff',
          light_custom_white_2: '#212121',
          light_custom_card_1: '#212121',
          light_custom_card_2: '#424242'
        }
      }
    },
  },
  defaults: {
    global: {
      // size: 'small'
      // x-small、small、default、large 和 x-large。
    }
  },
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  }
})