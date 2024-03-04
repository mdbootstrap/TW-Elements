import defaultInitSelectors from "./initSelectors/free";
import { InitTWE } from "./index";

const initTWEInstance = new InitTWE(defaultInitSelectors);
const initTWE = initTWEInstance.initTWE;

export default initTWE;
