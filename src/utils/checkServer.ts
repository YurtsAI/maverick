import fetch from "node-fetch";

export async function checkServer(port: number) {
  return await fetch(`http://localhost:${port}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.text());
}
