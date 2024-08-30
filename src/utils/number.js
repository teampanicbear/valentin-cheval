export const clamp = (number, lower, upper) => {
    if (number === number) {
      if (upper !== undefined) {
        number = number <= upper ? number : upper;
      }
      if (lower !== undefined) {
        number = number >= lower ? number : lower;
      }
    }
    return number;
}

export const cvUnit = (val, unit) => {
  let result;
  switch (true) {
      case unit === 'vw':
          result = window.innerWidth * (val / 100);
          break;
      case unit === 'vh':
          result = window.innerHeight * (val / 100);
          break;
      case unit === 'rem':
          result = val / 10 * parseFloat(document.querySelector('html').computedStyleMap().get('font-size').value);
          break;
      default: break;
  }
  return result;
}

export const lerp = (a, b, t = 0.08) => {
  return a + (b - a) * t;
}

export const percentage = (percent, total) => ((percent / 100) * total).toFixed(2);

export const inView = (el) => {
  if (document.body.contains(el)) {
    // el is in the DOM
    if (0 <= el.getBoundingClientRect().bottom && el.getBoundingClientRect().top <= window.innerHeight) {
      return true
    }
  }
	
}