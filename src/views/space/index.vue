<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar flat border>
      <back-page/>

      <breadcrumb id="breadcrumb-container" />
    </v-app-bar>

    <v-main>
      <v-container>
        <spaceMain />
      </v-container>
    </v-main>

    <!-- 文件传输窗口 -->
    <file-progress />

    <!-- 视频预览 -->
    <video-player />
  </v-layout>
</template>

<script setup>
import spaceMain from './components/Main.vue'

import BackPage from "./components/BackPage";

import Breadcrumb from '@/components/Breadcrumb'
import FileProgress from "@/components/FileProgress"
import VideoPlayer from '@/components/VideoPlayer'
</script>
