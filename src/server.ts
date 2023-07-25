import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const handleRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = req.url;

  if (!url || !url.startsWith("/")) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid URL");
    return;
  }

  const publicDirectoryPath = path.join(__dirname, "../public");
  const filePath = path.join(
    publicDirectoryPath,
    url === "/" ? "index.html" : url
  );

  fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      const ext = path.extname(filePath);
      let contentType = "text/plain";
      if (ext === ".html") {
        contentType = "text/html";
      } else if (ext === ".jpg") {
        contentType = "image/jpeg";
      } else if (ext === ".json") {
        contentType = "text/json";
      } else if (ext === ".ico") {
        contentType = "image/x-icon";
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
};

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 12345;
const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});
