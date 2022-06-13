import { useHistory, useLocation } from "react-router-dom";
import { getCurrentPath, isPathsRelated, localStore } from "../utils";

export const useDeleteHandler = () => {
  const routerHistory = useHistory();
  const { pathname } = useLocation();

  return (deletedPath: string, isFile: boolean) => {
    const currentPath = getCurrentPath(pathname);

    // jump if the current doc is deleted or included in the deleted folder
    if (isPathsRelated(currentPath, deletedPath.split("-"), isFile)) {
      const { setStore: storeRecentPath } = localStore("recentPath");
      storeRecentPath(`/purePage`);

      routerHistory.push("/purePage");
    }
  };
};

export const useCopyCutHandler = () => {
  const routerHistory = useHistory();
  const { pathname } = useLocation();

  return (
    copyCutPath: string,
    pastePath: string,
    isCut: boolean,
    isFile: boolean
  ) => {
    // if it is cut and current path is included in it, redirect
    const curPath = getCurrentPath(pathname);
    if (isCut && isPathsRelated(curPath, copyCutPath.split("-"), isFile)) {
      // if it is a file, direct to the paste path
      if (isFile) {
        routerHistory.push(`/article/${pastePath}`);
      } else {
        const curFile = curPath
          .slice(
            curPath.length - (curPath.length - copyCutPath.split("-").length)
          )
          .join("-");

        routerHistory.push(`/article/${pastePath}-${curFile}`);
      }
    }
  };
};