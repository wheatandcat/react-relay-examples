import * as Datastore from "@google-cloud/datastore";
import { search } from "./paging";

const kind = "User";

export const user = async (datastore, key) => {
  const query = await datastore.createQuery(kind).filter("key", "=", key);
  const result = await datastore.runQuery(query);

  return result[0][0] || null;
};

export const users = async (datastore, startCursor = "") => {
  let q = await datastore
    .createQuery(kind)
    .order("key", {
      descending: false
    })
    .limit(5);

  if (startCursor) {
    q = await q.start(startCursor);
  }

  const result = await datastore.runQuery(q);

  const pageInfo = await search(
    datastore,
    kind,
    startCursor,
    result[1].endCursor
  );

  const r = {
    items: result[0],
    pageInfo
  };

  console.log(r);

  return r;
};
