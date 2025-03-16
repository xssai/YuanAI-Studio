<template>
  <v-layout class="w-100" full-height>
    <v-navigation-drawer v-model="showMenuBar" border="0" >
      <template v-slot:prepend>
        <v-row no-gutters>
          <v-col>
            <v-sheet class="pa-2 ma-2" color="transparent">
              <v-btn prepend-icon="mdi-plus" height="42" block rounded="lg">创建新会话</v-btn>
            </v-sheet>
          </v-col>
        </v-row>
      </template>

      <template v-slot:append>

      </template>
    </v-navigation-drawer>

    <v-app-bar flat :absolute="true">
      <title-bar/>
    </v-app-bar>

    <v-main class="overflow-y-auto">
      <message/>
    </v-main>

    <v-footer name="footer" class="pt-0" absolute app>
      <text-input/>
    </v-footer>

  </v-layout>
</template>

<script setup>
import { TextInput, TitleBar, Message} from './components'

import useAppStore from '@/store/modules/app'

const appStore = useAppStore();

const showMenuBar = ref(true);


</script>

<style scoped lang="scss">

</style>