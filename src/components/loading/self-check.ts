import { hasEnoughLoadingImages, selectLoadingImages } from './loading-state.ts'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

assert(selectLoadingImages(['a', '', 'b']).length === 2, 'empty image paths are removed')
assert(selectLoadingImages(Array.from({ length: 12 }, (_, index) => String(index))).length === 10, 'image list is capped')
assert(hasEnoughLoadingImages(['a', 'b']), 'two valid images can animate')
assert(!hasEnoughLoadingImages(['a']), 'one valid image skips animation')
console.log('PASS loading image selection')
