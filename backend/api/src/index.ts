import { app } from "./app";
import { port } from "./services/config";


app.listen(port, () => console.log(`listening on port ${port}`));