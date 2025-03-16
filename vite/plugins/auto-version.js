import autoVersion from "vite-plugin-auto-version";

export default function createAutoVersion() {
    return autoVersion({ 
        insertCheck: true, 
        refreshTime: 10 * 60 * 1000 
    })
}
