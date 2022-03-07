import express from "express";
import { Fields } from "formidable";

import { pathConvertor } from "../docsOperaiton";

const router = express.Router();

type CreateDocFields = Fields & {
  path: string;
  isFile: boolean;
};

router.post("/createDoc", (req, res) => {
  const { path, isFile } = req.fields as CreateDocFields;

  const createPath = pathConvertor(path, isFile);
  console.log(createPath);
  try {
    return res.send({ err: 0 });
  } catch (err) {
    return res.send({ err: 1 });
  }
});

export default router;