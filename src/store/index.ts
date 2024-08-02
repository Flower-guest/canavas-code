import { createPinia } from "pinia";
import { useWidGet } from "./modules/widget";

// pinia持久化
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();

pinia.use(createPersistedState());

export { useWidGet };

export default pinia;
