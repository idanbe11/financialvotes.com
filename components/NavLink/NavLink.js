import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NavLink } from 'reactstrap';

const CustomNavLink = ({ to, name }) => {
  const router = useRouter();
  return (
    <Link href={to}>
      <NavLink href={to} className="nav-link-icon" active={router.pathname === to}>
        <span className="nav-link-inner--text">{name}</span>
      </NavLink>
    </Link>
  );
};

export default CustomNavLink;
