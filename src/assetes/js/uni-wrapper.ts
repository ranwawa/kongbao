import { ROUTE } from "@/assetes/constant/common";

const { showToast, navigateTo, redirectTo } = uni;

class UniWrapper {
  showToastText(title: string) {
    showToast({
      title,
      icon: "none",
    });
  }
  navigateToPage(url: ROUTE) {
    navigateTo({
      url,
      fail(err) {
        console.error(err);
      },
    });
  }
  redirectToPage(url: ROUTE) {
    redirectTo({
      url,
      fail(err) {
        console.error(err);
      },
    });
  }
}

export const uniWrapper = new UniWrapper();
