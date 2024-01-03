import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import React from 'react';
import SVG from 'react-inlinesvg';
import { Link } from 'react-router-dom';
import HomeIcon from '~/assets/svg/home.svg';
import Box from '~/components/Box';

interface Route {
  path?: string;
  label?: string;
  icon?: React.ReactNode;
}

interface CustomBreadcrumbProps {
  pageName?: string;
  routes?: Route[];
  renderRight?: React.ReactNode;
}

const CustomBreadcrumb = ({
  pageName,
  routes = [],
  renderRight = <Box></Box>,
}: CustomBreadcrumbProps) => {
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem key="home">
          <Link to="/" className="text-zinc-500 hover:!text-zinc-700">
            <SVG src={HomeIcon} className="w-4 h-4" />
          </Link>
        </BreadcrumbItem>
        {routes.map((route, index) => (
          <BreadcrumbItem startContent={route?.icon} key={index}>
            {route?.path ? (
              <Link to={route.path} className="text-zinc-500 hover:!text-zinc-700">
                {route.label}
              </Link>
            ) : (
              <span className="text-zinc-500 hover:!text-zinc-700">{route.label}</span>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      <Box className="flex justify-between items-center">
        {pageName ? <h1 className="font-bold text-title-xl">{pageName}</h1> : <Box></Box>}
        {renderRight}
      </Box>
    </div>
  );
};

export default CustomBreadcrumb;
