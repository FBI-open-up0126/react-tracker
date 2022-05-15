export function listURL(listName: string) {
  const uri = encodeURI(`/list/${listName}`);
  return uri;
}
