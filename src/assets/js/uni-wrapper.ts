import { ROUTE } from "@/assets/constant/common";

const {
  showToast,
  showModal,
  navigateTo,
  redirectTo,
  showLoading,
  hideLoading,
} = uni;

class UniWrapper {
  isLoading: boolean = false;
  isModal: boolean = false;
  showToastText(title: string) {
    return showToast({
      title,
      icon: "none",
    });
  }
  async showModalText(content: string, showCancel: boolean = false) {
    if (this.isModal) return;
    this.isModal = true;
    const res = await showModal({
      title: "提示",
      content,
      showCancel,
    });
    this.isModal = false;
    return res;
  }
  navigateToPage(url: string) {
    return navigateTo({
      url,
      fail(err) {
        console.error(err);
      },
    });
  }
  redirectToPage(url: string) {
    return redirectTo({
      url,
      fail(err) {
        console.error(err);
      },
    });
  }
  async showLoadingText(title: string = "正在加载") {
    if (this.isLoading) return;
    const res = await showLoading({ title });
    this.isLoading = true;
    return res;
  }
  hideLoading() {
    this.isLoading = false;
    return hideLoading();
  }
}

export const uniWrapper = new UniWrapper();
