const customCarouselArrow = (value: number) => {
     if (value <= 319) {
          return false
     } else if (value <= 768) {
          return false
     }
     return true
}

export { customCarouselArrow }