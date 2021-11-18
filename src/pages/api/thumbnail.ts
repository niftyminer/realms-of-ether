import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import qs from "query-string";

type ThumbnailData = {
  ruler: string | string[];
  relic: string | string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const dirRelativeToPublicFolder = "dynamic_thumbnail_template.html";

  let template = fs.readFileSync(
    path.resolve("./public", dirRelativeToPublicFolder),
    { encoding: "utf8" }
  );

  const data: ThumbnailData = {
    ruler: req.query.ruler,
    relic: req.query.relic,
  };

  Object.entries(data).forEach(([key, value]) => {
    template = template.replace(
      `%${key.toUpperCase()}%`,
      typeof value === "string" ? value : value && value.length ? value[0] : ""
    );
  });
  res.status(200).send(template);
}
