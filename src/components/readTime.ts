export function calcReadTime(text: string){
    const textContent = text || '';
    const wordsPerMinute = 225;
    const textLength = textContent.trim().split(/\s+/).length;
    const ret = Math.ceil(textLength / wordsPerMinute);
    if (ret > 35) {
        return '5';
    } else {
        return ret;
    }
}