import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
  Media
} from 'reactstrap';
import NavLink from '../NavLink/NavLink';
import NavLinkWrapper from '../NavLink/NavLinkWrapper';

function PagesNavbar() {
  const [session, loading] = useSession();
  const [darkMode, setDarkMode] = useState(false);

  const switchDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-light bg-green" expand="md">
        <Container className="px-4">
          <Link href="/admin/dashboard">
            <span>
              <NavbarBrand href="#">
                <img
                  alt="financialvotes-logo"
                  src={require('assets/img/brand/fv-logo-large.png')}
                />
              </NavbarBrand>
            </span>
          </Link>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse
            navbar
            toggler="#navbar-collapse-main"
            className="bg-green"
          >
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link href="/admin/dashboard">
                    <img
                      alt="financialvotes-logo"
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
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink to={'/'} name={'Home'} />
              </NavItem>
              <NavItem>
                <NavLink to={'/contact'} name={'Contact'} />
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
              <NavItem className="my-auto">
                {!loading && !!session && !!session.user ? (
                  <NavLinkWrapper to={'/auth/overview'}>
                    <Media className="align-items-center ">
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
                  </NavLinkWrapper>
                ) : (
                  <NavLinkWrapper to={'/auth/login'} name="Sign In">
                    <Button color="primary" type="button" size="md" className="">
                      Login
                    </Button>
                  </NavLinkWrapper>
                )}
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
}

export default PagesNavbar;
