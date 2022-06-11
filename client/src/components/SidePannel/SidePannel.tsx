import React from "react";
import { useSelector } from "react-redux";
import { useGetDocQuery } from "@/redux-api/docsApi";
import { selectCurPath, selectCurScrollTop } from "@/redux-feature/curDocSlice";

import PureOutline from "../Outline/PureOutline";

import "./SidePannel.less";

export default function SidePannel() {
  const curPath = useSelector(selectCurPath);
  const scrollTop = useSelector(selectCurScrollTop);

  const {
    data: curDoc = { headings: [] as string[], keywords: [] as string[] },
  } = useGetDocQuery(curPath);

  const { headings, keywords } = curDoc;

  return (
    <aside className="side-pannel">
      <div
        className={`operation-icon go-to-top ${
          scrollTop <= 100 ? "hidden" : ""
        }`}
        title="go to the top"
        role="button"
        onClick={() => {
          const milkdownDom = document.getElementsByClassName("milkdown")[0];
          milkdownDom.scroll({ top: 0, behavior: "smooth" });
        }}
      >
        <span className="material-icons-outlined icon-btn">north</span>
      </div>
      <div className="operation-icon side-outline">
        <span className="material-icons-outlined icon-btn">view_list</span>
        <div className="outline-box content-outline">
          <PureOutline
            headings={headings}
            keywords={keywords}
            path={curPath.split("-")}
          />
        </div>
      </div>
    </aside>
  );
}