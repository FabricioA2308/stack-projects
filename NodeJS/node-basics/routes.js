const fs = require("fs");

const routingHandler = (req, res) => {
  const method = req.method;
  const url = req.url;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'/><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method == "POST") {
    const body = [];
    req.on("data", (chunk) => {
      // Listener for data, which receives a chunk and pushes it into an array
      body.push(chunk);
      console.log(chunk);
    });

    return req.on("end", () => {
      // Listener for end, which node fires automatically after receiving all data chunks, the buffer obj concatenates them together

      const parsedBody = Buffer.concat(body).toString();
      // Concatenates the entire array of chunks into a buffer, then converts it into a string

      const message = parsedBody.split("=")[1];

      fs.writeFile("messages.txt", message, () => {
        res.writeHead(302, ["Location", "/"]); // Navigate to '/'
        return res.end();
      });
    });
  }
};

module.exports = routingHandler;
