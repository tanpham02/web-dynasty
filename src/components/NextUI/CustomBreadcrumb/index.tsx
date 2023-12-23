import { BreadcrumbItem, Breadcrumbs, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import HomeIcon from "~/assets/svg/home.svg";
import { PATH_NAME } from "~/constants/router";

interface Route {
  path?: string;
  label?: string;
  icon?: React.ReactNode;
}

interface CustomBreadcrumbProps {
  pageName?: string;
  routes?: Route[];
}

const CustomBreadcrumb = ({ pageName, routes = [] }: CustomBreadcrumbProps) => {
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem key="home">
          <Link href="/" className="text-zinc-500 hover:!text-zinc-700">
            <SVG src={HomeIcon} className="w-4 h-4" />
          </Link>
        </BreadcrumbItem>
        {routes.map((route, index) => (
          <BreadcrumbItem startContent={route?.icon} key={index}>
            <Link
              href={route?.path}
              className="text-zinc-500 hover:!text-zinc-700"
            >
              {route.label}
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      {pageName && <h1 className="font-bold text-title-xl">{pageName}</h1>}
    </div>
  );
};

export default CustomBreadcrumb;
