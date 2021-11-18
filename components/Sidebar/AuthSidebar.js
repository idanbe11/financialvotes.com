/*eslint-disable*/
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// nodejs library to set properties for components
import { PropTypes } from 'prop-types';

// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from 'reactstrap';
import { useSession, signOut } from 'next-auth/client';

function Sidebar(props) {
  // used for checking current route
  const router = useRouter();
  const [session, loading] = useSession();
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return router.route.indexOf(routeName) > -1;
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key} active={activeRoute(prop.layout + prop.path)}>
          <Link href={prop.layout + prop.path}>
            <NavLink
              href={prop.layout + prop.path}
              active={activeRoute(prop.layout + prop.path)}
              onClick={closeCollapse}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </Link>
        </NavItem>
      );
    });
  };
  const { routes, logo } = props;
  let navbarBrand = (
    <NavbarBrand href="#" className="pt-0">
      <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
    </NavbarBrand>
  );
  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo && logo.innerLink ? (
          <Link href={logo.innerLink}>
            <span>{navbarBrand}</span>
          </Link>
        ) : null}
        {logo && logo.outterLink ? (
          <a href={logo.innerLink} target="_blank">
            {navbarBrand}
          </a>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  {!loading && !!session && !!session.user && !!session.user.avatar ? (
                    <img alt="..." src={session.user.avatar.url} />
                  ) : (
                    <i
                      className="ni ni-circle-08 m-auto"
                      style={{ fontSize: '1.25rem', top: '0' }}
                    />
                  )}
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              {!loading && !!session && !!session.user && (
                <DropdownItem className="noti-title text-center" header tag="div">
                  <h6 className="text-overflow m-0">
                    Signed in as
                    <span className="p-1 text-info">{session.user.username}</span>
                  </h6>
                </DropdownItem>
              )}
              <Link href="/auth/orders">
                <DropdownItem>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
              </Link>
              <Link href="/auth/my-profile">
                <DropdownItem>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
              </Link>
              <DropdownItem divider />
              <DropdownItem
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                <i className="ni ni-curved-next" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link href={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Navigation */}
          <Nav navbar className="mt-6">
            {createLinks(routes)}
          </Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Navigation */}
          <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink href="/news">Crypto News</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/pages/faq">FAQ</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/pages/roadmap">Roadmap</NavLink>
            </NavItem>
          </Nav>
          <Nav className="mt-3">
            <NavItem active className="btn">
              <NavLink href="/auth/orders/new?type=advert">Advertise with us!</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link href="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

export default Sidebar;
