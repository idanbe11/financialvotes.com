/*eslint-disable*/
import React from 'react';
import Link from 'next/link';

// reactstrap components
import { NavItem, Nav, Container, Row, Col } from 'reactstrap';

function Login() {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                <img
                  alt="financialvotes-logo"
                  className="mr-3"
                  src={require('assets/img/brand/favicon.png')}
                />
                © {new Date().getFullYear()}{' '}
                <a className="font-weight-bold text-success ml-1" href="#">
                  FinancialVotes
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                {/* <NavItem>
                  <Link href="/about">
                    <a className="nav-link">About Us</a>
                  </Link>
                </NavItem> */}
                <NavItem>
                  <Link href="/contact">
                    <a className="nav-link">Contact Us</a>
                  </Link>
                </NavItem>
                {/* <NavItem>
                  <Link href="/blog">
                    <a className="nav-link">Blog</a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/news">
                    <a className="nav-link">News</a>
                  </Link>
                </NavItem> */}
                <NavItem>
                  <Link href="/terms-and-conditions">
                    <a className="nav-link">T{`&`}C</a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/privacy-policy">
                    <a className="nav-link">Privacy Policy</a>
                  </Link>
                </NavItem>
              </Nav>
            </Col>
            {/* <Col xl="12">
              <div className="copyright text-center text-xl-right text-info">
                <small>
                  Designed with ❤ by
                  <a
                    className="font-weight-bold ml-1"
                    href="https://foxploit.tech?ref=template-auth-footer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TEAM
                    <span className="text-secondary">FOXPLOIT</span>
                  </a>
                </small>
              </div>
            </Col> */}
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Login;
