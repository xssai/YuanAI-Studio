import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
// import emoji from "markdown-it-emoji";
import deflist from "markdown-it-deflist";
import footnote from "markdown-it-footnote";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import container from "markdown-it-container";
import MarkdownItAbbr from 'markdown-it-abbr'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItHighlightjs from 'markdown-it-highlightjs'
import toc from "markdown-it-toc-done-right";

import 'highlight.js/styles/default.css'


const config = {
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: "lang-",
    linkify: false,
    typographer: true,
    quotes: "“”‘’",
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre><code class="hljs">' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) {}
        }

        return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
    }
};

const markdownIt = new MarkdownIt(config);

markdownIt
    .use(mark)
    // .use(emoji)
    .use(deflist)
    .use(footnote)
    .use(ins)
    .use(taskLists)
    .use(MarkdownItHighlightjs)
    .use(MarkdownItAbbr)
    .use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItAnchor)
    .use(container)
    .use(container, "hljs-left")
    .use(container, "hljs-center")
    .use(container, "hljs-right")
    .use(toc)

export default markdownIt;