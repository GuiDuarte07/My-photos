import { NextRouter } from 'next/router';

function refreshProps(router: NextRouter) {
  router.replace(router.asPath);
}

export default refreshProps;
