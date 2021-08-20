import React from 'react';
import { useRouter } from 'next/router';
// reactstrap components
import { Container } from 'reactstrap';
// core components
import AuthNavbar from 'components/Navbars/AuthNavbar';
import AdminFooter from 'components/Footers/AdminFooter';
import AuthSidebar from 'components/Sidebar/AuthSidebar';

import routes from 'routes/auth';

function Auth(props) {
  // used for checking current route
  const router = useRouter();
  let mainContentRef = React.createRef();
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };
  return (
    <>
      <AuthSidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: '/admin/index',
          imgSrc: require('assets/img/brand/fv-logo-large.png'),
          imgAlt: '...'
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AuthNavbar {...props} brandText={getBrandText()} />
        {props.children}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Auth;
