export async function getHtml(location: string) {
  const body = await fetch(
    `${location}`,
  );
  if (body.redirected || !body.ok) {
    return null;
  }
  return body.text();
}
