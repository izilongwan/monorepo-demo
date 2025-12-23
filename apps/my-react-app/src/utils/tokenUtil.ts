export const tokenUtil = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',

  setRefreshToken(token: string) {
    localStorage.setItem(this.refresh_token, token);
  },

  setAccessToken(token: string) {
    localStorage.setItem(this.access_token, token);
  },

  getAccessToken() {
    return localStorage.getItem(this.access_token);
  },

  getRefreshToken() {
    return localStorage.getItem(this.refresh_token);
  },

  clearTokens() {
    this.removeAccessToken();
    this.removeRefreshToken();
  },

  removeAccessToken() {
    localStorage.removeItem(this.access_token);
  },

  removeRefreshToken() {
    localStorage.removeItem(this.refresh_token);
  },

  parseTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.href);
    const access_token = urlParams.get(this.access_token);
    const refresh_token = urlParams.get(this.refresh_token);
    access_token && this.setAccessToken(access_token);
    refresh_token && this.setRefreshToken(refresh_token);
    return access_token && refresh_token;
  }
};
