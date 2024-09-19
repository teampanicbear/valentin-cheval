export const loadImage = (url, callback) => {
  let image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
};

export const loadImages = (urls, callback) => {
  let images = [];
  let imagesToLoad = urls.length;

  // Called each time an image finished loading.
  let onImageLoad = function () {
    --imagesToLoad;
    // If all the images are loaded call the callback.
    if (imagesToLoad === 0) {
      callback(images);
    }
  };

  for (let ii = 0; ii < imagesToLoad; ++ii) {
    let image = loadImage(urls[ii], onImageLoad);
    images.push(image);
  }
};
