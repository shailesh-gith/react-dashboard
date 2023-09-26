
export const setCookie = (cname, cvalue) => {
  if (cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + btoa(cvalue) + ';' + expires + ';path=/';
  }
};

export const getCookie = (cname) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0 && name.length !== c.length) {
      return atob(c.substring(name.length, c.length));
    }
  }
  return '';
};

export const deleteCookie = (cname) => {
  document.cookie = cname + '=; Path=/;max-age=0';
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name);
  }
};


export const queryParamsBuilder = (query) => {
  if (typeof query !== 'object') {
    return '';
  }
  const keys = Object.keys(query).filter(
    (b) => query[b] !== null && query[b] !== ''
  );
  if (keys.length) {
    return (
      '?' +
      new URLSearchParams(
        keys.reduce((a, b) => {
          a[b] = query[b];
          return a;
        }, {})
      ).toString()
    );
  }
  return '';
};

export function updateCacheData({ state, method, dispatch, extendedApi }, cb) {
  const { api } = state;
  let cacheArgToUpdate = [undefined];
  if (api) {
    cacheArgToUpdate = Object.keys(api.queries)
      .filter(
        (d) =>
          d.indexOf(`${method}(`) === 0 &&
          Object.keys(api.queries[d]).length > 0
      )
      .map((d) => api.queries[d].originalArgs);
  }
  return cacheArgToUpdate.forEach((originalArgs) =>
    dispatch(extendedApi.util.updateQueryData(method, originalArgs, cb))
  );
}
