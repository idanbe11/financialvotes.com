import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import NavLink from '../NavLink/NavLink';
import NavLinkWrapper from '../NavLink/NavLinkWrapper';

function AuthNavbar() {
  const [session, loading] = useSession();
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link href="/">
                    <img
                      alt="financialvotes-logo"
                      style={{ background: 'darkkhaki' }}
                      src={require('assets/img/brand/fv-logo-large.png')}
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <NavbarBrand href="#">
              <img
                alt="financialvotes-logo"
                src={require('assets/img/brand/fv-logo-large.png')}
              />
            </NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink to={'/'} name={'Home'} />
              </NavItem>
              <NavItem>
                <NavLink to={'/news'} name={'News'} />
              </NavItem>
              <NavItem>
                <NavLink to={'/contact'} name={'Contact'} />
              </NavItem>
              <NavItem className="my-auto">
                <NavLinkWrapper to={'/auth/coins/new'} name="Submit Coin">
                  <Button
                    color="warning"
                    type="button"
                    size="md"
                    className="text-nowrap m-md-0 mr-2 m-2"
                  >
                    Submit Coin
                  </Button>
                </NavLinkWrapper>
              </NavItem>
              {/* TODO: DARK MODE */}
              {/* <NavItem>
                <a
                  href="#"
                  className="nav-link-icon nav-link"
                  onClick={() => switchDarkMode()}
                >
                  {darkMode ? (
                    <div className="bg-transparent text-dark">
                      <i className="fas fa-moon" style={{ fontSize: '1.25rem' }} />
                    </div>
                  ) : (
                    <div className="bg-transparent text-white">
                      <i className="fas fa-sun" style={{ fontSize: '1.25rem' }} />
                    </div>
                  )}
                </a>
              </NavItem> */}
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      {!loading &&
                      !!session &&
                      !!session.user &&
                      !!session.user.avatar ? (
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
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AuthNavbar;
