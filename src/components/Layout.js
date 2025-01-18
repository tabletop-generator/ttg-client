// Layout.js

// This file contains our navbar. It's used as a wrapper for our entire app in _app.js

import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser.attributes); // Attributes include email, name, etc.
        setIsLoggedIn(true);
      } catch (error) {
        console.log("No user logged in");
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  // Dynamic navigation links
  const navigation = [
    { name: "Discover", href: "#", current: true },
    ...(isLoggedIn ? [{ name: "Create", href: "#", current: false }] : []),
    {
      name: isLoggedIn ? "Profile" : "Log In / Sign Up",
      href: isLoggedIn ? "/profile" : "/login",
      current: false,
    },
  ];

  // User navigation for logged-in users
  const userNavigation = isLoggedIn
    ? [
        { name: "Personal Collections", href: "#" },
        {
          name: "Sign out",
          href: "#",
          onClick: async () => await Auth.signOut(),
        },
      ]
    : [];

  return (
    <div className="min-h-full" style={{ backgroundColor: "black" }}>
      <Disclosure as="nav" className="bg-gray-800 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img alt="TTG" src="/logo_256.png" className="size-16" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={item.onClick}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium",
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              {isLoggedIn && (
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Bell Icon */}
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Profile Dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt=""
                          src="/user-placeholder.png"
                          className="size-8 rounded-full"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            onClick={item.onClick}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </Disclosure>

      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
