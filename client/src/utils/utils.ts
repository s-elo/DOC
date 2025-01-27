/* eslint-disable @typescript-eslint/no-magic-numbers */
import { themes } from '@/theme';

export const localStore = (key: string) => {
  const value = window.localStorage.getItem(key);

  const setStore = (val: string) => {
    window.localStorage.setItem(key, val);
  };

  return { value, setStore };
};

/**
 * get the doc path based on the current router pathname
 */
export const getCurrentPath = (pathname: string) => {
  const paths = pathname.split('/');

  if (paths.length === 3) {
    return paths[2].split('-');
  } else {
    return [];
  }
};

export const isPathsRelated = (curPath: string[], path: string[], clickOnFile: boolean) => {
  // same file
  // or the current path is included in the path
  if (
    curPath.join('-') === path.join('-') ||
    (!clickOnFile &&
      curPath.length > path.length &&
      curPath.slice(0, curPath.length - (curPath.length - path.length)).join('-') === path.join('-'))
  ) {
    return true;
  }
  return false;
};

export const dragEventBinder = (callback: (e: MouseEvent) => void) => {
  document.addEventListener('mousemove', callback);

  const mouseupEvent = () => {
    document.removeEventListener('mousemove', callback);
    document.removeEventListener('mouseup', mouseupEvent);
  };

  document.addEventListener('mouseup', mouseupEvent);
};

export const smoothCollapse = (isCollapse: boolean, collapseCallbacks?: () => void, openCallbacks?: () => void) => {
  return (boxDom: HTMLDivElement) => {
    // only called when switching the collapse state
    if (isCollapse) {
      // when collapsing, add transition immediately
      if (!boxDom) return;
      boxDom.style.transition = 'all 0.4s ease-in-out';

      // wait for the collapsing finishing then execute the below callbacks
      if (!collapseCallbacks) return;

      const timer = setTimeout(() => {
        collapseCallbacks();
        clearTimeout(timer);
      }, 500);
    } else {
      // when to open the box, execute the below callbacks immediately
      if (openCallbacks) {
        openCallbacks();
      }

      // when opening the box, after finishing the transition (wati >= 0.4s)
      // remove the transition for the dragging
      const timer = setTimeout(() => {
        if (boxDom) boxDom.style.transition = 'none';

        clearTimeout(timer);
      }, 500);
    }
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, delay: number) => {
  let startTime = Date.now();
  let timer: NodeJS.Timeout | null = null;

  return function (this: unknown, ...rest: unknown[]) {
    const args = [...rest];

    const curTime = Date.now();
    const remain = delay - (curTime - startTime);

    if (timer) {
      clearTimeout(timer);
    }

    // call the fn at the beginning
    if (remain <= 0) {
      fn.apply(this, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, remain);
    }
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, delay: number, immediate = true) => {
  let timer: NodeJS.Timeout | null = null;

  return function (this: unknown, ...rest: unknown[]) {
    const args = [...rest];

    if (timer) {
      clearTimeout(timer);
    }

    if (immediate) {
      let flag = !timer;

      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
        flag = false;
      }, delay);

      // first time
      if (flag) fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
};

export const getImgUrl = (imgFile: File): string => {
  const Window = window;

  let url = '';
  if (Window.createObjectURL) {
    // basic
    url = Window.createObjectURL(imgFile);
  } else if (Window.URL) {
    // mozilla(firefox)
    url = Window.URL.createObjectURL(imgFile);
  } else if (Window.webkitURL) {
    // webkit or chrome
    url = Window.webkitURL.createObjectURL(imgFile);
  }

  return url;
};

export const hightLight = (word: string, inputs: string[], color = 'rgb(188, 54, 54)') => {
  const reg = new RegExp(`(${inputs.sort((a, b) => b.length - a.length).join('|')})`, 'gi');

  return word.replace(reg, (matchWord) => `<span style="background-color: ${color}">${matchWord}</span>`);
};

export const changeTheme = (themeName: string) => {
  const theme = themes[themeName as keyof typeof themes];

  for (const themeKey in theme) {
    document.body.style.setProperty(`--${themeKey}`, theme[themeKey as keyof typeof theme]);
  }
};

export const scrollToBottomListener = (container: HTMLElement, callback: () => void, bias = 3) => {
  const fn = () => {
    // the height of the container
    const containerHeight = container.scrollHeight;
    // the distance that the scroll bar has been scrolled
    const scrolledTop = container.scrollTop;
    // visible height of the container
    const visibleHeight = container.clientHeight;

    // visibleHeight + max(scrolledTop) = containerHeight

    //  the bias is make sure that
    //  the callback will be called when almost to the bottom
    if (scrolledTop + visibleHeight + bias > containerHeight) {
      callback();
    }
  };

  container.addEventListener('scroll', fn);

  return () => {
    container.removeEventListener('scroll', fn);
  };
};

export const dateFormat = (date: Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const config = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  };

  for (const key in config) {
    format = format.replace(key, String(config[key as keyof typeof config]));
  }

  return format;
};

export const isEqual = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
  function isObject(obj: unknown) {
    return typeof obj === 'object' && obj != null;
  }
  // not object
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }

  if (obj1 === obj2) return true;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key in obj1) {
    const res = isEqual(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>);

    if (!res) return false;
  }

  return true;
};

export function updateLocationHash(hash: string) {
  const location = window.location.toString().split('#')[0];
  history.replaceState(null, '', `${location}#${hash}`);
}
