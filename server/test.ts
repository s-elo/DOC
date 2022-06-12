import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import docer from "./Docer";
const docRootPath = docer.docRootPath;

// const newContent = `# Header`;
// additDoc(path.resolve(__dirname, "./test/article/a3.md"), newContent);
// modifyName("sort/sort", "newTree", true);

const getGitStatus = async (git: SimpleGit) => {
  try {
    // created: untracked files that have been staged
    const { not_added, staged, deleted, modified, created } =
      await git.status();

    const ret = await git.status();
    console.log(ret);

    const workSpace = [
      ...not_added
        // .filter((change) => !staged.includes(change))
        .map((change) => ({
          changePath: change,
          status: "UNTRACKED",
        })),
      ...deleted
        .filter((change) => !staged.includes(change))
        .map((change) => ({
          changePath: change,
          status: "DELETED",
        })),
      ...modified
        .filter((change) => !staged.includes(change))
        .map((change) => ({
          changePath: change,
          status: "MODIFIED",
        })),
    ];

    return {
      workSpace,
      staged: [
        ...deleted
          .filter((change) => staged.includes(change))
          .map((change) => ({
            changePath: change,
            status: "DELETED",
          })),
        ...modified
          .filter((change) => staged.includes(change))
          .map((change) => ({
            changePath: change,
            status: "MODIFIED",
          })),
        ...created
          // .filter((change) => !staged.includes(change))
          .map((change) => ({
            changePath: change,
            status: "ADDED",
          })),
      ],
    };
  } catch {
    return "NOTGIT";
  }
};

const gitTest = async (path: string) => {
  const git = simpleGit(path);
  // const hasGit = await git.checkIsRepo();
  // not_added can not be restored, need to be deleted to "restore"
  // const res = await git.raw(["restore", "test/test1.md"]);
  // const res = await git.raw(["restore", "--staged", "test/test2.md", "test/test3.md"]);
  // const res = await git.add(["test/test3.md", "test/test2.md"]);
  // console.log(hasGit, res);
  const status = await getGitStatus(git);
  console.log(status);

  //   const pullRet = await git.pull();
  //   console.log(pullRet);
  // const { tracking } = await git.status();
  // git.add("./*");
  // git.commit("just for test");
  // git.push(tracking?.split("/"));
  //   if ((await git.pull())?.summary.changes) {
  //     console.log()
  //   }
  //   const commands = ["status"];)
  //   const ret = await git.raw(commands);
  //   console.log(ret);
};

gitTest(docRootPath);
