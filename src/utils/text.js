export const truncateText = (text, maxLines) => {
    const hiddenMeasurer = document.getElementById('hidden-measurer');
    hiddenMeasurer.style.fontSize = fontSize;
    hiddenMeasurer.style.fontFamily = fontFamily;

    // Calculate the height of a single line of text
    hiddenMeasurer.textContent = 'A';
    const singleLineHeight = hiddenMeasurer.offsetHeight;

    const maxHeight = singleLineHeight * maxLines;
    hiddenMeasurer.textContent = '';
    let truncatedText = '';

    for (let i = 0; i < text.length; i++) {
        hiddenMeasurer.textContent += text[i];
        if (hiddenMeasurer.offsetHeight > maxHeight) {
        truncatedText = hiddenMeasurer.textContent.slice(0, -1) + '...';
        break;
        }

        truncatedText = hiddenMeasurer.textContent;
    }

    return truncatedText;
}

export const breakText = (text) => {
    const lines = text.trim().split('\n');

    return lines.reduce((acc, item, idx) => `${acc}${item}${idx < lines.length - 1 ? '<br/>' : ''}`, '').trim()
}

export const trim = (str = '', ch) => {
    let start = 0,
    end = str.length || 0;
    while (start < end && str[start] === ch) ++start;
    while (end > start && str[end - 1] === ch) --end;
    return start > 0 || end < str.length ? str.substring(start, end) : str;
};