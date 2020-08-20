import connect from "connect";
import serveStatic from "serve-static";

const DIRECTORY_NAME = './game';

connect()
    .use(serveStatic(DIRECTORY_NAME))
    .listen(8080, () => console.log('Server running on 8080...'));
