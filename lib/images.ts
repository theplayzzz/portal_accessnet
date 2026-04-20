const BLOB_PREFIX = "accessnet";

export function blobImg(path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/^images\//, "");
  return `/api/blob-img/${BLOB_PREFIX}/${clean}`;
}
