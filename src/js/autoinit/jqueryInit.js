import { getjQuery, onDOMContentLoaded } from "../util/index";

const jqueryInit = (plugin) => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();

    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};

export default jqueryInit;
