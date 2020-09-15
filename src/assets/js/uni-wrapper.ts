import { ROUTE } from "@/assets/constant/common";

const {
  showToast,
  showModal,
  navigateTo,
  redirectTo,
  switchTab,
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
  async showModalText<T = [any, { cancel: boolean, confirm: boolean, errMsg: string} | null] >(content: string, showCancel: boolean = false): Promise<T> {
    if (this.isModal) return <T> <unknown> ['已经打开一个弹框了', null];
    this.isModal = true;
    const res = await showModal({
      title: "提示",
      content,
      showCancel,
    });
    this.isModal = false;
    return <T> <unknown> res;
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
  switchTabPage(url: string) {
    return switchTab({ url });
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
