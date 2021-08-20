import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NavLink } from 'reactstrap';

const CustomNavLinkWrapper = ({ to, children }) => {
  const router = useRouter();
  return (
    <Link href={to}>
      <NavLink
        href={to}
        className="nav-link-icon m-0 p-0"
        active={router.pathname === to}
      >
        {children}
      </NavLink>
    </Link>
  );
};

export default CustomNavLinkWrapper;
