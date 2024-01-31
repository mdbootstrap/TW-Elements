'use strict';

import { DPL } from '../../dynamic-parts-loader.js';

export const isUserSubProGlobal = DPL.defineComponent({
  selector: '#dpl-mdb-is-user-pro-sub-global',
  template: (userData) => {
    return `<script>var mdbIsUserProSubscriptionGlobal = ${userData.isProSubscription ? 'true' : 'false'};</script>`;
  },
  mounted(userData) {
    window.mdbIsUserProSubscriptionGlobal = userData.isProSubscription;
  },
});
