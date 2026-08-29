export const MAX_LOADING_IMAGES = 10
export const MIN_LOADING_IMAGES = 2

export function selectLoadingImages(images: readonly string[]) {
  return images.filter((src) => src.trim().length > 0).slice(0, MAX_LOADING_IMAGES)
}

export function hasEnoughLoadingImages(images: readonly string[]) {
  return images.length >= MIN_LOADING_IMAGES
}
