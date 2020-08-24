const { showToast } = uni;

class UniWrapper {
  showToastText(title: string) {
    showToast({
      title,
      icon: 'none',
    })
  }
}

export const uniWrapper = new UniWrapper();
