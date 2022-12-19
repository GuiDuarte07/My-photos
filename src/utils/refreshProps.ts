import { NextRouter } from 'next/router';

function refreshProps(router: NextRouter) {
  console.log('replace', router.asPath);
  router.replace(router.asPath);
}

export default refreshProps;
