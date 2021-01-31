export const token = {
  set: (s: string) => {
    uni.setStorageSync("Authorization", s)
  },
  get: () => {
    return uni.getStorageSync("Authorization")
  },
  clear: () => {
    uni.removeStorageSync("Authorization")
  },
}
