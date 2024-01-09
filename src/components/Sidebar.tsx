import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SVG from 'react-inlinesvg';
import { NavLink, useLocation } from 'react-router-dom';

import Logo from '~/assets/images/logo/logo-pizza.png';
import { PATH_NAME } from '~/constants/router';
import routeSideBar from '~/routers/routeSideBar';
import SidebarLinkGroup from './SidebarLinkGroup';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target))
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <AnimatePresence>
      <aside
        id="side-bar"
        ref={sidebar}
        className={`absolute left-0 top-0 z-10 flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="bg-white flex items-center justify-between gap-2 px-6 py-[11px]">
          <NavLink to={PATH_NAME.STAFF_MANAGEMENT} className="mx-auto">
            <img src={Logo} alt="Logo" className="h-10" />
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-2 px-4 py-4 lg:px-6">
            {/* <!-- Menu Group --> */}
            {routeSideBar.map((item, index) => (
              <div key={index}>
                <h3 className="mb-[0.45rem] ml-4 text-sm font-semibold uppercase text-white">
                  {item.title}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {item.menu.map((menu, index) => {
                    return menu.child.length > 0 ? (
                      <SidebarLinkGroup
                        key={`${menu.key}-${index}`}
                        activeCondition={pathname === `${menu.path}`}
                      >
                        {(handleClick, open) => {
                          return (
                            <li key={`${menu.key}-${index} - ${index}`} className="list-none">
                              <NavLink
                                to={menu.path}
                                className={`group relative flex list-none items-center gap-2.5 rounded-sm px-4 py-2 font-normal text-white duration-300 ease-in-out `}
                                onClick={(e) => {
                                  e.preventDefault();
                                  sidebarExpanded ? handleClick?.() : setSidebarExpanded?.(true);
                                }}
                              >
                                <SVG
                                  src={menu.icon}
                                  style={{
                                    width: 35,
                                    height: 35,
                                    color: 'white',
                                  }}
                                />

                                {menu.title}
                                {menu.child.length > 0 && (
                                  <svg
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                      open && 'rotate-180'
                                    }`}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4146 9.73652 13.4146 9.41108 13.0892L4.41107 8.08922C4.08564 7.76378 4.08564 7.23614 4.41107 6.9107Z"
                                      fill=""
                                    />
                                  </svg>
                                )}
                              </NavLink>
                              <div
                                className={`translate transform overflow-hidden ${
                                  !open && 'hidden'
                                }`}
                              >
                                <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                  {menu.child.map((subMenu: any, index) => (
                                    <li key={index}>
                                      <NavLink
                                        to={subMenu.path}
                                        className={({ isActive }) =>
                                          'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:!text-white ' +
                                          (isActive && '!text-white')
                                        }
                                      >
                                        {subMenu.title}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          );
                        }}
                      </SidebarLinkGroup>
                    ) : (
                      <li key={`${menu.key}-${index}`} className="list-none">
                        <NavLink
                          to={menu.path}
                          className={`relative flex items-center gap-2.5 rounded-sm px-4 py-2 text-white transition-all ease-in-out hover:bg-white/10 dark:hover:!bg-[#005226] ${
                            pathname === `${menu.path}`
                              ? 'bg-white/10 dark:bg-white/10 font-semibold'
                              : 'font-normal'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <SVG src={menu.icon} className="w-5 h-5" />
                          {menu.title}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </AnimatePresence>
  );
};

export default Sidebar;
