<template>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <div v-html="markdownText"></div>
      </v-col>
    </v-row>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt();
const markdownText = markdown.render('# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!# markdown-it rulezz!'); //传入文本



</script>

<style scoped lang="scss">

</style>